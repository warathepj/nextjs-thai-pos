'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Payment {
  id: number;
  order_id: string;
  amount_paid: number;
  payment_method: string;
  created_at: string;
  change_amount: number;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPayments() {
      try {
        const response = await fetch('/api/payments');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPayments(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPayments();
  }, []);

  if (loading) {
    return <div>Loading payments...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Payments</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Order ID</TableHead>
            <TableHead>Amount Paid</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead>Change Amount</TableHead>
            <TableHead>Payment Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>{payment.id}</TableCell>
              <TableCell>{payment.order_id}</TableCell>
              <TableCell>{payment.amount_paid}</TableCell>
              <TableCell>{payment.payment_method}</TableCell>
              <TableCell>{payment.change_amount}</TableCell>
              <TableCell>{new Date(payment.created_at + 'Z').toLocaleString('en-US', { timeZone: 'Asia/Bangkok', hour: 'numeric', minute: 'numeric', second: 'numeric' })}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}