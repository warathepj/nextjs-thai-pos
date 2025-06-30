import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';

export async function GET() {
  const db = new Database('thai-pos-system.db', { verbose: console.log });
  const orders = db.prepare('SELECT * FROM orders').all();
  db.close();
  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  const db = new Database('thai-pos-system.db', { verbose: console.log });
  const { items, total, paymentMethod, customerName, notes } = await request.json();

  const insertOrder = db.prepare(
    'INSERT INTO orders (id, customer_name, total_amount, payment_method, notes) VALUES (?, ?, ?, ?, ?)'
  );

  const insertOrderItem = db.prepare(
    'INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, total_price) VALUES (?, ?, ?, ?, ?)'
  );

  const orderId = `ORD-${Date.now()}`;

  db.transaction(() => {
    insertOrder.run(orderId, customerName, total, paymentMethod, notes);
    for (const item of items) {
      insertOrderItem.run(orderId, item.id, item.quantity, item.price, item.price * item.quantity);
    }
  })();

  db.close();

  return NextResponse.json({ id: orderId });
}
