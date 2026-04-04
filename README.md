<div align="center">

<br />

# ⚖️ Legal Intake System

**A full-stack, multi-persona legal case management platform — built for law firms to manage client intake, case workflows, real-time collaboration, and AI-powered document intelligence.**

<br />

[![Fastify](https://img.shields.io/badge/Backend-Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white)](https://fastify.dev/)
[![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://vitejs.dev/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docs.docker.com/compose/)
[![AWS](https://img.shields.io/badge/Deployed-AWS%20EC2-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://aws.amazon.com/ec2/)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com/features/actions)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

<br />

[Features](#-features) · [Architecture](#-architecture) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [Environment Variables](#-environment-variables) · [Docker](#-docker--deployment) · [CI/CD](#-cicd-pipeline) · [Screenshots](#-screenshots)

<br />

</div>

---

## 📌 Overview

The **Legal Intake System** is a production-ready web application designed for law firms to manage the full lifecycle of a legal case — from initial client intake through lawyer assignment, document handling, hearing scheduling, and final resolution.

Three distinct user personas — **Admin**, **Client**, and **Lawyer** — each have purpose-built dashboards and workflows. The system ships fully dockerized, deployed on AWS EC2, and integrated with a GitHub Actions CI/CD pipeline.

---

## ✨ Features

### 👥 Three-Persona Role System

| Role | Capabilities |
|------|-------------|
| **Admin** | Manage all users, assign lawyers to cases, download firm-wide reports, view audit logs |
| **Client** | Create cases, upload & download documents, chat with assigned lawyer, download case reports |
| **Lawyer** | Accept or close assigned cases, chat with clients, review documents, manage hearing calendar |

### 🔐 Authentication & Security
- JWT-based auth with access & refresh token strategy
- Secure registration and login flows
- **Forgot Password** via Nodemailer — uses Ethereal (fake SMTP) for safe local testing
- Role-based route protection across all three personas

### 📁 Case Management
- Clients create cases with full descriptions
- Admins assign a lawyer to each case
- Lawyers accept, update status, or close their assigned cases
- Full case status lifecycle tracking

### 📄 Document Management
- Upload documents per case (PDF, DOCX, images, etc.)
- Secure document download for authorized users
- **AI-powered document summarization** via Google Gemini API

### 🤖 AI Assistant
- In-app AI chat assistant powered by **Google Gemini**
- Context-aware responses scoped to case details
- On-demand document summarization

### 💬 Case Chat
- Per-case chat thread between Client, Lawyer, and Admin
- Persistent message history scoped to each case

### 📅 Calendar
- Hearing dates and deadline management
- Visual calendar per case, or globally for lawyer/admin view

### 📊 Reports
- **Case Reports** — exportable per-case report, downloadable by client/lawyer
- **Firm Reports** — admin-level aggregate reports across all cases

### 🕵️ Audit Log / Activity Feed
- Full audit trail of all actions across all roles
- Timestamped activity feed for transparency and compliance

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        AWS EC2 Instance                      │
│                                                              │
│   ┌─────────────────┐   REST    ┌──────────────────────┐    │
│   │  React + Vite   │ ◄───────► │  Fastify Backend     │    │
│   │   Port 5173     │           │     Port 5000        │    │
│   └─────────────────┘           └──────────┬───────────┘    │
│                                            │                 │
│                                 ┌──────────▼───────────┐    │
│                                 │     PostgreSQL        │    │
│                                 │      Port 5432        │    │
│                                 └──────────────────────┘    │
│                                                              │
│   └──────────────── Docker Compose Network ───────────────┘  │
└──────────────────────────────────────────────────────────────┘
               │                              │
      ┌────────▼────────┐           ┌─────────▼──────────┐
      │  Google Gemini  │           │    Nodemailer       │
      │  (AI Features)  │           │ (Password Reset)    │
      └─────────────────┘           └────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, React Router, Axios |
| **Backend** | Node.js, Fastify |
| **Database** | PostgreSQL |
| **Authentication** | JWT (Access + Refresh Tokens) |
| **AI** | Google Gemini API |
| **Email** | Nodemailer + Ethereal SMTP (dev/test) |
| **Containerization** | Docker, Docker Compose |
| **Deployment** | AWS EC2 |
| **CI/CD** | GitHub Actions |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Docker](https://www.docker.com/) & Docker Compose
- [PostgreSQL](https://www.postgresql.org/) (only if running without Docker)
- A [Google Gemini API Key](https://makersuite.google.com/app/apikey)
- An [Ethereal Email](https://ethereal.email/) account for local email testing

---

### 1. Clone the Repository

```bash
git clone https://github.com/deeptibadlani230533/legal-intake-system.git
cd legal-intake-system
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
# Then open .env and fill in your values
```

See the [Environment Variables](#-environment-variables) section for all required keys.

### 3. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 4. Run Locally (Without Docker)

**Start PostgreSQL** (if not using Docker), then:

```bash
# Terminal 1 — Backend
cd backend
npm run dev
# Fastify starts on http://localhost:5000

# Terminal 2 — Frontend
cd frontend
npm run dev
# Vite starts on http://localhost:5173
```

---

## 🔑 Environment Variables

Create a `.env` file at the root of your project (or inside `backend/`) with the following keys:

```env
# ── Server ─────────────────────────────────────────────
PORT=5000
NODE_ENV=development

# ── Database ────────────────────────────────────────────
DATABASE_URL=postgresql://postgres:password@localhost:5432/legal_intake_db
DB_HOST=localhost
DB_PORT=5432
DB_NAME=legal_intake_db
DB_USER=postgres
DB_PASSWORD=your_db_password

# ── Authentication ──────────────────────────────────────
JWT_SECRET=your_super_secret_jwt_key
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# ── AI — Google Gemini ──────────────────────────────────
GEMINI_API_KEY=your_gemini_api_key

# ── Email — Nodemailer (Ethereal for local testing) ─────
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=your_ethereal_username@ethereal.email
SMTP_PASS=your_ethereal_password
EMAIL_FROM=noreply@legalintake.com

# ── Frontend (Vite) ─────────────────────────────────────
VITE_API_BASE_URL=http://localhost:3000
```

> 💡 **Local email testing:** Generate free Ethereal credentials at [ethereal.email](https://ethereal.email). No real emails are sent — you can preview all outgoing mail in the Ethereal dashboard.

---

## 🐳 Docker & Deployment

The entire stack is containerized and can be started with a single command.

### Start All Services

```bash
docker-compose up --build
```

This starts:
| Service | URL |
|---------|-----|
| Frontend | `http://localhost:5173` |
| Backend API | `http://localhost:3000` |
| PostgreSQL | `localhost:5432` |

### Stop Services

```bash
docker-compose down
```

### Stop & Wipe Database

```bash
docker-compose down -v
```

---

### AWS EC2 Deployment

```bash
# 1. SSH into your EC2 instance
ssh -i your-key.pem ec2-user@<your-ec2-public-ip>

# 2. Clone the repo
git clone https://github.com/deeptibadlani230533/legal-intake-system.git
cd legal-intake-system

# 3. Configure environment
cp .env.example .env
nano .env   # fill in production values

# 4. Start the stack
docker-compose up -d --build
```

> ⚠️ Make sure ports `3000` and `5173` are open in your EC2 **Security Group** inbound rules.

---

## ⚙️ CI/CD Pipeline

This project uses **GitHub Actions** for automated build and deployment.

### Pipeline Flow

```
Push to main
     │
     ▼
┌─────────────────────────────────────┐
│            CI Job                   │
│  Install → Lint → Build → Test      │
└──────────────────┬──────────────────┘
                   │  on success
                   ▼
┌─────────────────────────────────────┐
│            CD Job                   │
│  SSH into EC2 → git pull →          │
│  docker-compose up --build -d       │
└─────────────────────────────────────┘
```

### Required GitHub Secrets

Go to **Settings → Secrets and Variables → Actions** and add:

| Secret | Description |
|--------|-------------|
| `EC2_HOST` | Public IP or domain of your EC2 instance |
| `EC2_USER` | SSH username (`ec2-user`, `ubuntu`, etc.) |
| `EC2_SSH_KEY` | Private SSH key for EC2 access |
| `JWT_SECRET` | JWT signing secret |
| `JWT_REFRESH_SECRET` | JWT refresh token secret |
| `DATABASE_URL` | Full PostgreSQL connection string |
| `GEMINI_API_KEY` | Google Gemini API key |
| `SMTP_HOST` | SMTP host for Nodemailer |
| `SMTP_USER` | SMTP username |
| `SMTP_PASS` | SMTP password |

---


## 📷 Screenshots

A quick look at the core features of the system:

### 📊 Login
![Login](./screenshots/login.png)


### 📊 Dashboard
![Dashboard](./screenshots/dashboard.png)

### 📝 New Case Intake
![Intake](./screenshots/intake.png)

### 📁 Case Details
![Case](./screenshots/case.png)

### 📄 Document Upload
![Upload](./screenshots/upload.png)

### 🤖 AI Assistant
![AI](./screenshots/ai.png)

### Calendar
![Calendar](./screenshots/calendar.png)

## 🤝 Contributing

Contributions, bug reports, and feature suggestions are welcome!

```bash
# 1. Fork the repository
# 2. Create your feature branch
git checkout -b feature/your-feature-name

# 3. Commit your changes
git commit -m "feat: add your feature description"

# 4. Push to your fork
git push origin feature/your-feature-name

# 5. Open a Pull Request against main
```

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

---

## 👩‍💻 Author

**Deepti Badlani**
[github.com/deeptibadlani230533](https://github.com/deeptibadlani230533)

---

<div align="center">
<sub>Built with ☕ and way too many console.logs</sub>
</div>
