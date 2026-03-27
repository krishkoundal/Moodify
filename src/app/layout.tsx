import type { Metadata } from "next";
import "./globals.css";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";
import { Providers } from "@/components/Providers";
import { MoodProvider } from '@/lib/moodContext';

export const metadata: Metadata = {
  title: 'Moodify — Music that Understands You',
  description: 'AI-powered music streaming that adapts to your emotions.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white selection:bg-purple-500/30">
        <Providers>
          <MoodProvider>
            <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
          </MoodProvider>
        </Providers>
      </body>
    </html>
  );
}
