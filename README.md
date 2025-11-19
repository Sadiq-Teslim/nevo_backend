# nevo_backend

Hackathon-ready backend for Nevo app. Built with Node.js, Express, Prisma ORM, PostgreSQL. Implements authentication, user linking, AI diagnosis, lesson personalization, and all required endpoints.

## Features
- JWT Auth & Roles (Student, Teacher, Parent)
- User linking via email
- Diagnostic engine (rule-based + AI)
- Lesson upload & personalization (AI)
- Full API for dashboard, progress, and parent tracking

## Tech Stack
- Node.js / Express
- PostgreSQL
- Prisma ORM
- Gemini API for AI
- Supabase/NeonDB for DB
- Railway/Render for deployment

## Setup
1. Install dependencies: `npm install`
2. Set up `.env` for DB and API keys
3. Run migrations: `npx prisma migrate dev`
4. Start server: `npm run dev`

## Deployment
- Recommended: Render.com for backend, Supabase/NeonDB for DB, Supabase Storage/AWS S3 for files

---
See `.github/copilot-instructions.md` for build steps and progress tracking.
