# 🔗 LinkTrack

A full-stack URL shortener with click analytics and per-user accounts, built with Java Spring Boot and React.

**Live demo:** https://link-track-delta.vercel.app
**Backend API:** https://linktrack-5t6o.onrender.com

> Note: the backend is hosted on Render's free tier, which spins down after 15 minutes of inactivity. The first request after idle time may take 30-60 seconds to respond while it wakes up.

## Features

- Shorten any long URL into a compact, shareable short link
- Track click counts on every link in real time
- Secure user accounts — sign up, log in, and only see your own links
- Passwords hashed with BCrypt, sessions handled via stateless JWT tokens
- Light/dark theme toggle with persisted preference
- Cloud-hosted PostgreSQL database (Supabase)

## Tech Stack

**Backend**
- Java 21, Spring Boot 4
- Spring Data JPA + Hibernate
- Spring Security + JWT (jjwt)
- PostgreSQL (hosted on Supabase)
- Maven, Docker

**Frontend**
- React (Vite)
- Axios
- Custom CSS with a light/dark theme system (no UI framework)

**Deployment**
- Backend: Render (Docker container)
- Frontend: Vercel

## Architecture

```
React (Vercel) → REST API (Spring Boot, Render) → Hibernate → PostgreSQL (Supabase)
```

- `POST /api/auth/signup` / `POST /api/auth/login` — issue a JWT on success
- `POST /api/shorten` — create a short link (requires auth)
- `GET /api/links` — list the logged-in user's links (requires auth)
- `GET /api/{code}` — public redirect endpoint, increments click count

Every protected request carries `Authorization: Bearer <token>`, verified by a custom `JwtAuthFilter` before it reaches the controller.

## Running Locally

**Backend**
```bash
cd linktrack
cp src/main/resources/application.properties.example src/main/resources/application.properties
# fill in your own DB_URL, DB_USERNAME, DB_PASSWORD in that file
./mvnw spring-boot:run
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

Update `API_BASE` in `frontend/src/App.jsx` to `http://localhost:8080/api` for local development.

## What I Learned

Building this from scratch meant working through real infrastructure problems, not just writing code:

- Diagnosing DNS/connectivity issues with database pooling (direct connection vs. connection pooler)
- Debugging schema mismatches between Hibernate's auto-DDL and an existing Postgres table
- Implementing stateless JWT authentication with Spring Security from first principles
- Structuring a REST API so ownership and access control live in the backend, not just the UI
- Containerizing a Java app with Docker and deploying it to a cloud host with environment-based config
