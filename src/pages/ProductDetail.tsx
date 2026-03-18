import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Shield, Truck, RotateCcw } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { fetchWithRetry } from '../utils/api';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetchWithRetry('/api/products')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch product');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          const found = data.find((p: Product) => p._id === id);
          setProduct(found || null);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        const msg = err.message || String(err);
        if (msg.includes('SERVER_STARTING')) {
          setError('The server is taking a bit longer to start. Please try again in a moment.');
        } else {
          setError('Failed to load product details.');
        }
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-20 text-center">Loading product details...</div>;

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="text-red-600 font-bold text-xl">{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all"
        >
          Retry Now
        </button>
      </div>
    );
  }

  if (!product) return <div className="p-20 text-center">Product not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-medium mb-8 group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Back to Products
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square rounded-3xl overflow-hidden border border-gray-100 bg-white">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          <div className="space-y-4">
            <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-bold uppercase tracking-wider">
              {product.category}
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
              {product.name}
            </h1>
            <div className="text-3xl font-bold text-gray-900">${product.price}</div>
          </div>

          <p className="text-lg text-gray-600 leading-relaxed">
            {product.description}
          </p>

          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Availability</span>
              <span className={`font-bold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `${product.stock} units in stock` : 'Out of stock'}
              </span>
            </div>
            <button 
              onClick={() => addToCart(product)}
              disabled={product.stock <= 0}
              className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-bold text-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-indigo-200"
            >
              <ShoppingCart size={24} />
              Add to Cart
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-gray-100">
            <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-2xl">
              <Truck className="text-indigo-600 mb-2" size={24} />
              <span className="text-xs font-bold text-gray-900">Free Shipping</span>
            </div>
            <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-2xl">
              <Shield className="text-indigo-600 mb-2" size={24} />
              <span className="text-xs font-bold text-gray-900">2 Year Warranty</span>
            </div>
            <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-2xl">
              <RotateCcw className="text-indigo-600 mb-2" size={24} />
              <span className="text-xs font-bold text-gray-900">30 Day Returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
