
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
  const [editingCell, setEditingCell] = useState<{ id: number; field: string } | null>(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      const res = await fetch('/api/menu-items');
      const data = await res.json();
      setMenuItems(data);
    };

    fetchMenuItems();
  }, []);

  const handleCellClick = (id: number, field: string) => {
    setEditingCell({ id, field });
  };

  const handleInputChange = (id: number, field: string, value: string | number | boolean) => {
    setMenuItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleBlur = async (id: number, field: string) => {
    setEditingCell(null);
    const updatedItem = menuItems.find(item => item.id === id);
    if (updatedItem) {
      try {
        const res = await fetch(`/api/menu-items`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedItem),
        });
        if (!res.ok) {
          // Handle error, maybe revert local state or show a message
          console.error('Failed to update item');
        }
      } catch (error) {
        console.error('Error updating item:', error);
      }
    }
  };

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
              <TableCell onClick={() => handleCellClick(item.id, 'name')}>
                {editingCell?.id === item.id && editingCell?.field === 'name' ? (
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleInputChange(item.id, 'name', e.target.value)}
                    onBlur={() => handleBlur(item.id, 'name')}
                    autoFocus
                  />
                ) : (
                  item.name
                )}
              </TableCell>
              <TableCell onClick={() => handleCellClick(item.id, 'price')}>
                {editingCell?.id === item.id && editingCell?.field === 'price' ? (
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => handleInputChange(item.id, 'price', parseFloat(e.target.value))}
                    onBlur={() => handleBlur(item.id, 'price')}
                    autoFocus
                  />
                ) : (
                  item.price
                )}
              </TableCell>
              <TableCell onClick={() => handleCellClick(item.id, 'category')}>
                {editingCell?.id === item.id && editingCell?.field === 'category' ? (
                  <input
                    type="text"
                    value={item.category}
                    onChange={(e) => handleInputChange(item.id, 'category', e.target.value)}
                    onBlur={() => handleBlur(item.id, 'category')}
                    autoFocus
                  />
                ) : (
                  item.category
                )}
              </TableCell>
              <TableCell><img src={item.image_url} alt={item.name} style={{ width: '50px', height: '50px' }} /></TableCell>
              <TableCell onClick={() => handleCellClick(item.id, 'image_url')}>
                {editingCell?.id === item.id && editingCell?.field === 'image_url' ? (
                  <input
                    type="text"
                    value={item.image_url}
                    onChange={(e) => handleInputChange(item.id, 'image_url', e.target.value)}
                    onBlur={() => handleBlur(item.id, 'image_url')}
                    autoFocus
                  />
                ) : (
                  item.image_url
                )}
              </TableCell>
              <TableCell onClick={() => handleCellClick(item.id, 'is_available')}>
                {editingCell?.id === item.id && editingCell?.field === 'is_available' ? (
                  <input
                    type="checkbox"
                    checked={!!item.is_available}
                    onChange={(e) => handleInputChange(item.id, 'is_available', e.target.checked ? 1 : 0)}
                    onBlur={() => handleBlur(item.id, 'is_available')}
                    autoFocus
                  />
                ) : (
                  item.is_available ? 'Yes' : 'No'
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TablePage;
