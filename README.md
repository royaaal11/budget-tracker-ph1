# Trip Budget Tracker

A web-based trip budget tracker with **PostgreSQL** database backend (works on Vercel!).

## Features
- Set and track trip budgets
- Log expenses by category
- Real-time balance calculation
- Persistent data storage with PostgreSQL
- **Works on Vercel** (unlike SQLite)

## Local Setup

### Prerequisites
- Node.js 18+
- PostgreSQL running locally (or use a cloud database)

### Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up database:**
   - Create a PostgreSQL database locally:
   ```bash
   createdb budget_tracker
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Open in browser:**
   Navigate to `http://localhost:3000`

## Deployment to Vercel

### Setup Vercel Postgres

1. **Create a Vercel account** at [vercel.com](https://vercel.com) (if you don't have one)

2. **Add a PostgreSQL database to your project:**
   - Go to your project dashboard
   - Click "Storage" → "Create Database" → "Postgres"
   - Copy the `DATABASE_URL` connection string

3. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Update to PostgreSQL"
   git push origin main
   ```

4. **Connect to Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Select your repository
   - Vercel will detect environment variables needed
   - Add `DATABASE_URL` from your Postgres setup (paste the connection string)
   - Click "Deploy"

5. **Your app is live!**
   - The database tables will be created automatically on first run

## Database Schema

- **budgets** - Stores budget amounts per user
- **expenses** - Stores individual expense entries (linked to budgets)
git push origin main
   ```

5. **Create a new project in Vercel:**
   - Visit [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Vercel will auto-detect Node.js
   - Add environment variable `DATABASE_URL` with your PostgreSQL connection string
   - Click "Deploy"

## API Endpoints

- `GET /api/data` - Get budget and expenses
- `POST /api/budget` - Set budget amount  
- `POST /api/expense` - Add an expense
- `DELETE /api/expense/:id` - Delete an expense
- `POST /api/reset` - Clear all data

## Environment Variables

### Local Development
Add to `.env` (create if needed):
```
DATABASE_URL=postgresql://localhost/budget_tracker
```

### Vercel
Add in Vercel project settings → Environment Variables:
```
DATABASE_URL=<your-vercel-postgres-connection-string>
```

## Troubleshooting

**"Cannot connect to database"** - Make sure PostgreSQL is running and DATABASE_URL is set correctly

**"Error initializing database"** - Check that your connection string is valid

**Vercel deployment fails** - Ensure DATABASE_URL is added as an environment variable in Vercel project settings

## Notes

- Data is stored per-user (using default-user for now)
- For multi-user support, implement authentication (JWT, OAuth, etc.)
- PostgreSQL works reliably on Vercel (unlike SQLite which needs ephemeral filesystems)
