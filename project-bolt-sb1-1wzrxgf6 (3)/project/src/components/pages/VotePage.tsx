import React, { useState } from 'react';
import { Heart, Check, Star, Trophy, TrendingUp, Users, ExternalLink, Sparkles } from 'lucide-react';
import { Nominee, Vote } from '../../types';
import { categories } from '../../data/mockData';

interface VotePageProps {
  nominees: Nominee[];
  onVote: (vote: Omit<Vote, 'timestamp'>) => void;
  userVotes: Vote[];
}

export const VotePage: React.FC<VotePageProps> = ({ nominees, onVote, userVotes }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [votingFor, setVotingFor] = useState<string | null>(null);

  const filteredNominees = selectedCategory === 'all' 
    ? nominees.sort((a, b) => b.votes - a.votes)
    : nominees.filter(nominee => nominee.category === selectedCategory).sort((a, b) => b.votes - a.votes);

  const hasVotedInCategory = (category: string) => {
    return userVotes.some(vote => vote.category === category);
  };

  const hasVotedForNominee = (nomineeId: string) => {
    return userVotes.some(vote => vote.nomineeId === nomineeId);
  };

  const handleVote = async (nominee: Nominee) => {
    if (hasVotedInCategory(nominee.category)) {
      alert('You have already voted in this category!');
      return;
    }

    setVotingFor(nominee.id);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onVote({
      nomineeId: nominee.id,
      category: nominee.category,
      voterIdentifier: 'user-' + Date.now()
    });
    
    setVotingFor(null);
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

  const getRankPosition = (nominee: Nominee) => {
    const categoryNominees = nominees.filter(n => n.category === nominee.category);
    const sorted = categoryNominees.sort((a, b) => b.votes - a.votes);
    return sorted.findIndex(n => n.id === nominee.id) + 1;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-purple-100 to-pink-100 rounded-full px-6 py-3 mb-6">
            <Heart className="w-5 h-5 mr-2 text-red-500" />
            <span className="text-sm font-semibold text-purple-800">Cast Your Vote</span>
          </div>
          <h1 className="text-6xl font-black text-gray-900 mb-6">
            Vote for Your 
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> Favorites</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Support the creators who inspire you most. Your vote helps recognize outstanding talent 
            and creativity in the digital space.
          </p>
        </div>

        {/* Voting Stats */}
        <div className="mb-12 bg-white rounded-3xl shadow-xl p-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="group hover:scale-105 transition-transform">
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-black text-gray-900 mb-2">
                {nominees.reduce((sum, nominee) => sum + nominee.votes, 0).toLocaleString()}
              </div>
              <div className="text-gray-600 font-semibold">Total Votes Cast</div>
            </div>
            <div className="group hover:scale-105 transition-transform">
              <div className="bg-gradient-to-br from-pink-400 to-red-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-black text-gray-900 mb-2">{nominees.length}</div>
              <div className="text-gray-600 font-semibold">Active Nominees</div>
            </div>
            <div className="group hover:scale-105 transition-transform">
              <div className="bg-gradient-to-br from-blue-400 to-purple-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-black text-gray-900 mb-2">{categories.length}</div>
              <div className="text-gray-600 font-semibold">Award Categories</div>
            </div>
            <div className="group hover:scale-105 transition-transform">
              <div className="bg-gradient-to-br from-green-400 to-teal-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform">
                <Check className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-black text-gray-900 mb-2">{userVotes.length}</div>
              <div className="text-gray-600 font-semibold">Your Votes</div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-8 py-4 rounded-full font-bold transition-all duration-300 ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl shadow-purple-500/25 scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200 hover:border-purple-300 hover:scale-105'
              }`}
            >
              All Categories
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-8 py-4 rounded-full font-bold transition-all duration-300 flex items-center ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl shadow-purple-500/25 scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200 hover:border-purple-300 hover:scale-105'
                }`}
              >
                {category.name}
                {hasVotedInCategory(category.id) && (
                  <Check className="w-5 h-5 ml-2" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Nominees Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNominees.map((nominee, index) => (
            <div key={nominee.id} className="group bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105">
              {/* Card Header */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={nominee.profileImage}
                  alt={nominee.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                
                {/* Rank Badge */}
                <div className="absolute top-4 left-4">
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-full font-bold text-sm flex items-center">
                    <Trophy className="w-4 h-4 mr-1" />
                    #{getRankPosition(nominee)}
                  </div>
                </div>
                
                {/* Vote Status */}
                {hasVotedForNominee(nominee.id) && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-green-500 text-white p-3 rounded-full shadow-lg">
                      <Check className="w-5 h-5" />
                    </div>
                  </div>
                )}
                
                {/* Profile Image Overlay */}
                <div className="absolute bottom-4 left-4">
                  <div className="w-20 h-20 rounded-full border-4 border-white shadow-lg overflow-hidden">
                    <img
                      src={nominee.profileImage}
                      alt={nominee.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              
              {/* Card Content */}
              <div className="p-8">
                <div className="mb-4">
                  <div className="inline-flex items-center bg-gradient-to-r from-purple-100 to-pink-100 rounded-full px-4 py-2 mb-3">
                    <Sparkles className="w-4 h-4 mr-2 text-purple-600" />
                    <span className="text-sm font-semibold text-purple-800">
                      {getCategoryName(nominee.category)}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">{nominee.name}</h3>
                  <p className="text-lg text-purple-600 font-semibold mb-4">{nominee.platform} Creator</p>
                </div>
                
                <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">{nominee.bio}</p>
                
                {/* Stats */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center bg-gray-50 px-4 py-2 rounded-full">
                    <Heart className="w-5 h-5 mr-2 text-red-500" />
                    <span className="font-bold text-gray-900">{nominee.votes.toLocaleString()}</span>
                    <span className="ml-1 text-gray-600">votes</span>
                  </div>
                  <div className="flex items-center text-yellow-500">
                    <Star className="w-5 h-5 mr-1" />
                    <span className="text-sm font-semibold text-gray-600">Top Nominee</span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleVote(nominee)}
                    disabled={hasVotedInCategory(nominee.category) || votingFor === nominee.id}
                    className={`flex-1 py-4 rounded-2xl font-bold transition-all duration-300 ${
                      hasVotedInCategory(nominee.category)
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : votingFor === nominee.id
                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                        : hasVotedForNominee(nominee.id)
                        ? 'bg-green-500 text-white shadow-lg'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 hover:shadow-2xl hover:shadow-purple-500/25 hover:scale-105'
                    }`}
                  >
                    {votingFor === nominee.id ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Voting...
                      </div>
                    ) : hasVotedForNominee(nominee.id) ? (
                      <div className="flex items-center justify-center">
                        <Check className="w-5 h-5 mr-2" />
                        Voted
                      </div>
                    ) : hasVotedInCategory(nominee.category) ? (
                      'Already Voted in Category'
                    ) : (
                      <div className="flex items-center justify-center">
                        <Heart className="w-5 h-5 mr-2" />
                        Vote Now
                      </div>
                    )}
                  </button>
                  
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-4 rounded-2xl transition-all duration-300 hover:scale-110">
                    <ExternalLink className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredNominees.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Star className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">No nominees found</h3>
            <p className="text-xl text-gray-600">
              {selectedCategory === 'all' 
                ? 'No nominees have been registered yet.'
                : 'No nominees found in this category.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};