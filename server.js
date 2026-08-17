import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Database setup
const dbPath = path.join(__dirname, 'budget.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Database connection error:', err);
  else console.log('Connected to SQLite database');
});

// Initialize database tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS budgets (
      id INTEGER PRIMARY KEY,
      userId TEXT UNIQUE NOT NULL,
      amount REAL NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY,
      userId TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      amount REAL NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(userId) REFERENCES budgets(userId)
    )
  `);
});

// Helper: Get or create user session
function getUserId(req) {
  // In a real app, you'd use JWT or sessions
  // For now, use a simple client ID from request or create one
  return req.headers['x-user-id'] || 'default-user';
}

// API Routes

// Get budget and expenses
app.get('/api/data', (req, res) => {
  const userId = getUserId(req);

  db.get('SELECT amount FROM budgets WHERE userId = ?', [userId], (err, budget) => {
    if (err) return res.status(500).json({ error: err.message });

    db.all('SELECT id, description as desc, category as cat, amount as amt FROM expenses WHERE userId = ? ORDER BY id DESC', [userId], (err, expenses) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json({
        budget: budget ? budget.amount : 0,
        expenses: expenses || []
      });
    });
  });
});

// Set budget
app.post('/api/budget', (req, res) => {
  const userId = getUserId(req);
  const { amount } = req.body;

  if (amount === undefined || amount < 0) {
    return res.status(400).json({ error: 'Invalid budget amount' });
  }

  db.run(
    'INSERT OR REPLACE INTO budgets (userId, amount, updatedAt) VALUES (?, ?, CURRENT_TIMESTAMP)',
    [userId, amount],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, budget: amount });
    }
  );
});

// Add expense
app.post('/api/expense', (req, res) => {
  const userId = getUserId(req);
  const { desc, cat, amt } = req.body;

  if (!desc || !cat || amt === undefined || amt <= 0) {
    return res.status(400).json({ error: 'Invalid expense data' });
  }

  // Ensure user has a budget entry
  db.run(
    'INSERT OR IGNORE INTO budgets (userId, amount) VALUES (?, 0)',
    [userId],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });

      db.run(
        'INSERT INTO expenses (userId, description, category, amount) VALUES (?, ?, ?, ?)',
        [userId, desc, cat, amt],
        function(err) {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ success: true, id: this.lastID });
        }
      );
    }
  );
});

// Delete expense
app.delete('/api/expense/:id', (req, res) => {
  const userId = getUserId(req);
  const { id } = req.params;

  db.run(
    'DELETE FROM expenses WHERE id = ? AND userId = ?',
    [id, userId],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// Reset all data
app.post('/api/reset', (req, res) => {
  const userId = getUserId(req);

  db.serialize(() => {
    db.run('DELETE FROM expenses WHERE userId = ?', [userId], (err) => {
      if (err) return res.status(500).json({ error: err.message });
    });

    db.run('DELETE FROM budgets WHERE userId = ?', [userId], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    });
  });
});

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'trip_budget_tracker.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
