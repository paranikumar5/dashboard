import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Truck, ShieldCheck, Zap } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { fetchWithRetry } from '../utils/api';

export const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchWithRetry('/api/products')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setFeaturedProducts(data.slice(0, 4));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Home products fetch error:', err);
        setError('Failed to load featured products.');
        setLoading(false);
      });
  }, []);

  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center bg-indigo-900 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://picsum.photos/seed/tech/1920/1080" 
            alt="Hero" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="max-w-2xl space-y-8">
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-tight w-[944px] max-w-full">
              Next-Gen Tech for <span className="text-indigo-400">Modern Life</span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Discover our curated collection of premium electronics and accessories designed to elevate your daily experience.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/products" 
                className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all flex items-center gap-2"
              >
                Shop Now <ArrowRight size={20} />
              </Link>
              <Link 
                to="/signup" 
                className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all"
              >
                Join Community
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { icon: <Truck className="text-indigo-600" />, title: "Free Shipping", desc: "On orders over $500" },
            { icon: <ShieldCheck className="text-indigo-600" />, title: "Secure Payment", desc: "100% secure checkout" },
            { icon: <Zap className="text-indigo-600" />, title: "Fast Delivery", desc: "24-48 hour shipping" },
            { icon: <ShoppingBag className="text-indigo-600" />, title: "Easy Returns", desc: "30-day money back" },
          ].map((feature, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 flex items-start gap-4">
              <div className="p-3 bg-indigo-50 rounded-xl">{feature.icon}</div>
              <div>
                <h3 className="font-bold text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
            <p className="text-gray-500">Our hand-picked selection of top-rated items.</p>
          </div>
          <Link to="/products" className="text-indigo-600 font-bold hover:underline flex items-center gap-1">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-gray-100 animate-pulse rounded-3xl" />
            ))
          ) : error ? (
            <div className="col-span-full text-center py-20 bg-red-50 rounded-3xl border border-red-100 space-y-4">
              <p className="text-red-600 font-bold">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-red-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-red-700 transition-all"
              >
                Retry
              </button>
            </div>
          ) : featuredProducts.length > 0 ? (
            featuredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-gray-400">
              No featured products available at the moment.
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-indigo-600 rounded-[2.5rem] p-12 sm:p-20 text-center text-white space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <h2 className="text-4xl sm:text-5xl font-extrabold relative z-10">Ready to upgrade your gear?</h2>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto relative z-10">
            Join thousands of happy customers and get access to exclusive deals and early product launches.
          </p>
          <div className="relative z-10">
            <Link 
              to="/signup" 
              className="bg-white text-indigo-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-all inline-block"
            >
              Get Started for Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
