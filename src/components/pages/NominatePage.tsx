import React, { useState } from 'react';
import { Upload, DollarSign, Star, CheckCircle, AlertCircle, Plus, X } from 'lucide-react';
import { PayPalButton } from '../PayPalButton';

interface SocialLink {
  platform: string;
  url: string;
}

export const NominatePage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    category: '',
    username: '',
    bio: '',
    profile_picture: '',
    paypal_email: '',
    is_paid_nominee: false
  });
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: 'facebook', name: 'Facebook Account of the Year', icon: '📘' },
    { id: 'instagram', name: 'Instagram Star of the Year', icon: '📷' },
    { id: 'twitter', name: 'Twitter Personality of the Year', icon: '🐦' },
    { id: 'tiktok', name: 'TikTok Creator of the Year', icon: '🎵' },
    { id: 'youtube', name: 'YouTube Channel of the Year', icon: '📺' },
    { id: 'linkedin', name: 'LinkedIn Professional of the Year', icon: '💼' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const addSocialLink = () => {
    setSocialLinks([...socialLinks, { platform: '', url: '' }]);
  };

  const updateSocialLink = (index: number, field: string, value: string) => {
    const updated = [...socialLinks];
    updated[index] = { ...updated[index], [field]: value };
    setSocialLinks(updated);
  };

  const removeSocialLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  const handleSubmitFree = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:3001/api/nominees/nominate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          social_links: socialLinks,
          is_paid_nominee: false
        })
      });

      const data = await response.json();
      if (data.success) {
        setStep(5); // Success step
      } else {
        alert(data.message || 'Nomination failed');
      }
    } catch (error) {
      console.error('Nomination error:', error);
      alert('Nomination failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (details: any) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:3001/api/nominees/nominate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          social_links: socialLinks,
          is_paid_nominee: true,
          paypal_transaction_id: details.id
        })
      });

      const data = await response.json();
      if (data.success) {
        setPaymentSuccess(true);
        setStep(5); // Success step
      } else {
        alert(data.message || 'Nomination failed');
      }
    } catch (error) {
      console.error('Nomination error:', error);
      alert('Nomination failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-black text-gray-900 mb-4">Choose Your Category</h2>
              <p className="text-gray-600">Select the category that best represents your content</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setFormData(prev => ({ ...prev, category: category.id }))}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                    formData.category === category.id
                      ? 'border-yellow-500 bg-yellow-50'
                      : 'border-gray-200 hover:border-yellow-300'
                  }`}
                >
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="font-bold text-gray-900 mb-2">{category.name}</h3>
                </button>
              ))}
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => setStep(2)}
                disabled={!formData.category}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-2xl font-bold hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-black text-gray-900 mb-4">Profile Information</h2>
              <p className="text-gray-600">Tell us about yourself and your content</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username/Channel Name</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Your username or channel name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                  placeholder="Tell us about your content and what makes you unique..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture URL</label>
                <input
                  type="url"
                  name="profile_picture"
                  value={formData.profile_picture}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="https://example.com/your-photo.jpg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">PayPal Email (for earnings)</label>
                <input
                  type="email"
                  name="paypal_email"
                  value={formData.paypal_email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="your@paypal.com"
                  required
                />
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="bg-gray-200 text-gray-700 px-8 py-4 rounded-2xl font-bold hover:bg-gray-300 transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!formData.username || !formData.bio || !formData.profile_picture || !formData.paypal_email}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-2xl font-bold hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-black text-gray-900 mb-4">Social Media Links</h2>
              <p className="text-gray-600">Add your social media profiles (optional)</p>
            </div>

            <div className="space-y-4">
              {socialLinks.map((link, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl">
                  <select
                    value={link.platform}
                    onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    <option value="">Select platform</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Twitter">Twitter</option>
                    <option value="TikTok">TikTok</option>
                    <option value="YouTube">YouTube</option>
                    <option value="LinkedIn">LinkedIn</option>
                  </select>
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                    placeholder="https://..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => removeSocialLink(index)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}

              <button
                onClick={addSocialLink}
                className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-2xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Social Link
              </button>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="bg-gray-200 text-gray-700 px-8 py-4 rounded-2xl font-bold hover:bg-gray-300 transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-2xl font-bold hover:from-yellow-600 hover:to-orange-600 transition-all duration-300"
              >
                Continue
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-black text-gray-900 mb-4">Choose Your Plan</h2>
              <p className="text-gray-600">Select how you want to participate in the awards</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Free Plan */}
              <div className="bg-white border-2 border-gray-200 rounded-3xl p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Free Nominee</h3>
                  <div className="text-4xl font-black text-gray-900 mb-2">$0</div>
                  <p className="text-gray-600">Basic nomination</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Listed in category</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Receive votes</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Shareable profile link</span>
                  </li>
                  <li className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-yellow-500 mr-3" />
                    <span>Need 100 votes for main board</span>
                  </li>
                </ul>

                <button
                  onClick={handleSubmitFree}
                  disabled={loading}
                  className="w-full bg-gray-600 text-white py-4 rounded-2xl font-bold hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit Free Nomination'}
                </button>
              </div>

              {/* Paid Plan */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-3xl p-8 relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold">
                    RECOMMENDED
                  </div>
                </div>
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Paid Nominee</h3>
                  <div className="text-4xl font-black text-gray-900 mb-2">$30</div>
                  <p className="text-gray-600">Premium nomination</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Instant main board listing</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Featured placement</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Priority in search results</span>
                  </li>
                  <li className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-500 mr-3" />
                    <span>Premium badge</span>
                  </li>
                </ul>

                <div className="space-y-4">
                  <PayPalButton
                    amount="30.00"
                    onSuccess={handlePaymentSuccess}
                    onError={(error) => {
                      console.error('Payment error:', error);
                      alert('Payment failed. Please try again.');
                    }}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => setStep(3)}
                className="bg-gray-200 text-gray-700 px-8 py-4 rounded-2xl font-bold hover:bg-gray-300 transition-colors"
              >
                Back
              </button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="text-center space-y-8">
            <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            
            <div>
              <h2 className="text-4xl font-black text-gray-900 mb-4">
                {paymentSuccess ? 'Premium Nomination Successful!' : 'Nomination Submitted!'}
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {paymentSuccess 
                  ? 'Your premium nomination has been processed and you\'re now featured on the main board!'
                  : 'Your free nomination has been submitted. You\'ll need 100 votes to appear on the main board.'
                }
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 max-w-md mx-auto">
              <h3 className="font-bold text-gray-900 mb-2">What's Next?</h3>
              <ul className="text-left space-y-2 text-gray-600">
                <li>• Share your profile link with fans</li>
                <li>• Encourage votes on social media</li>
                <li>• Track your progress in the dashboard</li>
                <li>• Earn milestone bonuses as you grow</li>
              </ul>
            </div>

            <button
              onClick={() => window.location.href = '/dashboard'}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-2xl font-bold hover:from-yellow-600 hover:to-orange-600 transition-all duration-300"
            >
              Go to Dashboard
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3, 4, 5].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= stepNumber
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {stepNumber}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};