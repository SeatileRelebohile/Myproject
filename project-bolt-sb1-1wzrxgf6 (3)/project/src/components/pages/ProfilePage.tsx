import React, { useState, useEffect } from 'react';
import { Edit, Save, X, Plus, DollarSign, Eye, Share2, Heart, Trophy, TrendingUp, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Nominee, PaymentRequest } from '../../types';
import { apiService } from '../../services/api';
import { Page } from '../../types';

interface ProfilePageProps {
  onPageChange: (page: Page) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onPageChange }) => {
  const { user, isAuthenticated } = useAuth();
  const [nominee, setNominee] = useState<Nominee | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Nominee>>({});
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDescription, setPaymentDescription] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      onPageChange('login');
      return;
    }
    
    loadNomineeData();
    loadPaymentRequests();
  }, [isAuthenticated, user]);

  const loadNomineeData = async () => {
    if (!user?.nomineeId) return;
    
    try {
      const response = await apiService.getNomineeById(user.nomineeId);
      if (response.success) {
        setNominee(response.data);
        setEditData(response.data);
      }
    } catch (error) {
      console.error('Failed to load nominee data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPaymentRequests = async () => {
    try {
      const response = await apiService.getPaymentRequests();
      if (response.success) {
        setPaymentRequests(response.data);
      }
    } catch (error) {
      console.error('Failed to load payment requests:', error);
    }
  };

  const handleSave = async () => {
    if (!nominee) return;
    
    try {
      const response = await apiService.updateNominee(nominee.id, editData);
      if (response.success) {
        setNominee(response.data);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handlePaymentRequest = async () => {
    try {
      const response = await apiService.requestPayment(
        parseFloat(paymentAmount),
        paymentDescription
      );
      
      if (response.success) {
        setPaymentRequests([...paymentRequests, response.data]);
        setShowPaymentModal(false);
        setPaymentAmount('');
        setPaymentDescription('');
      }
    } catch (error) {
      console.error('Failed to submit payment request:', error);
    }
  };

  const copyShareableLink = () => {
    if (nominee) {
      const link = `${window.location.origin}/nominee/${nominee.shareableLink}`;
      navigator.clipboard.writeText(link);
      // You could add a toast notification here
    }
  };

  if (!isAuthenticated) {
    return null;
  }

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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h2>
          <p className="text-gray-600 mb-6">Your nominee profile could not be loaded.</p>
          <button
            onClick={() => onPageChange('register')}
            className="bg-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors"
          >
            Register as Nominee
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
          <div className="relative h-48 bg-gradient-to-r from-purple-600 to-pink-600">
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            <div className="absolute bottom-6 left-6 flex items-end space-x-6">
              <img
                src={nominee.profileImage}
                alt={nominee.name}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
              />
              <div className="text-white pb-2">
                <h1 className="text-4xl font-black mb-2">{nominee.name}</h1>
                <p className="text-xl opacity-90">{nominee.platform} Creator</p>
                <div className="flex items-center mt-2">
                  <Heart className="w-5 h-5 mr-2 text-red-400" />
                  <span className="font-bold">{nominee.votes.toLocaleString()} votes</span>
                </div>
              </div>
            </div>
            <div className="absolute top-6 right-6">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-white bg-opacity-20 backdrop-blur-sm text-white px-6 py-3 rounded-full font-semibold hover:bg-opacity-30 transition-all duration-300 flex items-center"
              >
                {isEditing ? <X className="w-5 h-5 mr-2" /> : <Edit className="w-5 h-5 mr-2" />}
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Information */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>
              
              {isEditing ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <textarea
                      value={editData.bio || ''}
                      onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    />
                  </div>
                  
                  <div className="flex space-x-4">
                    <button
                      onClick={handleSave}
                      className="bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition-colors flex items-center"
                    >
                      <Save className="w-5 h-5 mr-2" />
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-300 text-gray-700 px-6 py-3 rounded-full font-semibold hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 leading-relaxed mb-6">{nominee.bio}</p>
                  
                  {/* Social Links */}
                  {nominee.socialLinks && nominee.socialLinks.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media</h3>
                      <div className="flex flex-wrap gap-3">
                        {nominee.socialLinks.map((link) => (
                          <a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full text-sm font-semibold text-gray-700 transition-colors"
                          >
                            {link.platform}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Payment Requests */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Payment Requests</h2>
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition-colors flex items-center"
                >
                  <DollarSign className="w-5 h-5 mr-2" />
                  Request Payment
                </button>
              </div>
              
              {paymentRequests.length > 0 ? (
                <div className="space-y-4">
                  {paymentRequests.map((request) => (
                    <div key={request.id} className="border border-gray-200 rounded-2xl p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">${request.amount}</h3>
                          <p className="text-gray-600">{request.description}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                          request.status === 'approved' ? 'bg-green-100 text-green-800' :
                          request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No payment requests yet</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Stats */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Stats</h2>
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
                  <div className="bg-yellow-100 p-3 rounded-2xl mr-4">
                    <Trophy className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">#{Math.floor(Math.random() * 10) + 1}</div>
                    <div className="text-gray-600">Category Rank</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-2xl mr-4">
                    <Eye className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{nominee.isVisible ? 'Visible' : 'Hidden'}</div>
                    <div className="text-gray-600">Profile Status</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Shareable Link */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Share Your Profile</h2>
              <div className="bg-gray-50 p-4 rounded-2xl mb-4">
                <code className="text-sm text-purple-600 break-all">
                  {window.location.origin}/nominee/{nominee.shareableLink}
                </code>
              </div>
              <button
                onClick={copyShareableLink}
                className="w-full bg-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Copy Link
              </button>
              <p className="text-sm text-gray-500 mt-3 text-center">
                Share this link with your fans to get votes!
              </p>
            </div>

            {/* Visibility Notice */}
            {!nominee.isVisible && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-3xl p-6">
                <div className="flex items-center mb-3">
                  <Eye className="w-6 h-6 text-yellow-600 mr-3" />
                  <h3 className="font-bold text-yellow-800">Profile Hidden</h3>
                </div>
                <p className="text-yellow-700 text-sm">
                  Your profile needs at least 20 votes to appear on the main website. 
                  Share your link to collect votes!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Request Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Request Payment</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount ($)</label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={paymentDescription}
                  onChange={(e) => setPaymentDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  placeholder="Describe what this payment is for..."
                />
              </div>
            </div>
            
            <div className="flex space-x-4 mt-6">
              <button
                onClick={handlePaymentRequest}
                className="flex-1 bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition-colors"
              >
                Submit Request
              </button>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 px-6 py-3 rounded-full font-semibold hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};