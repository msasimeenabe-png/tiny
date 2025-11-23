const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Connect to Neon Postgres
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Create table if not exists
(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS links (
      code VARCHAR PRIMARY KEY,
      original_url TEXT NOT NULL,
      total_clicks INT DEFAULT 0,
      last_clicked TIMESTAMP
    );
  `);
})();

// Get all links
app.get('/api/all', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM links');
  res.json(rows);
});

// Create short link
app.post('/api/create', async (req, res) => {
  let { originalUrl, shortCode } = req.body;
  if (!originalUrl) return res.status(400).json({ error: "URL is required" });

  if (!shortCode) shortCode = Math.random().toString(36).substring(2, 8);

  // Check duplicate
  const { rows } = await pool.query('SELECT * FROM links WHERE code=$1', [shortCode]);
  if (rows.length) return res.status(400).json({ error: "Code already exists" });

  await pool.query(
    'INSERT INTO links (code, original_url) VALUES ($1, $2)',
    [shortCode, originalUrl]
  );

  res.json({ shortUrl: `${process.env.BASE_URL}/${shortCode}` });
});

// Delete link
app.delete('/api/delete/:code', async (req, res) => {
  await pool.query('DELETE FROM links WHERE code=$1', [req.params.code]);
  res.json({ message: "Deleted" });
});

// Redirect
app.get('/:code', async (req, res) => {
  const { code } = req.params;
  const { rows } = await pool.query('SELECT * FROM links WHERE code=$1', [code]);
  if (!rows.length) return res.status(404).send("Link not found");

  const link = rows[0];
  await pool.query('UPDATE links SET total_clicks=total_clicks+1, last_clicked=NOW() WHERE code=$1', [code]);
  res.redirect(link.original_url);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
