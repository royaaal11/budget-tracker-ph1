import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import pkg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pkg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(express.static(__dirname));

// Database setup - Use Vercel Postgres or local PostgreSQL
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('DATABASE_URL is not configured. Add it to Vercel Environment Variables or your local .env file.');
}

const pool = new Pool({
  connectionString: databaseUrl || 'postgresql://localhost/budget_tracker',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Initialize database tables
async function initDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS budgets (
        id SERIAL PRIMARY KEY,
        user_id TEXT UNIQUE NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS expenses (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES budgets(user_id) ON DELETE CASCADE
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS app_states (
        user_id TEXT PRIMARY KEY,
        state JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database tables initialized');
  } catch (err) {
    console.error('Error initializing database:', err);
  }
}

initDatabase();


// Helper: Get or create user session
function getUserId(req) {
  return req.headers['x-user-id'] || 'default-user';
}

// Load the card app state stored for this browser identity.
app.get('/api/state', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT state FROM app_states WHERE user_id = $1',
      [getUserId(req)]
    );
    res.json({ state: result.rows[0]?.state || null });
  } catch (err) {
    console.error('Error fetching app state:', err);
    res.status(500).json({ error: 'Could not load app state' });
  }
});

// Save the complete card app state as one atomic document.
app.put('/api/state', async (req, res) => {
  const { state } = req.body || {};
  if (!state || typeof state !== 'object' || Array.isArray(state)) {
    return res.status(400).json({ error: 'Invalid app state' });
  }

  try {
    await pool.query(
      `INSERT INTO app_states (user_id, state, updated_at)
       VALUES ($1, $2::jsonb, CURRENT_TIMESTAMP)
       ON CONFLICT (user_id) DO UPDATE
       SET state = EXCLUDED.state, updated_at = CURRENT_TIMESTAMP`,
      [getUserId(req), JSON.stringify(state)]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Error saving app state:', err);
    res.status(500).json({ error: 'Could not save app state' });
  }
});

app.delete('/api/state', async (req, res) => {
  try {
    await pool.query('DELETE FROM app_states WHERE user_id = $1', [getUserId(req)]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting app state:', err);
    res.status(500).json({ error: 'Could not delete app state' });
  }
});

// API Routes

// Get budget and expenses
app.get('/api/data', async (req, res) => {
  const userId = getUserId(req);

  try {
    const budgetResult = await pool.query('SELECT amount FROM budgets WHERE user_id = $1', [userId]);
    const expensesResult = await pool.query(
      'SELECT id, description as desc, category as cat, amount as amt FROM expenses WHERE user_id = $1 ORDER BY id DESC',
      [userId]
    );

    res.json({
      budget: budgetResult.rows.length > 0 ? budgetResult.rows[0].amount : 0,
      expenses: expensesResult.rows || []
    });
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: err.message });
  }
});

// Set budget
app.post('/api/budget', async (req, res) => {
  const userId = getUserId(req);
  const { amount } = req.body;

  if (amount === undefined || amount < 0) {
    return res.status(400).json({ error: 'Invalid budget amount' });
  }

  try {
    await pool.query(
      'INSERT INTO budgets (user_id, amount, updated_at) VALUES ($1, $2, CURRENT_TIMESTAMP) ON CONFLICT (user_id) DO UPDATE SET amount = $2, updated_at = CURRENT_TIMESTAMP',
      [userId, amount]
    );
    res.json({ success: true, budget: amount });
  } catch (err) {
    console.error('Error setting budget:', err);
    res.status(500).json({ error: err.message });
  }
});

// Add expense
app.post('/api/expense', async (req, res) => {
  const userId = getUserId(req);
  const { desc, cat, amt } = req.body;

  if (!desc || !cat || amt === undefined || amt <= 0) {
    return res.status(400).json({ error: 'Invalid expense data' });
  }

  try {
    // Ensure user has a budget entry
    await pool.query(
      'INSERT INTO budgets (user_id, amount) VALUES ($1, 0) ON CONFLICT (user_id) DO NOTHING',
      [userId]
    );

    const result = await pool.query(
      'INSERT INTO expenses (user_id, description, category, amount) VALUES ($1, $2, $3, $4) RETURNING id',
      [userId, desc, cat, amt]
    );
    res.json({ success: true, id: result.rows[0].id });
  } catch (err) {
    console.error('Error adding expense:', err);
    res.status(500).json({ error: err.message });
  }
});

// Delete expense
app.delete('/api/expense/:id', async (req, res) => {
  const userId = getUserId(req);
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM expenses WHERE id = $1 AND user_id = $2', [id, userId]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting expense:', err);
    res.status(500).json({ error: err.message });
  }
});

// Reset all data
app.post('/api/reset', async (req, res) => {
  const userId = getUserId(req);

  try {
    await pool.query('DELETE FROM expenses WHERE user_id = $1', [userId]);
    await pool.query('DELETE FROM budgets WHERE user_id = $1', [userId]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error resetting data:', err);
    res.status(500).json({ error: err.message });
  }
});

// Root route — the card-based finance app.
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// The original single-budget trip tracker, which still uses the API below.
app.get('/trip', (req, res) => {
  res.sendFile(path.join(__dirname, 'trip_budget_tracker.html'));
});

export default app;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
