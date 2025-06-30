'use client';

import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface OrderItem {
  id: number;
  order_id: string;
  menu_item_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

const OrderItemsPage = () => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    const fetchOrderItems = async () => {
      const res = await fetch('/api/order-items');
      const data = await res.json();
      setOrderItems(data);
    };

    fetchOrderItems();
  }, []);

  return (
    <div>
      <h1>Order Items</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Menu Item</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Unit Price</TableHead>
            <TableHead>Total Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orderItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.order_id}</TableCell>
              <TableCell>{item.menu_item_name}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.unit_price}</TableCell>
              <TableCell>{item.total_price}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrderItemsPage;
