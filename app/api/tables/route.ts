import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';

export async function GET() {
  const db = new Database('thai-pos-system.db', { verbose: console.log });
  const menuItems = db.prepare('SELECT * FROM menu_items').all();
  db.close();
  return NextResponse.json(menuItems);
}
