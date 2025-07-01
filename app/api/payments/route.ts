import { getPayments } from '@/lib/db';

export async function GET(request: Request) {
  const payments = getPayments();
  return new Response(JSON.stringify(payments), { headers: { 'Content-Type': 'application/json' } });
}