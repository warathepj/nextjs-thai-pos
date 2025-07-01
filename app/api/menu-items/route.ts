import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';

export async function GET() {
  const db = new Database('thai-pos-system.db', { verbose: console.log });
  const menuItems = db.prepare('SELECT * FROM menu_items').all();
  db.close();
  return NextResponse.json(menuItems);
}

export async function PUT(request: Request) {
  const db = new Database('thai-pos-system.db', { verbose: console.log });
  const { id, name, price, category, image_url, is_available } = await request.json();

  if (!id) {
    db.close();
    return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
  }

  try {
    const stmt = db.prepare(`
      UPDATE menu_items
      SET name = ?, price = ?, category = ?, image_url = ?, is_available = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    stmt.run(name, price, category, image_url, is_available, id);
    db.close();
    return NextResponse.json({ message: 'Item updated successfully' });
  } catch (error) {
    console.error('Error updating item:', error);
    db.close();
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}
