// web/api/db.js
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: "postgres://postgres:123456@localhost:5432/shopify", // adjust as needed
});

export default {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
};