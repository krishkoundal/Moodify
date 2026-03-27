import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "./mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        await dbConnect();
        
        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("No user found with this email");
        }

        if (!user.isVerified) {
          throw new Error("Please verify your account first");
        }

        const isMatch = await bcrypt.compare(credentials.password, user.password);

        if (!isMatch) {
          throw new Error("Invalid password");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
        };
      }
    })
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }: any) {
      if (user) {
        token.id = user.id;
        token.image = user.image;
        token.name = user.name;
      }
      
      // Handle manual session updates
      if (trigger === "update" && session?.image) {
        token.image = session.image;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.image = token.image as string;
        session.user.name = token.name as string;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
