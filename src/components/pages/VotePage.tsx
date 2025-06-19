import React, { useState, useEffect } from 'react';
import { Heart, Star, Trophy, DollarSign, User, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { PayPalButton } from '../PayPalButton';

interface Nominee {
  id: number;
  username: string;
  bio: string;
  profile_picture: string;
  category: string;
  total_votes: number;
  creator_name: string;
  social_links: any[];
}

interface VotePageProps {
  nomineeId?: number;
  category?: string;
}

export const VotePage: React.FC<VotePageProps> = ({ nomineeId, category }) => {
  const [nominees, setNominees] = useState<Nominee[]>([]);
  const [selectedNominee, setSelectedNominee] = useState<Nominee | null>(null);
  const [voterName, setVoterName] = useState('');
  const [voterEmail, setVoterEmail] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    loadNominees();
  }, [category]);

  const loadNominees = async () => {
    try {
      const endpoint = category 
        ? `/api/nominees/category/${category}`
        : '/api/nominees/categories';
      
      const response = await fetch(`http://localhost:3001${endpoint}`);
      const data = await response.json();
      
      if (data.success) {
        if (category) {
          setNominees(data.data);
        } else {
          // Flatten nominees from all categories
          const allNominees = data.data.flatMap((cat: any) => cat.top_nominees);
          setNominees(allNominees);
        }
        
        if (nomineeId) {
          const nominee = data.data.find((n: Nominee) => n.id === nomineeId);
          setSelectedNominee(nominee || null);
        }
      }
    } catch (error) {
      console.error('Failed to load nominees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVoteClick = (nominee: Nominee) => {
    setSelectedNominee(nominee);
    setShowPayment(true);
  };

  const handlePaymentSuccess = async (details: any) => {
    try {
      const response = await fetch('http://localhost:3001/api/votes/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: details.id,
          nominee_id: selectedNominee?.id,
          voter_name: voterName,
          voter_email: voterEmail
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setPaymentSuccess(true);
        setShowPayment(false);
        // Update nominee vote count locally
        if (selectedNominee) {
          setNominees(prev => prev.map(n => 
            n.id === selectedNominee.id 
              ? { ...n, total_votes: n.total_votes + 1 }
              : n
          ));
        }
      }
    } catch (error) {
      console.error('Payment processing failed:', error);
    }
  };

  const handlePaymentError = (error: any) => {
    console.error('Payment error:', error);
    alert('Payment failed. Please try again.');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4">Vote Successful!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for voting for {selectedNominee?.username}! Your $5 vote has been recorded.
          </p>
          <button
            onClick={() => {
              setPaymentSuccess(false);
              setSelectedNominee(null);
              setShowPayment(false);
              setVoterName('');
              setVoterEmail('');
            }}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-3 rounded-full font-bold hover:from-yellow-600 hover:to-orange-600 transition-all duration-300"
          >
            Vote for Another Creator
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full px-6 py-3 mb-6">
            <DollarSign className="w-5 h-5 mr-2 text-orange-600" />
            <span className="text-sm font-semibold text-orange-800">$5 Per Vote</span>
          </div>
          <h1 className="text-6xl font-black text-gray-900 mb-6">
            Vote with 
            <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent"> PayPal</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Support your favorite creators with a $5 vote. Every vote counts towards their success 
            and helps them earn milestone bonuses!
          </p>
        </div>

        {/* Payment Modal */}
        {showPayment && selectedNominee && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full">
              <div className="text-center mb-6">
                <img
                  src={selectedNominee.profile_picture}
                  alt={selectedNominee.username}
                  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Vote for {selectedNominee.username}
                </h3>
                <p className="text-gray-600">Category: {selectedNominee.category}</p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mt-4">
                  <div className="flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-yellow-600 mr-2" />
                    <span className="text-2xl font-bold text-yellow-800">$5.00</span>
                  </div>
                  <p className="text-sm text-yellow-700 mt-1">Per Vote</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={voterName}
                      onChange={(e) => setVoterName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={voterEmail}
                      onChange={(e) => setVoterEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Optional: To track your votes and receive updates
                  </p>
                </div>
              </div>

              {voterName.trim() && (
                <div className="mb-6">
                  <PayPalButton
                    amount="5.00"
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                    onCancel={() => setShowPayment(false)}
                  />
                </div>
              )}

              <button
                onClick={() => setShowPayment(false)}
                className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-2xl font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Nominees Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {nominees.map((nominee) => (
            <div key={nominee.id} className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="relative h-48">
                <img
                  src={nominee.profile_picture}
                  alt={nominee.username}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-full font-bold text-sm flex items-center">
                    <Trophy className="w-4 h-4 mr-1" />
                    {nominee.total_votes} votes
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="mb-4">
                  <h3 className="text-2xl font-black text-gray-900 mb-2">{nominee.username}</h3>
                  <p className="text-lg text-yellow-600 font-semibold mb-2">{nominee.category}</p>
                  <p className="text-gray-600 mb-4">by {nominee.creator_name}</p>
                </div>

                <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">{nominee.bio}</p>

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center bg-gray-50 px-4 py-2 rounded-full">
                    <Heart className="w-5 h-5 mr-2 text-red-500" />
                    <span className="font-bold text-gray-900">{nominee.total_votes}</span>
                    <span className="ml-1 text-gray-600">votes</span>
                  </div>
                  <div className="flex items-center text-yellow-500">
                    <Star className="w-5 h-5 mr-1" />
                    <span className="text-sm font-semibold text-gray-600">Featured</span>
                  </div>
                </div>

                <button
                  onClick={() => handleVoteClick(nominee)}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-4 rounded-2xl font-bold hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 hover:scale-105 flex items-center justify-center"
                >
                  <DollarSign className="w-5 h-5 mr-2" />
                  Vote for $5
                </button>
              </div>
            </div>
          ))}
        </div>

        {nominees.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">No nominees found</h3>
            <p className="text-xl text-gray-600">
              No nominees have reached the main board yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};