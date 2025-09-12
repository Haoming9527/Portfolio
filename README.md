# 🚀 Portfolio

A modern, full-stack portfolio website built with Next.js 15, featuring dynamic content management, user authentication, and interactive components.

![Portfolio Preview](https://img.shields.io/badge/Next.js-15.5.0-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🎨 **Modern UI/UX**
- Responsive design with mobile-first approach
- Dark/light mode support
- Smooth animations and transitions
- Gradient text effects and modern styling
- Interactive hover effects and micro-interactions

### 📱 **Core Pages**
- **Home**: Introduction, about section, and technology showcase
- **Projects**: Dynamic project gallery with Sanity CMS integration
- **Certificates**: Professional certifications and achievements display
- **Guestbook**: Interactive message board with user authentication

### 🔐 **Authentication & Security**
- Kinde Auth integration for secure user management
- XSS protection for user-generated content
- Input validation and sanitization
- Secure API routes with proper error handling

### 🗄️ **Database & CMS**
- PostgreSQL database with Prisma ORM
- Sanity CMS for content management
- Real-time data fetching with caching
- Optimized database queries

### 🛠️ **Developer Experience**
- TypeScript for type safety
- ESLint configuration for code quality
- Winston logging system
- Hot reload with Turbopack
- Comprehensive error handling

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.0
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Animations**: Tailwind CSS Animate

### Backend & Database
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: Kinde Auth
- **CMS**: Sanity
- **API**: Next.js API Routes

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint
- **Logging**: Winston with daily rotation
- **Build Tool**: Turbopack
- **Security**: XSS protection

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Sanity account
- Kinde Auth account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Haoming9527/Portfolio
   cd Portfolio
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/portfolio"
   
   # Kinde Auth
   KINDE_CLIENT_ID=your_kinde_client_id
   KINDE_CLIENT_SECRET=your_kinde_client_secret
   KINDE_ISSUER_URL=https://your-domain.kinde.com
   KINDE_SITE_URL=http://localhost:3000
   KINDE_POST_LOGOUT_REDIRECT_URL=http://localhost:3000
   KINDE_POST_LOGIN_REDIRECT_URL=http://localhost:3000
   
   # Sanity
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_TOKEN=your_sanity_api_token
   ```

4. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
portfolio/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── components/        # React components
│   ├── lib/              # Utility functions
│   ├── projects/         # Projects page
│   ├── certificates/     # Certificates page
│   └── guestbook/        # Guestbook page
├── components/           # Shared UI components
├── lib/                 # Generated Prisma client
├── prisma/              # Database schema
├── sanity/              # Sanity CMS configuration
└── public/              # Static assets
```

## 🎯 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio
- `npx prisma generate` - Generate Prisma client

## 🔧 Configuration

### Sanity CMS Setup
1. Create a new Sanity project
2. Configure schemas for projects and certificates
3. Add your Sanity credentials to environment variables

### Kinde Auth Setup
1. Create a Kinde account
2. Set up your application
3. Configure redirect URLs
4. Add credentials to environment variables

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables
4. Deploy!

### Other Platforms
The application can be deployed on any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify



---

⭐ Star this repository if you found it helpful!
This repository contains the source code for a personal portfolio website designed to showcase projects, skills, and professional experience. The website is built using modern web technologies to ensure a responsive, user-friendly, and visually appealing presentation.
