# Music Catalog Insights Platform

A full-stack web application that allows users to search the iTunes catalog for albums, save them to their library, view an analytics dashboard of their saved albums, and get an AI-generated insight about their collection.

## 1. Entity Choice: Albums
I chose **Albums** as the primary entity because the metadata provided by the iTunes API (genre, releaseDate, trackCount) translates perfectly into four genuinely different, meaningful chart types on the analytics dashboard without needing to invent fake data fields.

## 2. Database Schema (Albums Table)

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary Key |
| user_id | UUID | Foreign Key to users |
| apple_catalog_id | bigint | iTunes `collectionId`, unique per user |
| title | varchar | from `collectionName` |
| artist_name | varchar | |
| genre | varchar | from `primaryGenreName` |
| release_date | date | from `releaseDate` |
| track_count | int | |
| artwork_url | varchar | |
| user_rating | int (1–5) | user-added |
| user_notes | text | user-added |
| created_at | timestamp | |
| updated_at | timestamp | |

*(Note: The actual implementation uses H2 Database configured for PostgreSQL compatibility to ensure easy local setup without needing Docker, but it can easily be swapped to a real PostgreSQL instance by changing the `application.yml` url).*

## 3. AI Feature Choice: Trend/Taste Summary
I chose to implement a **Trend/Taste Summary** using the Gemini 1.5 Flash API. This feature takes the user's aggregated library stats (genre counts, release years, etc.) and generates a short, natural-language paragraph summarizing their taste. 

**Example Prompt Used:**
> "Based on the following aggregated stats of a user's music album library, give one short, insightful, and natural-language paragraph summarizing their music taste and trends: {analytics JSON}. Keep it under 3 sentences."

## 4. Setup Instructions

### Prerequisites
- Java 21+
- Node.js 18+

### Backend Setup
1. Navigate to the `backend` directory.
2. The `application.yml` requires a `JWT_SECRET` and `GEMINI_API_KEY`. If not provided, it falls back to defaults (and mocks the AI response if no key is provided).
3. Set your environment variables (optional):
   ```bash
   export JWT_SECRET="your_very_long_secret_key_here"
   export GEMINI_API_KEY="your_gemini_api_key"
   ```
4. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```

### Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open the browser to `http://localhost:5173`.

## 5. Trade-offs Made
Given the time constraints, several deliberate trade-offs were made:
- **Local Database**: Used an in-memory H2 database with PostgreSQL compatibility instead of a containerized PostgreSQL instance to eliminate local Docker dependencies.
- **Automated Tests**: Skipped comprehensive unit/integration testing (e.g. JUnit/Mockito for the backend, Jest for the frontend) in favor of feature completeness.
- **Pagination**: The `/api/library` endpoint returns all saved albums at once without pagination. If a user saves thousands of albums, this would need to be updated.
- **Auth Storage**: JWTs are stored in `localStorage` for simplicity. For a production app, HTTP-only cookies are generally preferred to prevent XSS attacks.
- **Error Handling**: Implemented a global exception handler, but frontend error reporting is limited to basic UI toasts/messages rather than a full robust error boundary system.
