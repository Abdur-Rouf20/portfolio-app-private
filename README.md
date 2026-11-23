# Engineering Portfolio CMS

A full-stack MERN portfolio website with a public-facing portfolio and protected admin CMS.

## Stack
- Frontend: React + Vite + React Router
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Authentication: JWT in an HTTP-only cookie
- Styling: responsive custom CSS

## Features in this starter
- Public home, about, projects, experience, certifications and contact sections
- Admin login and protected dashboard
- CRUD management for projects, experience, skills and certifications
- Contact form with messages stored in MongoDB
- Seed script for an initial administrator and sample portfolio content
- Basic validation, centralized error handling and security headers

## Requirements
- Node.js 20+
- MongoDB local instance or MongoDB Atlas database

## 1. Backend setup
```bash
cd backend
copy .env.example .env
npm install
npm run seed
npm run dev
```
On PowerShell, `copy` works. Edit `backend/.env` before running the seed command.

## 2. Frontend setup
Open another terminal:
```bash
cd frontend
npm install
npm run dev
```
Open the Vite URL shown in the terminal (normally http://localhost:5173).

## Default seeded admin
The seed script reads `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `backend/.env`.
Change these values before running the seed script. Do not use a weak password.

## Environment
See `backend/.env.example` and `frontend/.env.example`.

## Important before production
This is the application foundation, not a production deployment configuration.
Before exposing it publicly:
- Set a long, unique JWT secret and strong admin password.
- Set `CLIENT_ORIGIN` and `VITE_API_URL` to your deployed domains.
- Use HTTPS and a managed MongoDB deployment.
- Configure backups, rate limits, logging and email delivery.
- Review all content and replace sample portfolio records.
- Do not commit `.env` files or secrets.

Testing, Newman, JMeter, Docker, Nginx and CI/CD are intentionally out of scope for this first application phase.
