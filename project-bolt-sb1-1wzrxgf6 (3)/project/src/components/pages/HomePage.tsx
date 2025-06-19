import React from 'react';
import { Award, Users, Trophy, UserPlus, Vote, Calendar, Sparkles, TrendingUp, Heart } from 'lucide-react';
import { NomineeSlider } from '../NomineeSlider';
import { Page, Nominee } from '../../types';

interface HomePageProps {
  nominees: Nominee[];
  onPageChange: (page: Page) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ nominees, onPageChange }) => {
  // Only show nominees with 20+ votes on the homepage
  const visibleNominees = nominees.filter(nominee => nominee.votes >= 20);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white py-24 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-yellow-400 to-pink-500 transform rotate-12 scale-150"></div>
        </div>
        
        {/* Hero Background Image */}
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Content creators collaborating"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-blue-900/80 to-indigo-900/80"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-pink-500 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-blue-400 rounded-full opacity-20 animate-pulse"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center bg-white bg-opacity-10 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
              <Sparkles className="w-5 h-5 mr-2 text-yellow-400" />
              <span className="text-sm font-semibold">Creator Awards 2024</span>
            </div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight">
            <span className="bg-gradient-to-r from-yellow-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
              Celebrate
            </span>
            <br />
            <span className="text-white">Digital Excellence</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 opacity-90 max-w-4xl mx-auto leading-relaxed">
            Honoring the most influential and creative social media personalities who inspire, 
            entertain, and connect millions across the digital landscape
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <button
              onClick={() => onPageChange('register')}
              className="group bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-10 py-5 rounded-full text-lg font-bold hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 shadow-2xl hover:shadow-yellow-500/25 hover:scale-105"
            >
              <span className="flex items-center justify-center">
                <UserPlus className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
                Register as Nominee
              </span>
            </button>
            <button
              onClick={() => onPageChange('vote')}
              className="group bg-transparent border-3 border-white text-white px-10 py-5 rounded-full text-lg font-bold hover:bg-white hover:text-purple-900 transition-all duration-300 backdrop-blur-sm"
            >
              <span className="flex items-center justify-center">
                <Heart className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                Vote Now
              </span>
            </button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-black text-yellow-400 mb-2">
                {nominees.reduce((sum, nominee) => sum + nominee.votes, 0).toLocaleString()}
              </div>
              <div className="text-sm opacity-80">Total Votes</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-pink-400 mb-2">{visibleNominees.length}+</div>
              <div className="text-sm opacity-80">Active Nominees</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-blue-400 mb-2">6</div>
              <div className="text-sm opacity-80">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-green-400 mb-2">24/7</div>
              <div className="text-sm opacity-80">Live Voting</div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Nominees Slider */}
      {visibleNominees.length > 0 && (
        <section className="py-20 bg-white relative">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center bg-gradient-to-r from-yellow-100 to-pink-100 rounded-full px-6 py-3 mb-6">
                <TrendingUp className="w-5 h-5 mr-2 text-orange-600" />
                <span className="text-sm font-semibold text-orange-800">Trending Now</span>
              </div>
              <h2 className="text-5xl font-black text-gray-900 mb-6">Leading Nominees</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Meet the creators who are currently leading in their categories
              </p>
            </div>
            <NomineeSlider nominees={visibleNominees} onPageChange={onPageChange} />
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-black text-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-6">How It Works</h2>
            <p className="text-xl opacity-80 max-w-2xl mx-auto">
              Three simple steps to participate in the most prestigious creator awards
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="bg-gradient-to-br from-yellow-500 to-orange-500 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                  <UserPlus className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 bg-white text-gray-900 w-8 h-8 rounded-full flex items-center justify-center text-lg font-black">1</div>
              </div>
              <h3 className="text-2xl font-bold mb-4">Nominees Register</h3>
              <p className="text-gray-300 leading-relaxed">
                Content creators showcase their work and register across multiple categories to compete for recognition
              </p>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="bg-gradient-to-br from-pink-500 to-red-500 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                  <Vote className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 bg-white text-gray-900 w-8 h-8 rounded-full flex items-center justify-center text-lg font-black">2</div>
              </div>
              <h3 className="text-2xl font-bold mb-4">Community Votes</h3>
              <p className="text-gray-300 leading-relaxed">
                Fans and followers cast their votes to support their favorite creators in each category
              </p>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-purple-500 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                  <Trophy className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 bg-white text-gray-900 w-8 h-8 rounded-full flex items-center justify-center text-lg font-black">3</div>
              </div>
              <h3 className="text-2xl font-bold mb-4">Winners Celebrated</h3>
              <p className="text-gray-300 leading-relaxed">
                Top creators in each category receive recognition and celebrate their achievements
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center bg-gradient-to-r from-purple-100 to-pink-100 rounded-full px-6 py-3 mb-6">
                <Award className="w-5 h-5 mr-2 text-purple-600" />
                <span className="text-sm font-semibold text-purple-800">About Creator Awards</span>
              </div>
              <h2 className="text-5xl font-black text-gray-900 mb-8 leading-tight">
                Celebrating Digital 
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> Innovation</span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                Creator Awards recognizes the digital pioneers who entertain, educate, and inspire millions. 
                From viral TikTok creators to thoughtful YouTube educators, from Instagram artists to Twitter 
                thought leaders, we celebrate the diverse talent shaping our online culture.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl">
                  <Award className="w-10 h-10 text-yellow-600 mx-auto mb-3" />
                  <h3 className="font-bold text-gray-900 mb-2">Excellence</h3>
                  <p className="text-sm text-gray-600">Recognizing outstanding creativity</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-pink-50 to-red-50 rounded-2xl">
                  <Users className="w-10 h-10 text-pink-600 mx-auto mb-3" />
                  <h3 className="font-bold text-gray-900 mb-2">Community</h3>
                  <p className="text-sm text-gray-600">Building stronger connections</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl">
                  <Calendar className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-bold text-gray-900 mb-2">Annual</h3>
                  <p className="text-sm text-gray-600">Yearly celebration of talent</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-pink-500 rounded-3xl transform rotate-6"></div>
              <img
                src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Content creators collaborating"
                className="relative rounded-3xl shadow-2xl w-full h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-yellow-400 to-pink-500 transform -rotate-12 scale-150"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <Sparkles className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
          </div>
          <h2 className="text-5xl font-black mb-8">Ready to Join the Awards?</h2>
          <p className="text-xl mb-12 opacity-90 max-w-3xl mx-auto">
            Whether you're a creator looking for recognition or a fan wanting to support your favorites, 
            join thousands in celebrating digital excellence
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => onPageChange('register')}
              className="group bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-10 py-5 rounded-full text-lg font-bold hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 shadow-2xl hover:shadow-yellow-500/25 hover:scale-105"
            >
              <span className="flex items-center justify-center">
                <UserPlus className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
                Register as Nominee
              </span>
            </button>
            <button
              onClick={() => onPageChange('vote')}
              className="group bg-transparent border-3 border-white text-white px-10 py-5 rounded-full text-lg font-bold hover:bg-white hover:text-purple-900 transition-all duration-300 backdrop-blur-sm"
            >
              <span className="flex items-center justify-center">
                <Heart className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                Vote for Your Favorites
              </span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};