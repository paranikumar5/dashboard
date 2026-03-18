import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { fetchWithRetry } from '../utils/api';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate a small delay for better UX
    setTimeout(() => {
      try {
        // Static Admin Credentials Check
        const isAdminLogin = email === 'admin@flexistore.com' && password === 'admin123';
        
        if (isAdminLogin) {
          login(email, 'admin');
          navigate('/dashboard');
          return;
        }

        // Normal Customer Login logic
        const storedRole = localStorage.getItem('userRole') as 'customer' | 'admin' | null;
        const finalRole = storedRole || 'customer';
        
        login(email, finalRole);
        
        if (finalRole === 'admin') {
          navigate('/dashboard');
        } else {
          navigate('/products');
        }
      } catch (err: any) {
        console.error('Login error:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Welcome Back</h2>
          <p className="text-gray-500">Please enter your details to sign in</p>
          <div className="mt-4 p-3 bg-indigo-50 rounded-xl text-xs text-indigo-700 font-medium border border-indigo-100">
            Admin: admin@flexistore.com / admin123
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin" />
                <span>Signing In...</span>
              </div>
            ) : (
              <>Sign In <ArrowRight size={20} /></>
            )}
          </button>
        </form>

        <div className="text-center pt-4">
          <p className="text-gray-500">
            Don't have an account?{' '}
            <Link to="/signup" className="text-indigo-600 font-bold hover:underline">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
