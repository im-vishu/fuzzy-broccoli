# 🌸 Velora — Your Future in Smarter Beauty Choices

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Contributors](https://img.shields.io/github/contributors/<your-username>/velora)
![Issues](https://img.shields.io/github/issues/<your-username>/velora)
![Stars](https://img.shields.io/github/stars/<your-username>/velora?style=social)
![Forks](https://img.shields.io/github/forks/<your-username>/velora?style=social)

**Velora** is a modern beauty-tech platform built to help users discover smarter product alternatives, share authentic reviews, and engage in real-time beauty conversations.  
Currently focused on **cosmetic dupes**, Velora is designed with scalability in mind — evolving into a full ecosystem for beauty, wellness, and lifestyle communities.  

---

## 🚀 Features

- 🔍 **Product Discovery** – Search branded cosmetics and explore affordable dupes.  
- 👤 **User Accounts** – Secure authentication with role-based access (User/Admin).  
- ✍️ **Community Submissions** – Users suggest dupes → Admin reviews → Published live.  
- ⭐ **Reviews & Ratings** – Honest feedback from the community.  
- 💬 **Realtime Chat** – Threaded product discussions powered by Supabase Realtime.  
- 📝 **Content Hub** – Blog system (MDX/Sanity CMS) for SEO, guides, and education.  
- 📊 **Admin Dashboard** – Manage products, dupes, reviews, and articles.  
- 📱 **Mobile-First** – Optimized for a smooth experience on all devices.  
- ⚡ **Edge Deployment** – Hosted on Vercel for ultra-fast performance.  

---

## 🛠 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)  
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)  
- **Database & Auth**: [Supabase](https://supabase.com/) (Postgres + RLS)  
- **Realtime**: Supabase Realtime / Pusher  
- **Content**: MDX / Sanity CMS  
- **Hosting**: [Vercel](https://vercel.com/)  
- **Analytics**: [Plausible](https://plausible.io/)  

---

## 📂 Project Structure
   velora/
   │── app/
   │ ├── (auth)/ # Login, Register
   │ ├── (products)/ # Product pages, dupes
   │ ├── (blog)/ # Blog articles
   │ ├── admin/ # Admin dashboard
   │ ├── api/ # API routes
   │ └── layout.tsx
   │── components/
   │ ├── ui/ # Reusable UI components
   │ ├── product/ # Product cards, reviews
   │ ├── chat/ # Chat components
   │── lib/
   │ ├── supabase.ts # Supabase client
   │ ├── auth.ts # Auth helpers
   │── public/ # Static assets
   │── styles/ # Global styles


---

## 🧑‍💻 Getting Started

Clone the repo and install dependencies:

```bash
git clone https://github.com/<your-username>/velora.git
cd velora
npm install


NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key


npm run dev


🌍 Deployment
Deploy frontend with Vercel (1-click).
Connect Supabase project for Database, Auth, and Realtime.
Optional: Add Plausible Analytics for privacy-friendly traffic tracking.

🤝 Contributing
We welcome contributions!
🐛 Report issues
✨ Suggest new features
🔧 Submit pull requests
📌 Roadmap (Future Vision)

Velora is built with the future in mind:
🛍 Expansion beyond cosmetics → lifestyle, wellness, and fashion alternatives.
🔗 AI-powered recommendations for personalized dupes.
📲 Native mobile app with offline features.
🌐 Multi-language support for a global community.

📜 License
This project is licensed under the MIT License.

💡 Tagline Ideas
Velora – Smarter choices in beauty.
Velora – Where beauty meets transparency.
Velora – Discover, review, connect.
