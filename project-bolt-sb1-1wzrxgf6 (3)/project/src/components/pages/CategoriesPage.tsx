import React from 'react';
import { Facebook, Music, Instagram, Twitter, Youtube, Star, ExternalLink } from 'lucide-react';
import { Category, Page } from '../../types';

interface CategoriesPageProps {
  categories: Category[];
  onPageChange: (page: Page) => void;
}

const iconMap = {
  Facebook,
  Music,
  Instagram,
  Twitter,
  Youtube,
  Star
};

export const CategoriesPage: React.FC<CategoriesPageProps> = ({ categories, onPageChange }) => {
  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap];
    return IconComponent ? <IconComponent className="w-12 h-12" /> : <Star className="w-12 h-12" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Award Categories</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover all the categories where creators compete for recognition. Each category celebrates 
            different aspects of digital creativity and community building.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
            >
              <div className="p-8">
                <div className="bg-gradient-to-br from-yellow-400 to-red-500 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300">
                  {getIcon(category.icon)}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{category.name}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{category.description}</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => onPageChange('vote')}
                    className="flex-1 bg-gradient-to-r from-yellow-500 to-red-500 text-white px-6 py-3 rounded-full font-semibold hover:from-yellow-600 hover:to-red-600 transition-all duration-300 flex items-center justify-center"
                  >
                    Vote Now
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </button>
                  <button
                    onClick={() => onPageChange('results')}
                    className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors duration-300"
                  >
                    View Results
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Don't See Your Category?</h2>
          <p className="text-gray-600 mb-6">
            We're always looking to expand our awards to recognize more types of creative excellence. 
            Reach out to us with suggestions for new categories!
          </p>
          <button
            onClick={() => onPageChange('register')}
            className="bg-gradient-to-r from-yellow-500 to-red-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-yellow-600 hover:to-red-600 transition-all duration-300"
          >
            Register as Nominee
          </button>
        </div>
      </div>
    </div>
  );
};