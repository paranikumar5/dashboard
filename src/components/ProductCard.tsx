import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow">
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
          <Link 
            to={`/products/${product._id}`}
            className="p-3 bg-white rounded-full text-gray-900 hover:bg-indigo-600 hover:text-white transition-colors"
          >
            <Eye size={20} />
          </Link>
          <button 
            onClick={() => addToCart(product)}
            className="p-3 bg-white rounded-full text-gray-900 hover:bg-indigo-600 hover:text-white transition-colors"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
      <div className="p-4">
        <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
          {product.category}
        </div>
        <h3 className="font-bold text-gray-900 mb-2 truncate">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">${product.price}</span>
          <span className={`text-xs font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>
      </div>
    </div>
  );
};
