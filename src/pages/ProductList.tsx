import React, { useEffect, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { fetchWithRetry } from '../utils/api';

export const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchWithRetry('/api/products')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data);
          setFilteredProducts(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let result = products;
    if (category !== 'All') {
      result = result.filter(p => p.category === category);
    }
    if (searchTerm) {
      result = result.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    setFilteredProducts(result);
  }, [searchTerm, category, products]);

  const categories = ['All', ...new Set(products.map(p => p.category))];

  if (loading) return <div className="p-20 text-center">Loading products...</div>;

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight w-[202.67px] max-w-full">All Products</h1>
          <p className="text-gray-500">Showing {filteredProducts.length} results</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none w-full sm:w-64"
            />
          </div>
          <div className="relative">
            <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="pl-10 pr-8 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none w-full sm:w-48"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
          <p className="text-xl text-gray-500">No products found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};
