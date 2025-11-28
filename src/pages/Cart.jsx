import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '@radix-ui/react-radio-group';
// ✅ Badge component එක නිවැරදිව import කරන්න.
import { Badge } from '../components/ui/badge'; 
import {
  Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Loader2, Receipt, Tag, X, CreditCard, Banknote, Landmark
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import BankDepositInfoDialog from '../components/BankDepositInfoDialog'; // ✅ Import the new dialog

// PDF Libraries 
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const DELIVERY_FEE = 350.0;
const BASE_URL = 'https://grilmelt-burger.onrender.com';
const API_URL = `${BASE_URL}/api`;
const LOGO_URL = `/logo.png`; // Use a relative path
const Cart = () => {
  const { items, updateQuantity, removeItem, clearCart, total } = useCart();
  const { user, isAuthenticated } = useAuth(); 
  const { toast } = useToast();
  const navigate = useNavigate();

  const [address, setAddress] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const [paymentMethod, setPaymentMethod] = useState('cash'); // ✅ Payment Method State
  // ✅ Coupon States
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0); 
  const [appliedCoupon, setAppliedCoupon] = useState(null); 
  const [isApplying, setIsApplying] = useState(false);

  // ✅ Bank Deposit Dialog State
  const [isBankInfoOpen, setIsBankInfoOpen] = useState(false);
  const [completedOrderInfo, setCompletedOrderInfo] = useState(null);

  // --- PDF Logic ---
  const generateBill = async (order, customer) => { 
    setIsDownloading(true);
    const invoiceElement = document.getElementById('invoice-content');

    // Dynamic Data Populate
    document.getElementById('invoice-order-id').textContent = `#${order.id.slice(-6)}`;
    document.getElementById('invoice-customer-name').textContent = customer.name;
    document.getElementById('invoice-customer-email').textContent = customer.email;
    document.getElementById('invoice-address').textContent = order.address;
    document.getElementById('invoice-date').textContent = new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    
    const itemBody = document.getElementById('invoice-item-body');
    itemBody.innerHTML = '';
    order.items.forEach((item, index) => {
        const row = itemBody.insertRow(index);
        row.style.height = '40px';
        row.style.backgroundColor = index % 2 === 0 ? '#fafafa' : '#ffffff';

        row.insertCell(0).textContent = item.name;
        row.insertCell(1).textContent = item.quantity;
        row.insertCell(2).textContent = `LKR ${item.price.toFixed(2)}`;
        row.insertCell(3).textContent = `LKR ${(item.price * item.quantity).toFixed(2)}`;
    });

    // Summary totals set
    document.getElementById('invoice-subtotal').textContent = `LKR ${total.toFixed(2)}`;
    document.getElementById('invoice-delivery').textContent = `LKR ${DELIVERY_FEE.toFixed(2)}`;
    document.getElementById('invoice-discount').textContent = `- LKR ${discountAmount.toFixed(2)}`; 
    document.getElementById('invoice-total').textContent = `LKR ${order.total.toFixed(2)}`;
    
    document.getElementById('invoice-logo').src = LOGO_URL; 

    try {
        const canvas = await html2canvas(invoiceElement, {
            scale: 1.5, logging: false, useCORS: true, windowWidth: 800, windowHeight: invoiceElement.scrollHeight
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4'); 
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Order_Invoice_${order.id.slice(-6)}.pdf`);
        
        toast({ title: '📥 Download Complete', description: 'Your invoice has been downloaded.', duration: 2000 });
    } catch (error) {
        console.error("PDF Generation Error:", error);
        toast({ title: '❌ Download Failed', description: 'Could not generate PDF invoice. Check if logo URL is accessible.', variant: 'destructive', duration: 2000 });
    } finally {
        setIsDownloading(false);
    }
  };


  // --- Coupon Apply Logic ---
  const handleApplyCoupon = async () => {
    if (!isAuthenticated || !user?.token) {
        toast({ title: 'Login Required', description: 'Please log in to use a coupon.', variant: 'destructive', duration: 2000 });
        return;
    }
    if (!couponCode.trim()) {
        toast({ title: 'Missing Code', description: 'Please enter a coupon code.', variant: 'destructive', duration: 2000 });
        return;
    }
    
    setIsApplying(true);

    try {
        const res = await fetch(`${API_URL}/orders/apply-coupon`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({ 
                code: couponCode.trim().toUpperCase(),
                cartTotal: total // Subtotal එක යවයි
            }),
        });

        const data = await res.json();

        if (res.ok && data.success) {
            // ✅ Discount Amount State එක යාවත්කාලීන කරයි
            setDiscountAmount(data.discount);
            setAppliedCoupon({ id: data.couponId, code: couponCode.trim().toUpperCase(), amount: data.discount, prizeName: data.prizeName });
            
            toast({ 
                title: `🎉 Coupon Applied!`, 
                description: `${data.prizeName} applied successfully! Discount: LKR ${data.discount.toFixed(2)}`,
                duration: 5000
            });
        } else {
            setDiscountAmount(0);
            setAppliedCoupon(null);
            toast({ title: '❌ Invalid Code', description: data.message || 'Coupon could not be applied.', variant: 'destructive', duration: 2000 });
        }
    } catch (error) {
        setDiscountAmount(0);
        setAppliedCoupon(null);
        toast({ title: 'Network Error', description: 'Could not connect to server.', variant: 'destructive', duration: 2000 });
    } finally {
        setIsApplying(false);
    }
  };

  const handleRemoveCoupon = () => {
      setCouponCode('');
      setDiscountAmount(0);
      setAppliedCoupon(null);
      toast({ title: 'Coupon Removed', description: 'Discount has been reverted.', duration: 2000 });
  }

  // --- Checkout Logic (Modified to include Coupon ID) ---
  const handleCheckout = async () => {
    setIsCheckingOut(true);
    
    if (!isAuthenticated) { 
        toast({ title: 'Login Required', description: 'Please log in to place an order.', variant: 'destructive', duration: 2000 });
        navigate('/auth');
        setIsCheckingOut(false);
        return;
    }
    if (!address.trim()) { 
        toast({ title: 'Please enter delivery address', variant: 'destructive', duration: 2000 });
        setIsCheckingOut(false);
        return;
    }

    // ✅ Card Payment Placeholder
    if (paymentMethod === 'card') {
        toast({ title: 'Coming Soon!', description: 'Card payment functionality is not yet implemented.', variant: 'secondary', duration: 3000 });
        setIsCheckingOut(false);
        return;
    }


    const finalTotal = total + DELIVERY_FEE - discountAmount;

    // Backend API එකට යැවීමට අවශ්‍ය Order Data සකස් කිරීම
    const orderData = {
      items: items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
      })),
      total: finalTotal, // Final Discounted Total යවයි
      userId: user._id, 
      address,
      paymentMethod: paymentMethod, // ✅ Payment method එකතු කිරීම
      couponId: appliedCoupon ? appliedCoupon.id : null, 
    };

    try {
      // Order API call කිරීම
      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`, 
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to place order.');
      }

      // Order successful වූ පසු Bill එක generate කිරීම
      const createdOrder = {
        id: data.orderId,
        items: orderData.items,
        total: orderData.total,
        address: orderData.address,
        createdAt: new Date().toISOString(),
      };
      
      await generateBill(createdOrder, user); 

      // ✅ Conditional logic based on payment method
      if (paymentMethod === 'deposit') {
        setCompletedOrderInfo({ orderId: data.orderId, totalAmount: finalTotal });
        setIsBankInfoOpen(true);
        // Clear cart after dialog is closed by the user
      } else { // For 'cash' on delivery
        clearCart();
        setDiscountAmount(0); 
        setAppliedCoupon(null);
        setCouponCode(''); 
        toast({ title: '🎉 Order placed successfully!', description: `Order ID: ${data.orderId.slice(-6)}`, duration: 2000 });
      }

      // Clear cart and reset states after bank dialog is closed
      if (paymentMethod !== 'deposit') navigate('/orders');
      
    } catch (error) {
      console.error('Checkout error:', error);
      toast({ title: '❌ Checkout Failed', description: error.message, variant: 'destructive', duration: 2000 });
    } finally {
      setIsCheckingOut(false);
    }
  };

  // ✅ Function to handle closing the bank info dialog
  const handleBankDialogClose = () => {
    setIsBankInfoOpen(false);
    clearCart();
    setDiscountAmount(0);
    setAppliedCoupon(null);
    setCouponCode('');
    navigate('/orders');
  }


  // 🛒 Empty cart UI
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
        <Navbar />
        <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 py-10 mx-auto text-center animate-fadeInBlur">
          <ShoppingBag className="w-20 h-20 mx-auto mb-6 text-muted-foreground md:w-24 md:h-24" />
          <h2 className="mb-3 text-2xl font-bold md:text-3xl">Your cart is empty</h2>
          <p className="max-w-sm mb-8 text-muted-foreground">Looks like you haven't added any burgers yet. Let's find something delicious.</p>
          <Button
            onClick={() => navigate('/menu')}
            size="lg"
            className="gap-2 transition-transform duration-200 gold-glow hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Menu
          </Button>
        </div>
      </div>
    );
  }

  // 🧾 Cart UI
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <Navbar />
      <div className="container px-4 py-8 mx-auto animate-fadeInBlur">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold md:text-5xl">Your Cart</h1>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* 🧍 Cart Items (unchanged) */}
          <div className="space-y-4 lg:col-span-2">
            {items.map((item, index) => (
              <Card key={item.id} className="p-4 transition-all duration-300 glass hover:border-primary/50 hover:shadow-lg animate-fadeInUp" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <img src={`${BASE_URL}${item.image}`} alt={item.name} className="object-cover w-full h-32 rounded-md sm:w-24 sm:h-24" />
                  <div className="flex-1 sm:text-left">
                    <div className="flex justify-between">
                      <h3 className="text-lg font-bold leading-tight">{item.name}</h3>
                      <p className="hidden text-lg font-bold sm:block whitespace-nowrap">LKR {(item.price * item.quantity).toFixed(2)}</p>
                    </div>

                    <p className="text-sm font-semibold text-primary sm:text-left">LKR {item.price.toFixed(2)} each</p>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <Button size="icon" variant="outline" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="transition-transform duration-200 hover:scale-110"><Minus className="w-4 h-4" /></Button>
                        <span className="w-8 font-semibold text-center">{item.quantity}</span>
                        <Button size="icon" variant="outline" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="transition-transform duration-200 hover:scale-110"><Plus className="w-4 h-4" /></Button>
                      </div>

                      <Button size="icon" variant="destructive" onClick={() => removeItem(item.id)} className="transition-transform duration-200 hover:scale-110"><Trash2 className="w-4 h-4" /></Button>
                    </div>

                    <div className="mt-2 text-right sm:hidden">
                      <p className="text-lg font-bold">LKR {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* 💳 Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky p-6 space-y-6 glass top-24">
              <h2 className="text-2xl font-bold">Order Summary</h2>

              {/* Coupon Input Section */}
              <div className="space-y-2 pt-2 border-t border-border/50">
                <Label htmlFor="coupon">Have a Coupon Code?</Label>
                <div className="flex gap-2">
                    <Input
                        id="coupon"
                        placeholder="EASY100-XYZ"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        disabled={!!appliedCoupon || isApplying}
                    />
                    {appliedCoupon ? (
                        <Button onClick={handleRemoveCoupon} variant="outline" className="w-24 gap-1">
                            <X className='w-4 h-4' /> Remove
                        </Button>
                    ) : (
                        <Button 
                            onClick={handleApplyCoupon} 
                            variant="secondary" 
                            disabled={!couponCode.trim() || isApplying}
                            className="w-24"
                        >
                            {isApplying ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                        </Button>
                    )}
                </div>
                {appliedCoupon && (
                    <Badge className="bg-green-600/20 text-green-400 gap-1">
                        <Tag className='w-3 h-3' /> Code {appliedCoupon.code} Applied
                    </Badge>
                )}
              </div>
              
              {/* Totals Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>LKR {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery Fee</span>
                  <span>LKR {DELIVERY_FEE.toFixed(2)}</span>
                </div>

                {discountAmount > 0 && (
                    <div className="flex justify-between text-red-400 font-semibold border-t border-border/50 pt-1">
                        <span>Coupon Discount</span>
                        <span>- LKR {discountAmount.toFixed(2)}</span>
                    </div>
                )}
                
                <div className="flex justify-between pt-2 text-xl font-bold border-t">
                  <span>Total</span>
                  <span className="text-primary">
                    LKR {(total + DELIVERY_FEE - discountAmount).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Delivery Address</Label>
                <Input
                  id="address"
                  placeholder="123 Main St, Apt 4B"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              
              {/* ✅ Payment Method Selection */}
              <div className="space-y-3 pt-4 border-t border-border/50">
                <Label>Payment Method</Label>
                <RadioGroup defaultValue="cash" value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-1 gap-2">
                  <Label className="flex items-center gap-3 p-4 rounded-lg cursor-pointer border-2 border-transparent bg-muted/50 transition-all duration-200 hover:border-primary/50 data-[state=checked]:border-primary data-[state=checked]:bg-primary/10">
                    <RadioGroupItem value="cash" id="cash" />
                    <Banknote className="w-5 h-5 text-green-400" />
                    <span>Cash on Delivery</span>
                  </Label>
                  <Label className="flex items-center gap-3 p-4 rounded-lg cursor-pointer border-2 border-transparent bg-muted/50 transition-all duration-200 hover:border-primary/50 data-[state=checked]:border-primary data-[state=checked]:bg-primary/10">
                    <RadioGroupItem value="card" id="card" />
                    <CreditCard className="w-5 h-5 text-blue-400" />
                    <span>Card Payment <Badge variant="outline" className="text-xs">Beta</Badge></span>
                  </Label>
                   <Label className="flex items-center gap-3 p-4 rounded-lg cursor-pointer border-2 border-transparent bg-muted/50 transition-all duration-200 hover:border-primary/50 data-[state=checked]:border-primary data-[state=checked]:bg-primary/10">
                    <RadioGroupItem value="deposit" id="deposit" />
                    <Landmark className="w-5 h-5 text-purple-400" />
                    <span>Bank Deposit <Badge variant="outline" className="text-xs">Coming Soon</Badge></span>
                  </Label>
                </RadioGroup>
              </div>

              <Button
                onClick={handleCheckout}
                className="w-full gap-2 transition-transform duration-200 gold-glow hover:scale-105"
                size="lg"
                disabled={isCheckingOut || items.length === 0 || isDownloading}
              >
                {isCheckingOut || isDownloading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> {isDownloading ? "Generating Bill..." : "Processing..."}
                  </>
                ) : (
                  'Checkout & Get Bill'
                )}
                <Receipt className="w-5 h-5" />
              </Button>
            </Card>
          </div>
        </div>
      </div>

      {/* ✅ Bank Deposit Info Dialog */}
      {completedOrderInfo && (
        <BankDepositInfoDialog 
          isOpen={isBankInfoOpen}
          onOpenChange={handleBankDialogClose}
          {...completedOrderInfo}
        />
      )}

      {/* 🛑 Hidden Invoice Content for PDF Generation (Layout code remains the same) 🛑 */}
      <div 
        id="invoice-content"
        style={{
            position: 'absolute',
            left: '-9999px',
            top: '0',
            width: '800px', 
            backgroundColor: '#ffffff',
            color: '#333333',
            padding: '40px',
            fontFamily: 'Arial, sans-serif',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)'
        }}
      >
        {/* Invoice Header (Logo and Title) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '4px solid #f97316', paddingBottom: '15px', marginBottom: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img id="invoice-logo" src={LOGO_URL} alt="BurgerShop Logo" style={{ height: '60px', marginRight: '15px', objectFit: 'contain' }} crossOrigin="anonymous" />
                <span style={{ fontSize: '36px', fontWeight: 'bold', color: '#f97316' }}>BURGER SHOP</span>
            </div>
            <h1 style={{ fontSize: '32px', color: '#666', fontWeight: '300' }}>SALES INVOICE</h1>
        </div>
        
        {/* Customer & Order Details */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
            <div style={{ lineHeight: '1.8', fontSize: '14px' }}>
                <p style={{ fontWeight: 'bold', color: '#f97316', marginBottom: '5px' }}>BILL TO:</p>
                <p style={{ fontWeight: 'bold' }}><span id="invoice-customer-name"></span></p>
                <p><span id="invoice-customer-email"></span></p>
                <p>Delivery Address: <span id="invoice-address"></span></p>
            </div>
            <div style={{ lineHeight: '1.8', fontSize: '14px', textAlign: 'right' }}>
                <p style={{ fontSize: '16px' }}><strong>Invoice #:</strong> <span id="invoice-order-id"></span></p>
                <p style={{ fontSize: '16px' }}><strong>Invoice Date:</strong> <span id="invoice-date"></span></p>
                <p style={{ marginTop: '10px', fontSize: '20px', fontWeight: 'bold', color: '#10b981' }}>STATUS: PENDING</p>
            </div>
        </div>

        {/* Items Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px', fontSize: '14px' }}>
            <thead>
                <tr style={{ backgroundColor: '#f97316', color: '#ffffff' }}>
                    <th style={{ padding: '12px 15px', textAlign: 'left', fontWeight: 'bold', border: 'none' }}>ITEM DESCRIPTION</th>
                    <th style={{ padding: '12px 15px', textAlign: 'left', fontWeight: 'bold', border: 'none' }}>QTY</th>
                    <th style={{ padding: '12px 15px', textAlign: 'left', fontWeight: 'bold', border: 'none' }}>UNIT PRICE</th>
                    <th style={{ padding: '12px 15px', textAlign: 'left', fontWeight: 'bold', border: 'none' }}>AMOUNT</th>
                </tr>
            </thead>
            <tbody id="invoice-item-body" style={{ color: '#333' }}>
                {/* Rows are dynamically inserted by generateBill() */}
            </tbody>
        </table>
        
        {/* Totals Section */}
        <div style={{ float: 'right', width: '50%', fontSize: '16px', lineHeight: '2' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
                <span>Subtotal:</span>
                <span id="invoice-subtotal" style={{ fontWeight: 'bold' }}></span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
                <span>Delivery Fee:</span>
                <span id="invoice-delivery" style={{ fontWeight: 'bold' }}></span>
            </div>
             {/* ✅ Discount Line Added to PDF */}
             <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', color: '#eab308' }}>
                <span>Coupon Discount:</span>
                <span id="invoice-discount" style={{ fontWeight: 'bold' }}></span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderTop: '2px solid #333', marginTop: '15px', fontSize: '22px', fontWeight: 'bolder' }}>
                <span>GRAND TOTAL (LKR):</span>
                <span id="invoice-total" style={{ color: '#f97316' }}></span>
            </div>
        </div>
        
        {/* Footer Note */}
        <div style={{ clear: 'both', paddingTop: '60px', textAlign: 'center', fontSize: '12px', color: '#666', borderTop: '1px solid #eee', marginTop: '40px' }}>
            <p>Payment due upon receipt. Thank you for choosing BurgerShop!</p>
        </div>
      </div>
    </div>
  );
};

export default Cart;