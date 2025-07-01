import Database from 'better-sqlite3';

const db = new Database('thai-pos-system.db');

export function getPayments() {
  return db.prepare('SELECT * FROM payments').all();
}

export function createPaymentsTable() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      payment_method TEXT NOT NULL,
      payment_date TEXT NOT NULL
    );
  `);
}

createPaymentsTable();
