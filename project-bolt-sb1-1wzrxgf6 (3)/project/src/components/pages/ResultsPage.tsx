import React, { useState } from 'react';
import { Trophy, Medal, Award, TrendingUp, Users, Star, Crown, Sparkles, ExternalLink, Heart } from 'lucide-react';
import { Nominee } from '../../types';
import { categories } from '../../data/mockData';

interface ResultsPageProps {
  nominees: Nominee[];
}

export const ResultsPage: React.FC<ResultsPageProps> = ({ nominees }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const getTopNominees = (categoryId: string, limit: number = 10) => {
    const filtered = categoryId === 'all' 
      ? nominees 
      : nominees.filter(nominee => nominee.category === categoryId);
    
    return filtered.sort((a, b) => b.votes - a.votes).slice(0, limit);
  };

  const totalVotes = nominees.reduce((sum, nominee) => sum + nominee.votes, 0);
  const topNominees = getTopNominees(selectedCategory);
  const overallWinner = nominees.sort((a, b) => b.votes - a.votes)[0];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-8 h-8 text-yellow-500" />;
      case 2:
        return <Medal className="w-8 h-8 text-gray-400" />;
      case 3:
        return <Award className="w-8 h-8 text-amber-600" />;
      default:
        return (
          <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold text-sm">
            {rank}
          </div>
        );
    }
  };

  const getVotePercentage = (votes: number) => {
    if (selectedCategory === 'all') {
      return ((votes / totalVotes) * 100).toFixed(1);
    } else {
      const categoryNominees = nominees.filter(nominee => nominee.category === selectedCategory);
      const categoryTotal = categoryNominees.reduce((sum, nominee) => sum + nominee.votes, 0);
      return categoryTotal > 0 ? ((votes / categoryTotal) * 100).toFixed(1) : '0';
    }
  };

  const getCategoryWinners = () => {
    return categories.map(category => {
      const categoryNominees = nominees.filter(nominee => nominee.category === category.id);
      const winner = categoryNominees.sort((a, b) => b.votes - a.votes)[0];
      return { category, winner };
    }).filter(item => item.winner);
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500 to-orange-500';
      case 2:
        return 'bg-gradient-to-r from-gray-400 to-gray-500';
      case 3:
        return 'bg-gradient-to-r from-amber-600 to-yellow-600';
      default:
        return 'bg-gradient-to-r from-purple-500 to-pink-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full px-6 py-3 mb-6">
            <TrendingUp className="w-5 h-5 mr-2 text-orange-600" />
            <span className="text-sm font-semibold text-orange-800">Live Results</span>
          </div>
          <h1 className="text-6xl font-black text-gray-900 mb-6">
            Real-Time 
            <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent"> Leaderboard</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Watch the competition unfold in real-time. Results update instantly as votes pour in 
            from fans around the world.
          </p>
        </div>

        {/* Overall Stats */}
        <div className="mb-16 bg-white rounded-3xl shadow-xl p-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="group hover:scale-105 transition-transform">
              <div className="bg-gradient-to-br from-blue-400 to-purple-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-black text-gray-900 mb-2">
                {totalVotes.toLocaleString()}
              </div>
              <div className="text-gray-600 font-semibold">Total Votes</div>
            </div>
            <div className="group hover:scale-105 transition-transform">
              <div className="bg-gradient-to-br from-green-400 to-teal-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-black text-gray-900 mb-2">{nominees.length}</div>
              <div className="text-gray-600 font-semibold">Nominees</div>
            </div>
            <div className="group hover:scale-105 transition-transform">
              <div className="bg-gradient-to-br from-pink-400 to-red-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-black text-gray-900 mb-2">{categories.length}</div>
              <div className="text-gray-600 font-semibold">Categories</div>
            </div>
            <div className="group hover:scale-105 transition-transform">
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform">
                <Star className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-black text-gray-900 mb-2">
                {Math.round(totalVotes / nominees.length)}
              </div>
              <div className="text-gray-600 font-semibold">Avg. Votes</div>
            </div>
          </div>
        </div>

        {/* Overall Winner Highlight */}
        {overallWinner && (
          <div className="mb-16 relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500"></div>
            <div className="relative p-12 text-white">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-white rounded-full blur-lg opacity-30"></div>
                    <img
                      src={overallWinner.profileImage}
                      alt={overallWinner.name}
                      className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-full object-cover border-4 border-white shadow-2xl"
                    />
                    <div className="absolute -top-4 -right-4 bg-white text-orange-500 w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
                      <Crown className="w-8 h-8" />
                    </div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start mb-4">
                      <Sparkles className="w-6 h-6 mr-2" />
                      <span className="text-xl font-bold">Current Overall Leader</span>
                    </div>
                    <h3 className="text-4xl lg:text-5xl font-black mb-4">{overallWinner.name}</h3>
                    <p className="text-xl lg:text-2xl opacity-90 mb-2">{overallWinner.platform} Creator</p>
                    <p className="text-lg opacity-80 max-w-2xl">{overallWinner.bio}</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-5xl lg:text-6xl font-black mb-2">
                    {overallWinner.votes.toLocaleString()}
                  </div>
                  <div className="text-xl opacity-90">votes</div>
                  <div className="mt-4 bg-white bg-opacity-20 backdrop-blur-sm px-6 py-3 rounded-full">
                    <span className="font-bold">Leading by {(overallWinner.votes - (nominees.sort((a, b) => b.votes - a.votes)[1]?.votes || 0)).toLocaleString()} votes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category Winners Grid */}
        <div className="mb-16">
          <h2 className="text-4xl font-black text-gray-900 mb-12 text-center">Category Champions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {getCategoryWinners().map(({ category, winner }) => (
              <div key={category.id} className="group bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-br from-yellow-500 to-orange-500 w-16 h-16 rounded-2xl flex items-center justify-center text-white mr-4 group-hover:rotate-12 transition-transform">
                    <Crown className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 text-lg">{category.name}</h3>
                    <p className="text-sm text-gray-600">Current Champion</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <img
                    src={winner.profileImage}
                    alt={winner.name}
                    className="w-16 h-16 rounded-full object-cover border-3 border-yellow-400"
                  />
                  <div className="flex-1">
                    <div className="font-bold text-gray-900 text-lg">{winner.name}</div>
                    <div className="text-gray-600">{winner.platform}</div>
                    <div className="flex items-center mt-2">
                      <Heart className="w-4 h-4 text-red-500 mr-1" />
                      <span className="font-bold text-gray-900">{winner.votes.toLocaleString()}</span>
                      <span className="text-gray-600 ml-1">votes</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
                className={`px-8 py-4 rounded-full font-bold transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl shadow-purple-500/25 scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200 hover:border-purple-300 hover:scale-105'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-6 text-white">
            <h2 className="text-3xl font-black">
              {selectedCategory === 'all' ? 'Overall Leaderboard' : 
               categories.find(cat => cat.id === selectedCategory)?.name + ' Rankings'}
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {topNominees.map((nominee, index) => (
              <div key={nominee.id} className="p-8 hover:bg-gray-50 transition-colors group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4">
                      <div className={`${getRankBadgeColor(index + 1)} w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg`}>
                        {index + 1}
                      </div>
                      {getRankIcon(index + 1)}
                    </div>
                    <div className="relative">
                      <img
                        src={nominee.profileImage}
                        alt={nominee.name}
                        className="w-20 h-20 rounded-2xl object-cover border-3 border-gray-200 group-hover:border-purple-300 transition-colors"
                      />
                      {index < 3 && (
                        <div className="absolute -top-2 -right-2 bg-yellow-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                          <Crown className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-black text-gray-900 mb-1">{nominee.name}</h3>
                      <p className="text-purple-600 font-semibold mb-2">{nominee.platform} Creator</p>
                      <p className="text-gray-600 text-sm line-clamp-2 max-w-md">{nominee.bio}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-gray-900 mb-2">
                      {nominee.votes.toLocaleString()}
                    </div>
                    <div className="text-gray-600 mb-4 font-semibold">votes</div>
                    <div className="bg-gray-200 rounded-full h-3 w-32 mb-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, parseFloat(getVotePercentage(nominee.votes)))}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-gray-500 font-semibold">
                      {getVotePercentage(nominee.votes)}% of votes
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {topNominees.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">No results yet</h3>
            <p className="text-xl text-gray-600">
              {selectedCategory === 'all' 
                ? 'No votes have been cast yet.'
                : 'No votes in this category yet.'}
            </p>
          </div>
        )}

        {/* Live Update Notice */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-3xl p-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
            <span className="text-blue-800 font-black text-lg">Live Results</span>
          </div>
          <p className="text-blue-700 text-lg">
            Results update in real-time as votes are cast. Rankings may change frequently during active voting periods.
          </p>
        </div>
      </div>
    </div>
  );
};