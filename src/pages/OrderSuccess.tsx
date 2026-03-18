import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react';

export const OrderSuccess: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-8">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-bounce">
        <CheckCircle size={48} className="text-green-600" />
      </div>
      <div className="space-y-2">
        <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Order Placed Successfully!</h2>
        <p className="text-xl text-gray-500 max-w-lg mx-auto">
          Thank you for your purchase. We've sent a confirmation email to your inbox and will notify you when your order ships.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
        <Link 
          to="/products" 
          className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
        >
          Continue Shopping <ShoppingBag size={20} />
        </Link>
        <Link 
          to="/" 
          className="bg-gray-100 text-gray-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
        >
          Back to Home <ArrowRight size={20} />
        </Link>
      </div>
    </div>
  );
};
