import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Trophy, Heart, Star, ExternalLink, Eye } from 'lucide-react';
import { Nominee, Page } from '../types';

interface NomineeSliderProps {
  nominees: Nominee[];
  onPageChange: (page: Page, nomineeId?: string) => void;
}

export const NomineeSlider: React.FC<NomineeSliderProps> = ({ nominees, onPageChange }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Sort nominees by votes to show top nominees
  const topNominees = nominees.sort((a, b) => b.votes - a.votes).slice(0, 8);

  useEffect(() => {
    if (isAutoPlaying && topNominees.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % topNominees.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, topNominees.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % topNominees.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + topNominees.length) % topNominees.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const handleViewProfile = (nomineeId: string) => {
    onPageChange('nominee-profile', nomineeId);
  };

  if (topNominees.length === 0) return null;

  const currentNominee = topNominees[currentIndex];

  return (
    <div className="relative w-full">
      {/* Main Slider */}
      <div className="relative h-[500px] overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 shadow-2xl">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
          style={{
            backgroundImage: `url(${currentNominee.profileImage})`,
            filter: 'blur(20px) brightness(0.3)',
            transform: 'scale(1.1)'
          }}
        ></div>
        
        {/* Content */}
        <div className="relative h-full flex items-center justify-center p-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 max-w-6xl mx-auto">
            {/* Profile Image */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-pink-500 rounded-full blur-lg opacity-50"></div>
              <img
                src={currentNominee.profileImage}
                alt={currentNominee.name}
                className="relative w-48 h-48 lg:w-64 lg:h-64 rounded-full object-cover border-4 border-white shadow-2xl"
              />
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
                <Trophy className="w-8 h-8" />
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 text-white text-center lg:text-left">
              <div className="inline-flex items-center bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                <Star className="w-4 h-4 mr-2 text-yellow-400" />
                <span className="text-sm font-semibold">#{currentIndex + 1} Leading Nominee</span>
              </div>
              
              <h3 className="text-4xl lg:text-5xl font-black mb-4">{currentNominee.name}</h3>
              <p className="text-xl lg:text-2xl mb-4 opacity-90">{currentNominee.platform} Creator</p>
              <p className="text-lg opacity-80 mb-8 max-w-2xl leading-relaxed">{currentNominee.bio}</p>
              
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="flex items-center space-x-6">
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm px-6 py-3 rounded-full">
                    <div className="flex items-center">
                      <Heart className="w-5 h-5 mr-2 text-red-400" />
                      <span className="font-bold text-lg">{currentNominee.votes.toLocaleString()}</span>
                      <span className="ml-1 opacity-80">votes</span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-3 rounded-full">
                    <span className="font-bold text-white">Top Performer</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleViewProfile(currentNominee.id)}
                  className="group bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 text-white px-6 py-3 rounded-full transition-all duration-300 flex items-center"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  <span className="mr-2">View Profile</span>
                  <ExternalLink className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 text-white p-4 rounded-full transition-all duration-300 hover:scale-110"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 text-white p-4 rounded-full transition-all duration-300 hover:scale-110"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Thumbnail Navigation */}
      <div className="flex justify-center mt-8 space-x-4 overflow-x-auto pb-4">
        {topNominees.map((nominee, index) => (
          <button
            key={nominee.id}
            onClick={() => goToSlide(index)}
            className={`flex-shrink-0 relative transition-all duration-300 ${
              index === currentIndex ? 'scale-110' : 'hover:scale-105 opacity-70'
            }`}
          >
            <img
              src={nominee.profileImage}
              alt={nominee.name}
              className="w-16 h-16 rounded-full object-cover border-3 border-white shadow-lg"
            />
            {index === currentIndex && (
              <div className="absolute inset-0 rounded-full border-3 border-yellow-400 shadow-lg"></div>
            )}
          </button>
        ))}
      </div>

      {/* Progress Dots */}
      <div className="flex justify-center mt-6 space-x-2">
        {topNominees.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 w-8' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};