# Pure Sonic - Music Catalog Application

Pure Sonic is a modern, full-stack web application that allows users to search the iTunes catalog for albums, save their favorites into a personal library, and get AI-powered insights about their music collection using Google's Gemini AI.

## 🚀 Features

* **Search Music**: Query the iTunes Search API in real-time to find any album.
* **Personal Library**: Save albums to your personal library with custom notes and ratings.
* **AI Insights**: Generate smart, AI-powered insights (using Gemini 1.5) on albums in your library.
* **Analytics Dashboard**: Visualize your library statistics, including top genres and recently added albums.
* **Secure Authentication**: JWT-based user authentication and secure password hashing.
* **Premium UI**: A responsive, Apple-inspired minimalist design with smooth animations and dark mode support.

## 🛠️ Tech Stack

### Frontend
* **React 18** (built with Vite)
* **React Router v6** for client-side routing
* **Axios** for API communication (with global interceptors for 401 handling)
* **Lucide React** for crisp, scalable icons
* **Vanilla CSS** with a robust, modern design system

### Backend
* **Java 21 & Spring Boot 3.x**
* **Spring Security** (JWT authentication & CORS management)
* **Spring Data JPA** (Hibernate)
* **PostgreSQL** relational database
* **Caffeine Cache** for performance optimization of third-party API calls
* **Gemini API** integration for AI insights

## 📂 Project Structure

```
music-catalog/
├── frontend/             # React application (Vite)
│   ├── src/
│   │   ├── api/          # Axios config and API services
│   │   ├── components/   # Reusable UI components (Navbar, AlbumCard)
│   │   ├── pages/        # Route pages (Search, Library, Analytics, etc.)
│   │   └── index.css     # Global design system and animations
│   └── vercel.json       # Deployment config for client-side routing
│
└── backend/              # Spring Boot application
    ├── src/main/java/com/ledgercfo/musiccatalog/
    │   ├── config/       # Global configurations (Caching, etc.)
    │   ├── controller/   # REST API Endpoints
    │   ├── exception/    # Global exception handling
    │   ├── model/        # JPA Entities (User, Album)
    │   ├── repository/   # Data access layer
    │   ├── security/     # JWT Filters, Security Config
    │   └── service/      # Business logic (iTunes API, Gemini API)
    └── Dockerfile        # Multi-stage Docker build for deployment
```

## ⚙️ Local Development Setup

### Prerequisites
* Java 21+
* Node.js (v18+)
* PostgreSQL installed and running

### 1. Database Setup
Create a PostgreSQL database named `music_catalog`.
```sql
CREATE DATABASE music_catalog;
CREATE USER catalog_user WITH PASSWORD 'catalog_password';
GRANT ALL PRIVILEGES ON DATABASE music_catalog TO catalog_user;
```

### 2. Backend Setup
Navigate to the backend directory and set your environment variables (or rely on the defaults for local dev):
```bash
cd backend
export GEMINI_API_KEY="your-gemini-api-key-here"
./mvnw spring-boot:run
```
The backend will start on `http://localhost:8080`.

### 3. Frontend Setup
Navigate to the frontend directory, install dependencies, and start the Vite dev server:
```bash
cd frontend
npm install
npm run dev
```
The frontend will be available at `http://localhost:5173`.

## ☁️ Deployment

### Using Docker Compose (Recommended)
The easiest way to deploy the backend and the database together on any VPS (like DigitalOcean, AWS EC2, or Hetzner) is using the included `docker-compose.yml` file.

1. Ensure Docker and Docker Compose are installed on your server.
2. Clone the repository and navigate to the project root.
3. Export your Gemini API key (and optionally a strong JWT secret):
   ```bash
   export GEMINI_API_KEY="your_api_key_here"
   export JWT_SECRET="your_strong_random_secret_here"
   ```
4. Start the services:
   ```bash
   docker-compose up -d --build
   ```
This will automatically spin up the PostgreSQL database, wait for it to be healthy, and then build and start the Spring Boot backend on port 8080.

### Backend (Standalone)
The backend includes a `Dockerfile` utilizing a multi-stage build. You can easily deploy it to services like Render, Railway, or Fly.io by connecting your repository and configuring the following environment variables:
* `DB_URL` (e.g., `jdbc:postgresql://<host>:5432/music_catalog`)
* `DB_USERNAME`
* `DB_PASSWORD`
* `JWT_SECRET` (A strong, random 256-bit key)
* `GEMINI_API_KEY`
* `ALLOWED_ORIGINS` (e.g., `https://your-frontend-domain.vercel.app`)

### Frontend
The frontend is optimized for deployment on Vercel. 
1. Connect your repository to Vercel.
2. Ensure the framework preset is set to **Vite**.
3. Add the `VITE_API_URL` environment variable pointing to your deployed backend URL.
4. The included `vercel.json` ensures that React Router handles direct URL hits without throwing 404 errors.

## 🔒 Security Highlights
* **Password Hashing**: BCrypt encryption for all user passwords.
* **Token Protection**: JWTs are strictly validated on every authenticated request.
* **No Stack Trace Leaks**: A `GlobalExceptionHandler` intercepts all unhandled errors, returning sanitized JSON.
* **Environment Variables**: No hardcoded secrets exist within the application logic.
