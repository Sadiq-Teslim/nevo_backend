# nevo_backend

Hackathon-ready backend for Nevo app. Built with Node.js, Express, Mongoose, MongoDB. Implements authentication, user linking, AI diagnosis, lesson personalization, and all required endpoints.

## Features

- JWT Auth & Roles (Student, Teacher, Parent)
- User linking via email
- Diagnostic engine (rule-based + AI)
- Lesson upload & personalization (AI)
- Full API for dashboard, progress, and parent tracking

## Tech Stack

- Node.js / Express
- MongoDB (via Mongoose)
- Gemini 2.5 Pro API for AI
- Railway/Render for deployment

## Setup

1. Install dependencies: `npm install`
2. Set up `.env` for MongoDB URI, JWT secret, and Gemini API key
3. Start server: `npm run dev`

See `API_README.md` for endpoint details, payloads, and sample responses.

## Deployment

- Recommended: Render.com for backend
- MongoDB Atlas for database
- Supabase Storage or AWS S3 for files

See `.github/copilot-instructions.md` for build steps and progress tracking.
