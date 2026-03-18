import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, ShieldCheck, ArrowRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { fetchWithRetry } from '../utils/api';

export const Checkout: React.FC = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const { user, token, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetchWithRetry('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          products: cart.map(item => ({
            productId: item._id,
            name: item.name,
            quantity: item.quantity,
            price: item.price
          })),
          totalAmount: totalPrice
        })
      });

      if (response.ok) {
        clearCart();
        navigate('/order-success');
      } else {
        const data = await response.json();
        const errorMsg = data.error || 'Failed to place order';
        if (errorMsg.includes('SERVER_STARTING')) {
          alert('The server is still starting up. Please try again in a moment.');
        } else {
          alert(errorMsg);
        }
      }
    } catch (err: any) {
      const msg = err.message || String(err);
      if (msg.includes('SERVER_STARTING')) {
        alert('The server is still starting up. Please try again in a moment.');
      } else {
        alert('Network error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-12">Checkout</h1>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping Info */}
          <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 text-indigo-600">
              <Truck size={24} />
              <h2 className="text-2xl font-bold text-gray-900">Shipping Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Full Name</label>
                <input type="text" defaultValue={user?.name} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Email Address</label>
                <input type="email" defaultValue={user?.email} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-gray-700">Shipping Address</label>
                <textarea required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none" placeholder="Street address, apartment, suite, etc."></textarea>
              </div>
            </div>
          </section>

          {/* Payment Info */}
          <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 text-indigo-600">
              <CreditCard size={24} />
              <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Card Number</label>
                <input type="text" placeholder="0000 0000 0000 0000" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Expiry Date</label>
                  <input type="text" placeholder="MM/YY" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">CVV</label>
                  <input type="text" placeholder="000" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6 sticky top-24">
            <h2 className="text-2xl font-bold text-gray-900">Final Summary</h2>
            <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
              {cart.map(item => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.name} x {item.quantity}</span>
                  <span className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-gray-100 space-y-4">
              <div className="flex justify-between text-xl">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-indigo-600">${totalPrice.toFixed(2)}</span>
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-indigo-100"
              >
                {loading ? 'Processing...' : 'Place Order'} <ArrowRight size={20} />
              </button>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 justify-center">
              <ShieldCheck size={16} className="text-green-500" />
              Secure encrypted checkout
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
