// src/components/ConfirmDeleteDialog.jsx

import React from 'react';
// ✅ dialog.jsx ෆයිල් එකෙන් ඇති elements (Dialog, DialogTitle, etc.) import කරයි
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from './ui/dialog'; 
import { Button } from './ui/button';
import { Trash2 } from 'lucide-react';

const ConfirmDeleteDialog = ({ orderId, orderSlice, onConfirm }) => {
  return (
    <Dialog>
      {/* 1. Trigger Button */}
      <DialogTrigger asChild>
        <Button 
          size="icon" 
          variant="destructive" 
          title={`Delete Order #${orderSlice}`}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </DialogTrigger>

      {/* 2. Dialog Content (AlertDialog වෙනුවට Dialog භාවිතයෙන්) */}
      <DialogContent className="bg-background/90 backdrop-blur-md border border-red-500/30 p-8 rounded-lg shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-red-500 flex items-center gap-2">
            <Trash2 className="w-6 h-6" /> Confirm Deletion
          </DialogTitle>
          <DialogDescription className="pt-2 text-foreground">
            Are you sure you want to permanently delete **Order #{orderSlice}**? 
            <br/>
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-6">
          {/* Cancel Button */}
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          
          {/* Confirmation Action Button */}
          {/* Note: DialogClose භාවිතා කර Dialog එක close කිරීමෙන් පසුව action එක trigger කළ හැකියි */}
          <DialogClose asChild>
            <Button 
              variant="destructive" 
              onClick={() => onConfirm(orderId)} // onConfirm function එක execute කරයි
              className="hover:bg-red-700 transition-colors"
            >
              Yes, Delete Order
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;