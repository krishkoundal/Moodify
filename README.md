# 🎵 Moodify - Your Music, Your Mood

**Moodify** is a sophisticated, full-stack music discovery platform designed to bridge the gap between human emotions and digital audio. Built with **Next.js 15**, it offers a personalized, interactive, and visually stunning experience that adapts to the listener's environment.

---

## ✨ Key Features

- 🎭 **AI Mood Detection:** Leverages `face-api.js` to analyze user facial expressions and suggest music matching their current emotional state (Happy, Sad, Energetic, etc.).
- 🎥 **Dynamic Visuals:** High-fidelity, full-screen video backgrounds that change based on the active track or page context (e.g., Gojo vs Sukuna for intense tracks).
- 🔍 **YouTube-Powered Discovery:** Seamless integration with YouTube to fetch and play trending tracks, genres, and high-quality thumbnails.
- 🔐 **Secure Authentication:** Robust user authentication flow including email verification with OTP (Nodemailer) and hashed password security (bcrypt).
- 📱 **Premium UI/UX:** A modern, glassmorphic interface inspired by industry-leading music apps, optimized for both aesthetic appeal and performance.
- 🎨 **Responsive Design:** Fully responsive layout using Tailwind CSS, ensuring a seamless experience across desktop and mobile devices.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 15 (App Router), React 19, Tailwind CSS, Framer Motion
- **Backend:** Next.js API Routes, MongoDB (via Mongoose)
- **AI/ML:** face-api.js
- **Utilities:** Lucide React (Icons), React Player (Playback), Nodemailer (OTP)
- **Authentication:** NextAuth.js, bcryptjs

---

## 🚀 Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/moodify.git
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env.local` file and add your credentials:
   ```env
   MONGODB_URI=your_mongodb_uri
   GMAIL_USER=your_email
   GMAIL_PASS=your_app_password
   NEXTAUTH_SECRET=your_secret
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

---

## 🛡️ Disclaimer

This is a personal portfolio project built for **educational purposes** to demonstrate full-stack development skills, API integrations, and modern UI design practices. No copyright infringement is intended.

---

*Built with ❤️ by Krish Koundal*
