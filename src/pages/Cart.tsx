import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

export const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-8">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag size={48} className="text-gray-400" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-gray-900">Your cart is empty</h2>
          <p className="text-gray-500">Looks like you haven't added anything to your cart yet.</p>
        </div>
        <Link 
          to="/products" 
          className="inline-block bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-12">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {cart.map(item => (
            <div key={item._id} className="bg-white p-6 rounded-2xl border border-gray-100 flex flex-col sm:flex-row gap-6 items-center">
              <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1 space-y-1 text-center sm:text-left">
                <h3 className="font-bold text-gray-900 text-lg">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.category}</p>
                <p className="font-bold text-indigo-600">${item.price}</p>
              </div>
              <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-xl">
                <button 
                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  className="p-2 hover:bg-white rounded-lg transition-colors text-gray-500"
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center font-bold text-gray-900">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  className="p-2 hover:bg-white rounded-lg transition-colors text-gray-500"
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900 text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                <button 
                  onClick={() => removeFromCart(item._id)}
                  className="text-red-500 hover:text-red-600 p-2"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>
            <div className="space-y-4 text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal ({totalItems} items)</span>
                <span className="font-bold text-gray-900">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600 font-bold">Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span className="font-bold text-gray-900">$0.00</span>
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-between text-xl">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-indigo-600">${totalPrice.toFixed(2)}</span>
              </div>
            </div>
            <button 
              onClick={() => navigate('/checkout')}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100"
            >
              Checkout <ArrowRight size={20} />
            </button>
          </div>
          <p className="text-center text-sm text-gray-500">
            Shipping and taxes calculated at checkout.
          </p>
        </div>
      </div>
    </div>
  );
};
