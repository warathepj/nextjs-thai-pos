import { getPayments, insertPayment } from '@/lib/db';

export async function GET(request: Request) {
  const payments = getPayments();
  return new Response(JSON.stringify(payments), { headers: { 'Content-Type': 'application/json' } });
}

export async function POST(request: Request) {
  try {
    const { order_id, payment_method, amount_paid, change_amount } = await request.json();
    insertPayment(order_id, payment_method, amount_paid, change_amount);
    return new Response(JSON.stringify({ message: 'Payment added successfully' }), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Failed to add payment:', error);
    return new Response(JSON.stringify({ error: 'Failed to add payment' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
