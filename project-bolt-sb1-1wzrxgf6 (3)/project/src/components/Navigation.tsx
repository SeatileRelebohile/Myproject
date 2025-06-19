import React from 'react';
import { Menu, X, Award, Sparkles, LogOut, User } from 'lucide-react';
import { Page } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface NavigationProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentPage, onPageChange }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  const navItems = [
    { page: 'home' as Page, label: 'Home' },
    { page: 'categories' as Page, label: 'Categories' },
    { page: 'how-it-works' as Page, label: 'How It Works' },
    { page: 'vote' as Page, label: 'Vote' },
    { page: 'results' as Page, label: 'Results' }
  ];

  const handleLogout = () => {
    logout();
    onPageChange('home');
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-xl sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl blur-lg opacity-30"></div>
              <div className="relative bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-2xl">
                <Award className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <button onClick={() => onPageChange('home')}>
                <span className="text-2xl font-black text-gray-900">Creator Awards</span>
                <div className="flex items-center">
                  <Sparkles className="w-4 h-4 text-yellow-500 mr-1" />
                  <span className="text-sm font-semibold text-gray-600">2024</span>
                </div>
              </button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-2">
              {navItems.map((item) => (
                <button
                  key={item.page}
                  onClick={() => onPageChange(item.page)}
                  className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ${
                    currentPage === item.page
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25 scale-105'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:scale-105'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => onPageChange('profile')}
                  className="flex items-center text-gray-700 hover:text-gray-900 px-4 py-2 rounded-2xl hover:bg-gray-100 transition-all duration-300"
                >
                  <User className="w-5 h-5 mr-2" />
                  <span className="font-semibold">Profile</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-red-600 hover:text-red-700 px-4 py-2 rounded-2xl hover:bg-red-50 transition-all duration-300"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  <span className="font-semibold">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onPageChange('login')}
                  className="text-gray-700 hover:text-gray-900 px-6 py-3 rounded-2xl text-sm font-bold hover:bg-gray-100 transition-all duration-300"
                >
                  Login
                </button>
                <button
                  onClick={() => onPageChange('register')}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-2xl text-sm font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-3 rounded-2xl text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 transition-all duration-300"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-4 pt-2 pb-6 space-y-2 bg-white border-t border-gray-100">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => {
                  onPageChange(item.page);
                  setIsMenuOpen(false);
                }}
                className={`block px-6 py-4 rounded-2xl text-base font-bold w-full text-left transition-all duration-300 ${
                  currentPage === item.page
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {item.label}
              </button>
            ))}
            
            {/* Mobile Auth */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      onPageChange('profile');
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center w-full px-6 py-4 rounded-2xl text-base font-bold text-gray-700 hover:bg-gray-100"
                  >
                    <User className="w-5 h-5 mr-3" />
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center w-full px-6 py-4 rounded-2xl text-base font-bold text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      onPageChange('login');
                      setIsMenuOpen(false);
                    }}
                    className="block w-full px-6 py-4 rounded-2xl text-base font-bold text-gray-700 hover:bg-gray-100"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      onPageChange('register');
                      setIsMenuOpen(false);
                    }}
                    className="block w-full px-6 py-4 rounded-2xl text-base font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};