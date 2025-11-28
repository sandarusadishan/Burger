// d:\Campus\Uni-Project\frontend\src\components\BankDepositInfoDialog.jsx

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Copy, Check } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const BANK_DETAILS = {
  bankName: "Commercial Bank",
  branch: "Colombo 07",
  accountName: "BurgerShop (Pvt) Ltd",
  accountNumber: "1000 1234 5678",
};

const BankDepositInfoDialog = ({ isOpen, onOpenChange, orderId, totalAmount }) => {
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    const textToCopy = `Bank: ${BANK_DETAILS.bankName}\nBranch: ${BANK_DETAILS.branch}\nAccount: ${BANK_DETAILS.accountName}\nNumber: ${BANK_DETAILS.accountNumber}\nAmount: LKR ${totalAmount.toFixed(2)}\nReference: ${orderId.slice(-6)}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast({ title: "✅ Copied!", description: "Bank details copied to clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] glass">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">Bank Deposit Instructions</DialogTitle>
          <DialogDescription>
            Please deposit the total amount to the following bank account and use your Order ID as the reference.
          </DialogDescription>
        </DialogHeader>
        <div className="my-4 p-4 rounded-lg bg-muted/50 space-y-3">
            <div className="flex justify-between">
                <span className="text-muted-foreground">Bank Name:</span>
                <span className="font-semibold">{BANK_DETAILS.bankName}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-muted-foreground">Account Name:</span>
                <span className="font-semibold">{BANK_DETAILS.accountName}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-muted-foreground">Account Number:</span>
                <span className="font-semibold">{BANK_DETAILS.accountNumber}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-primary border-t pt-3 mt-3">
                <span>Total Amount:</span>
                <span>LKR {totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold">
                <span className="text-muted-foreground">Order Reference:</span>
                <span className="font-mono">{orderId.slice(-6)}</span>
            </div>
        </div>
        <p className="text-xs text-muted-foreground text-center">
            Your order will be processed once we confirm the payment. This may take up to 24 hours.
        </p>
        <DialogFooter className="sm:justify-between gap-2 mt-4">
            <Button variant="secondary" onClick={handleCopy} className="gap-2">
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Details'}
            </Button>
            <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BankDepositInfoDialog;
