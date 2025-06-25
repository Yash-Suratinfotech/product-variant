import dotenv from "dotenv";
dotenv.config();

import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DB_URL, // adjust as needed
});

export default {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
};