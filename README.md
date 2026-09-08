# ReachInbox – Email Campaign Management System

## Overview

ReachInbox is a full-stack email outreach platform that allows users to:

- Authenticate using Google OAuth
- Create and manage email campaigns
- Add and manage leads
- Configure SMTP sender accounts
- Schedule emails automatically
- Process email jobs using BullMQ and Redis
- Track campaign status and email delivery

---

## Tech Stack

### Frontend
- React
- TypeScript
- Tailwind CSS
- React Query
- Axios

### Backend
- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL (NeonDB)

### Queue & Scheduling
- BullMQ
- Redis

### Authentication
- Google OAuth 2.0

### Email Service
- Nodemailer
- SMTP

---

## System Architecture

```text
Frontend (React)
        |
        v
Backend API (Express)
        |
        v
 PostgreSQL (NeonDB)
        |
        v
 BullMQ Queue
        |
        v
 Redis
        |
        v
 Email Worker
        |
        v
 SMTP Server
        |
        v
 Recipient Inbox
```

---

## Features

### Authentication
- Google OAuth login
- User session management

### Campaign Management
- Create campaigns
- Define subject and email body
- Set delay between emails
- Configure hourly sending limits

### Lead Management
- Add leads
- Associate leads with campaigns
- Store recipient details

### Sender Management
- Add SMTP sender accounts
- Support Gmail SMTP
- Multiple sender support

### Email Scheduling
- Automatic email scheduling
- Queue-based processing
- Delayed email execution

### Background Processing
- BullMQ job queue
- Redis-backed scheduling
- Reliable email delivery

---

## Database Models

### User
Stores authenticated users.

### Sender
Stores SMTP configurations.

### Campaign
Stores campaign details.

### Lead
Stores recipient information.

### ScheduledEmail
Stores scheduled email jobs and statuses.

### SlackConnection
Stores Slack integration details.

---

## Project Structure

```text
backend/
│
├── prisma/
│   └── schema.prisma
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── workers/
│   ├── queues/
│   ├── middleware/
│   ├── app.ts
│   └── server.ts
│
└── package.json

frontend/
│
├── src/
├── public/
└── package.json
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/J-sravani15/reachinbox.git
cd reachinbox
```

---

## Backend Setup

Install dependencies:

```bash
cd backend
npm install
```

Create `.env` file:

```env
DATABASE_URL=your_postgres_url

REDIS_HOST=localhost
REDIS_PORT=6379

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

JWT_SECRET=your_secret

PORT=5000
```

Run migrations:

```bash
npx prisma generate
npx prisma migrate deploy
```

Start backend:

```bash
npm run dev
```

---

## Frontend Setup

Install dependencies:

```bash
cd frontend
npm install
```

Start frontend:

```bash
npm run dev
```

---

## Redis Setup

Start Redis locally:

```bash
redis-server
```

Verify connection:

```bash
redis-cli ping
```

Expected output:

```bash
PONG
```

---

## Running the Application

Frontend:

```bash
http://localhost:3000
```

Backend:

```bash
http://localhost:5000
```

Prisma Studio:

```bash
npx prisma studio
```

---

## Email Workflow

1. User creates campaign.
2. Leads are added.
3. Campaign is started.
4. Scheduled email records are created.
5. BullMQ queues email jobs.
6. Worker processes jobs.
7. Nodemailer sends emails via SMTP.
8. Email status is updated in database.

---

## Assignment Demonstration

The demo video covers:

- Google OAuth login
- Sender creation
- Lead creation
- Campaign creation
- Campaign execution
- BullMQ queue processing
- Email delivery verification
- Prisma database verification

---

## Future Improvements

- Campaign analytics
- Email open tracking
- Click tracking
- Slack notifications
- Multi-user collaboration
- Email templates
- Dashboard metrics

---

## Author

Sravani J

GitHub:
https://github.com/J-sravani15/reachinbox
