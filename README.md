# 🎓 CareerDost — Jobs, Scholarships & Opportunities Portal

[![GitHub Repository](https://img.shields.io/badge/GitHub-CareerDost-blue?style=flat-square&logo=github)](https://github.com/FaizanAli221/CareerDost.git)
[![React](https://img.shields.io/badge/Frontend-React_18-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Bundler-Vite_5-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS_3-38BDF8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Cloudflare Pages](https://img.shields.io/badge/Deploy-Cloudflare_Pages-F38020?style=flat-square&logo=cloudflare)](https://pages.cloudflare.com/)

**CareerDost** is a comprehensive portal dedicated to government vacancies, private sector jobs, bank careers, IT job listings, scholarships, internships, admissions, and results across Pakistan. It features an intuitive, fast, and accessible interface built for job seekers along with a full admin content management portal.

---

## 📱 Social Media & Official Contact

Stay connected with us for daily job updates, announcements, and inquiries:

- 💬 **WhatsApp Contact / Community:** [03173425680](https://wa.me/923173425680) (`https://wa.me/923173425680`)
- 🌐 **Facebook Page:** [CareerDost](https://facebook.com/CareerDost) (`https://facebook.com/CareerDost`)
- 🐙 **GitHub Repository:** [FaizanAli221/CareerDost](https://github.com/FaizanAli221/CareerDost.git)

---

## ✨ Features

- **Comprehensive Categories:** Latest Jobs, Government Jobs, Private Jobs, Bank Jobs, IT Jobs, Scholarships, Internships, Admissions, Government Schemes, and Exam Results.
- **Fast Search & Filter:** Instant search by job title, department/organization, location, and qualification requirement.
- **Detailed Opportunity Views:** Complete job specs, key facts panel, official link references, closing dates, and related opportunities.
- **Admin CMS Dashboard (`/admin`):** Secure interface to create, edit, publish, draft, and manage listings and categories.
- **SEO & Performance Optimized:** Dynamic meta tags, canonical URL routing, clean semantic HTML structure, and lightweight CSS.
- **Cloudflare Native:** Built for deployment on Cloudflare Pages with Cloudflare D1 (SQLite database) backend serverless integration.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, React Router DOM v6, Vite, Tailwind CSS, PostCSS.
- **Backend & Database:** Hono Framework, Cloudflare D1 (SQLite), Wrangler CLI.
- **Deployment:** Cloudflare Pages with client-side SPA routing support (`_redirects`).

---

## 📂 Project Structure

```text
g:/Carreer-dost/
├── public/                # Static assets & Cloudflare redirect configurations
│   ├── _redirects         # SPA route redirection rules
│   └── favicon.svg
├── src/
│   ├── components/        # UI Header, Footer, Cards, Listing Rows, Category Tags
│   ├── data/              # Static category listings and data definitions
│   ├── lib/               # Custom hooks (e.g. useSeo)
│   ├── pages/             # Home, Article, Category, Search, Admin, About, Contact, Legal
│   ├── App.jsx            # Application Router & Routing configuration
│   ├── main.jsx           # Entry point
│   └── index.css          # Tailwind CSS configuration & custom utilities
├── server/                # Hono server API routes
├── functions/             # Cloudflare Pages Functions serverless endpoints
├── schema.sql             # SQLite Database table definitions for Cloudflare D1
├── wrangler.toml          # Cloudflare Pages & D1 Database bindings
└── package.json           # Dependencies & NPM scripts
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18.x or higher)
- npm or pnpm

### Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/FaizanAli221/CareerDost.git
   cd CareerDost
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

4. **Build for Production:**
   ```bash
   npm run build
   ```

5. **Deploy to Cloudflare Pages:**
   ```bash
   npm run deploy
   ```

---

## 🗄️ Database Setup (Cloudflare D1)

To apply the database schema locally or in production:

```bash
# Apply schema to Cloudflare D1
npx wrangler d1 execute careerdost-db --file=schema.sql
```

---

## 📄 License & Attribution

Developed by **Faizan Ali** for CareerDost. All rights reserved.
