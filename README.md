# Somali Language Learning App

A Duolingo-style PWA for learning Somali, built for the diaspora community — especially children reconnecting with their heritage language.

---

## What it is

An interactive web app that teaches Somali through structured lessons, vocabulary, and sentences. Designed to be accessible on mobile and installable as a PWA, with a focus on the Somali diaspora who want to reconnect with the language.

---

## Project Structure

```
somali-app/
├── backend/          FastAPI REST API
├── frontend/         Next.js PWA
└── infrastructure/   Terraform (AWS)
```

---

## Tech Stack

| Layer    | Technology                    |
|----------|-------------------------------|
| Frontend | Next.js 16 + React 19 (TypeScript) |
| Backend  | FastAPI (Python)              |
| Database | PostgreSQL (RDS)              |
| Infra    | Terraform + AWS               |
| Container | Docker + ECR                 |

---

## Backend

### Files

| File | Purpose |
|------|---------|
| `main.py` | API routes: `GET /lessons`, `GET /lessons/{id}`, `GET /words`, `GET /words/{category}` |
| `models.py` | SQLAlchemy models: `Word`, `Sentence`, `Lesson` |
| `database.py` | DB connection — reads `DATABASE_URL` from env |
| `seed.py` | Wipes and reloads the DB from `somali_seed_data.json` |
| `somali_seed_data.json` | 156 words, 107 sentences, 18 lessons across 13 categories |
| `Dockerfile` | Builds the container for ECR/EC2 |

### Dependencies

| Package | Version | Role |
|---------|---------|------|
| `fastapi` | 0.115.0 | Web framework |
| `uvicorn` | 0.30.6 | ASGI server |
| `sqlalchemy` | 2.0.35 | ORM / DB layer |
| `psycopg2-binary` | 2.9.9 | PostgreSQL driver |
| `pydantic` | 2.9.2 | Request/response validation |

### Running locally

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

API runs at `http://localhost:8000`.

---

## Frontend

### Files

| File | Purpose |
|------|---------|
| `app/page.tsx` | Home screen — fetches and lists all lessons by category |
| `app/lessons/[id]/page.tsx` | Server component — fetches lesson detail |
| `app/lessons/[id]/LessonPlayer.tsx` | Client component — flashcard → quiz flow with scoring |
| `lib/api.ts` | `fetchLessons()` and `fetchLesson(id)` — calls the backend |
| `types/index.ts` | TypeScript types: `Word`, `Sentence`, `Lesson`, `LessonDetail` |
| `components/RegisterSW.tsx` | Registers the service worker for PWA offline support |
| `public/sw.js` | Service worker — caches UI, bypasses cache for API calls |
| `public/manifest.json` | PWA manifest — app name "Barashada Somaliga", standalone display |

### Dependencies

| Package | Version | Role |
|---------|---------|------|
| `next` | 16.2.9 | Framework (App Router + Turbopack) |
| `react` | 19.2.4 | UI library |
| `react-dom` | 19.2.4 | DOM renderer |
| `tailwindcss` | ^4 | Styling |
| `typescript` | ^5 | Type safety |
| `eslint` | ^9 | Linting |

### Running locally

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:3000`.

---

## Database

Seeded with:
- **156** vocabulary words
- **107** sentences
- **18** lessons across **13** categories

Seed locally:

```bash
cd backend
python seed.py
```

---

## Infrastructure (AWS)

### Resources

| Resource | Details |
|----------|---------|
| ECR | Docker registry — `somali-app-backend` |
| EC2 `t2.micro` | Runs the FastAPI container — `3.238.143.142:8000` |
| RDS `db.t3.micro` | PostgreSQL 16.3, private, single-AZ |
| S3 | Private bucket for future audio files |
| Subnets | 2 public subnets (us-east-1a/b) in default VPC |
| Security groups | EC2: ports 22 + 8000 open; RDS: 5432 from EC2 only |

### Deploying

**First deploy:**

```bash
cd infrastructure
terraform init
terraform apply -var="key_name=<your-key>" -var="db_password=<password>"
./push.sh
```

**Updating the backend image:**

```bash
cd infrastructure
./push.sh
```

`push.sh` builds for `linux/amd64`, pushes to ECR, and prints the live URL. The EC2 auto-pulls on first boot and seeds the database.

---

## Roadmap

- [ ] Audio recordings for all words and sentences
- [ ] Pronunciation scoring via speech recognition
- [ ] Native mobile app (React Native)
