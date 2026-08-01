# Music Catalog Insights Platform

A full-stack application built with Spring Boot and React to manage your music catalog, search iTunes, and get AI-powered insights about your taste in music.

## Features

- **Search & Discover:** Proxy iTunes API to search for albums safely.
- **Library Management:** Add, rate, and remove albums in your personal Postgres database.
- **Analytics:** Visualize your library data using Recharts (Genre breakdown, releases by year).
- **AI Trend Summary:** Uses Gemini 1.5 API to provide an insightful summary of your music taste based on your library stats.
- **Secure:** JWT authentication.
- **Performance:** Caching of iTunes responses, server-side pagination.
- **Design:** Modern "Pure Sonic" minimalistic design system.

## Tech Stack

- **Backend:** Java 21, Spring Boot (WebFlux, Data JPA, Security, Cache), PostgreSQL, Caffeine, JUnit 5.
- **Frontend:** React, Vite, React Router, Recharts, Lucide React.
- **AI:** Google Gemini API.

## Setup

1. **Database:** Ensure PostgreSQL is running on `localhost:5432` with user `catalog_user` / password `catalog_password` and database `music_catalog`.
2. **Environment Variables:**
   - `JWT_SECRET`: Your 256-bit JWT secret (defaults to a safe dev key).
   - `GEMINI_API_KEY`: Your Google Gemini API key.
3. **Run Backend:** `cd backend && ./mvnw spring-boot:run`
4. **Run Frontend:** `cd frontend && npm install && npm run dev`
