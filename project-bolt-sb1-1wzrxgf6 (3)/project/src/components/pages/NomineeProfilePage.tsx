import React, { useState, useEffect } from 'react';
import { Heart, ExternalLink, Share2, Trophy, Star, Users, TrendingUp, Facebook, Instagram, Twitter, Youtube, Music, Globe } from 'lucide-react';
import { Nominee, Vote } from '../../types';
import { apiService } from '../../services/api';

interface NomineeProfilePageProps {
  nomineeId: string;
  onVote: (vote: Omit<Vote, 'timestamp'>) => void;
  userVotes: Vote[];
}

const socialIcons = {
  Facebook,
  Instagram,
  Twitter,
  YouTube: Youtube,
  TikTok: Music,
  Website: Globe
};

export const NomineeProfilePage: React.FC<NomineeProfilePageProps> = ({ 
  nomineeId, 
  onVote, 
  userVotes 
}) => {
  const [nominee, setNominee] = useState<Nominee | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);

  useEffect(() => {
    loadNominee();
  }, [nomineeId]);

  const loadNominee = async () => {
    try {
      const response = await apiService.getNomineeById(nomineeId);
      if (response.success) {
        setNominee(response.data);
      }
    } catch (error) {
      console.error('Failed to load nominee:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasVotedForNominee = () => {
    return userVotes.some(vote => vote.nomineeId === nomineeId);
  };

  const hasVotedInCategory = () => {
    if (!nominee) return false;
    return userVotes.some(vote => vote.category === nominee.category);
  };

  const handleVote = async () => {
    if (!nominee || hasVotedInCategory()) return;

    setVoting(true);
    try {
      await onVote({
        nomineeId: nominee.id,
        category: nominee.category,
        voterIdentifier: 'user-' + Date.now()
      });
      
      // Update local vote count
      setNominee(prev => prev ? { ...prev, votes: prev.votes + 1 } : null);
    } catch (error) {
      console.error('Voting failed:', error);
    } finally {
      setVoting(false);
    }
  };

  const shareProfile = () => {
    if (nominee) {
      const url = window.location.href;
      if (navigator.share) {
        navigator.share({
          title: `Vote for ${nominee.name} - Creator Awards 2024`,
          text: `Support ${nominee.name} in the Creator Awards!`,
          url: url
        });
      } else {
        navigator.clipboard.writeText(url);
        // You could add a toast notification here
      }
    }
  };

  const getSocialIcon = (platform: string) => {
    const IconComponent = socialIcons[platform as keyof typeof socialIcons];
    return IconComponent || Globe;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!nominee) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Nominee Not Found</h2>
          <p className="text-gray-600">The nominee you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white py-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 opacity-20">
          <img
            src={nominee.profileImage}
            alt={nominee.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-blue-900/80 to-indigo-900/80"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Profile Image */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-pink-500 rounded-full blur-lg opacity-50"></div>
              <img
                src={nominee.profileImage}
                alt={nominee.name}
                className="relative w-64 h-64 lg:w-80 lg:h-80 rounded-full object-cover border-6 border-white shadow-2xl"
              />
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white w-20 h-20 rounded-full flex items-center justify-center shadow-lg">
                <Trophy className="w-10 h-10" />
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
                <Star className="w-5 h-5 mr-2 text-yellow-400" />
                <span className="text-sm font-semibold">{nominee.platform} Creator</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-black mb-6">{nominee.name}</h1>
              <p className="text-xl lg:text-2xl mb-8 opacity-90 max-w-3xl leading-relaxed">{nominee.bio}</p>
              
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                <div className="flex items-center space-x-6">
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm px-8 py-4 rounded-full">
                    <div className="flex items-center">
                      <Heart className="w-6 h-6 mr-3 text-red-400" />
                      <span className="font-bold text-2xl">{nominee.votes.toLocaleString()}</span>
                      <span className="ml-2 opacity-80">votes</span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-8 py-4 rounded-full">
                    <span className="font-bold text-white text-lg">Featured Nominee</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleVote}
                  disabled={hasVotedInCategory() || voting}
                  className={`px-10 py-5 rounded-full text-lg font-bold transition-all duration-300 ${
                    hasVotedForNominee()
                      ? 'bg-green-500 text-white shadow-lg'
                      : hasVotedInCategory()
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : voting
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 hover:shadow-2xl hover:scale-105'
                  }`}
                >
                  {voting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Voting...
                    </div>
                  ) : hasVotedForNominee() ? (
                    <div className="flex items-center">
                      <Heart className="w-6 h-6 mr-2 fill-current" />
                      Voted
                    </div>
                  ) : hasVotedInCategory() ? (
                    'Already Voted in Category'
                  ) : (
                    <div className="flex items-center">
                      <Heart className="w-6 h-6 mr-2" />
                      Vote Now
                    </div>
                  )}
                </button>
                
                <button
                  onClick={shareProfile}
                  className="bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 text-white px-10 py-5 rounded-full text-lg font-bold transition-all duration-300 flex items-center"
                >
                  <Share2 className="w-6 h-6 mr-2" />
                  Share Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Details Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-gray-50 rounded-3xl p-8 mb-8">
                <h2 className="text-3xl font-black text-gray-900 mb-6">About {nominee.name}</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-8">{nominee.bio}</p>
                
                {/* Social Links */}
                {nominee.socialLinks && nominee.socialLinks.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Connect with {nominee.name}</h3>
                    <div className="flex flex-wrap gap-4">
                      {nominee.socialLinks.map((link) => {
                        const IconComponent = getSocialIcon(link.platform);
                        return (
                          <a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group bg-white hover:bg-gray-100 border-2 border-gray-200 hover:border-purple-300 px-6 py-4 rounded-2xl transition-all duration-300 flex items-center hover:scale-105"
                          >
                            <IconComponent className="w-6 h-6 mr-3 text-gray-600 group-hover:text-purple-600" />
                            <span className="font-semibold text-gray-700 group-hover:text-purple-700">
                              {link.platform}
                            </span>
                            <ExternalLink className="w-4 h-4 ml-2 text-gray-400 group-hover:text-purple-500" />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Primary Profile Link */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Visit {nominee.name}'s {nominee.platform}</h3>
                <p className="text-lg opacity-90 mb-6">
                  Check out their amazing content and see why they're nominated for Creator Awards 2024!
                </p>
                <a
                  href={nominee.profileLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-white text-purple-600 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-colors"
                >
                  Visit Profile
                  <ExternalLink className="w-5 h-5 ml-2" />
                </a>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Stats */}
              <div className="bg-gray-50 rounded-3xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Nominee Stats</h3>
                <div className="space-y-6">
                  <div className="flex items-center">
                    <div className="bg-red-100 p-3 rounded-2xl mr-4">
                      <Heart className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{nominee.votes.toLocaleString()}</div>
                      <div className="text-gray-600">Total Votes</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-3 rounded-2xl mr-4">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{nominee.platform}</div>
                      <div className="text-gray-600">Primary Platform</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="bg-yellow-100 p-3 rounded-2xl mr-4">
                      <Trophy className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-900">Nominated</div>
                      <div className="text-gray-600">Creator Awards 2024</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vote Progress */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-3xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Help {nominee.name} Win!</h3>
                <p className="text-gray-700 mb-6">
                  Every vote counts! Share this profile with friends and help {nominee.name} 
                  reach the top of their category.
                </p>
                <div className="bg-white rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-600">Vote Progress</span>
                    <span className="text-sm font-bold text-gray-900">{nominee.votes} votes</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (nominee.votes / 1000) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Share Section */}
              <div className="bg-purple-50 border-2 border-purple-200 rounded-3xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Spread the Word</h3>
                <p className="text-gray-700 mb-6">
                  Share {nominee.name}'s profile and help them get more votes!
                </p>
                <button
                  onClick={shareProfile}
                  className="w-full bg-purple-600 text-white px-6 py-4 rounded-2xl font-bold hover:bg-purple-700 transition-colors flex items-center justify-center"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Share This Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};