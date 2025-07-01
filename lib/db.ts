import Database from 'better-sqlite3';

const db = new Database('thai-pos-system.db');

export function getPayments() {
  return db.prepare('SELECT * FROM payments').all();
}

export function insertPayment(order_id: string, payment_method: string, amount_paid: number, change_amount: number) {
  const stmt = db.prepare('INSERT INTO payments (order_id, payment_method, amount_paid, change_amount) VALUES (?, ?, ?, ?)');
  stmt.run(order_id, payment_method, amount_paid, change_amount);
}

export function createPaymentsTable() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT NOT NULL,
      payment_method TEXT NOT NULL,
      amount_paid DECIMAL(10,2) NOT NULL,
      change_amount DECIMAL(10,2) DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(id)
    );
  `);
}

createPaymentsTable();