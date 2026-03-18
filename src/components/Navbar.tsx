import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

export const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-2xl font-bold text-indigo-600">
            FlexiStore
          </Link>

          <div className="flex items-center space-x-6">
            <Link to="/products" className="text-gray-600 hover:text-indigo-600 font-medium">
              Products
            </Link>
            
            <Link to="/cart" className="relative group">
              <ShoppingCart className="text-gray-600 group-hover:text-indigo-600" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {isAdmin && (
                  <Link to="/dashboard" className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-700 font-medium">
                    <LayoutDashboard size={20} />
                    <span className="hidden sm:inline">Admin</span>
                  </Link>
                )}
                <div className="flex items-center space-x-2 text-gray-700">
                  <User size={20} />
                  <span className="hidden sm:inline font-medium">{user?.name}</span>
                </div>
                <button 
                  onClick={() => { logout(); navigate('/login'); }}
                  className="text-gray-600 hover:text-red-600"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-medium">
                  Login
                </Link>
                <Link to="/signup" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
