
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

interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
  image_url: string;
  is_available: number;
  created_at: string;
  updated_at: string;
}

const TablePage = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      const res = await fetch('/api/menu-items');
      const data = await res.json();
      setMenuItems(data);
    };

    fetchMenuItems();
  }, []);

  return (
    <div>
      <h1>Menu Items</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Image URL</TableHead>
            <TableHead>Available</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {menuItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.price}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell><img src={item.image_url} alt={item.name} style={{ width: '50px', height: '50px' }} /></TableCell>
              <TableCell>{item.image_url}</TableCell>
              <TableCell>{item.is_available ? 'Yes' : 'No'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TablePage;

