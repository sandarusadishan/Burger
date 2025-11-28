import React, { createContext, useContext, useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('burger_shop_cart');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('burger_shop_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (item) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const generateBill = (order, user) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('BurgerShop Invoice', 105, 20, { align: 'center' });

    // Customer and Order Details
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Bill to: ${user.name}`, 14, 40);
    doc.text(`Email: ${user.email}`, 14, 45);
    doc.text(`Address: ${order.address}`, 14, 50);

    doc.text(`Order ID: ${order.id}`, 196, 40, { align: 'right' });
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 196, 45, { align: 'right' });

    // Table of Items
    const tableColumn = ["Item", "Quantity", "Unit Price (LKR)", "Total (LKR)"];
    const tableRows = [];

    order.items.forEach(item => {
      const itemData = [
        item.name,
        item.quantity,
        item.price.toFixed(2),
        (item.price * item.quantity).toFixed(2)
      ];
      tableRows.push(itemData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 60,
      theme: 'striped',
      headStyles: { fillColor: [255, 193, 7] }, // Primary color
    });

    // Total
    const finalY = doc.lastAutoTable.finalY;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Grand Total: LKR ${order.total.toFixed(2)}`, 196, finalY + 15, { align: 'right' });

    // Footer
    doc.setFontSize(10);
    doc.text('Thank you for your order!', 105, finalY + 30, { align: 'center' });

    // Save the PDF
    doc.save(`BurgerShop-Invoice-${order.id}.pdf`);
  };

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, generateBill }}>
      {children}
    </CartContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
