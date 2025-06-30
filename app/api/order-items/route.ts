import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';

export async function GET() {
  const db = new Database('thai-pos-system.db', { verbose: console.log });
  const orderItems = db.prepare(
    'SELECT oi.*, mi.name as menu_item_name FROM order_items oi JOIN menu_items mi ON oi.menu_item_id = mi.id'
  ).all();
  db.close();
  return NextResponse.json(orderItems);
}
