import React, { useState } from 'react';
import { Upload, Check, AlertCircle, Plus, X, Eye, EyeOff, Facebook, Instagram, Twitter, Youtube, Music, Globe } from 'lucide-react';
import { Nominee, SocialLink } from '../../types';
import { apiService } from '../../services/api';

interface RegisterPageProps {
  onRegister: (nominee: Omit<Nominee, 'id' | 'votes'>) => void;
}

const socialPlatforms = [
  { name: 'Facebook', icon: Facebook, color: 'text-blue-600' },
  { name: 'Instagram', icon: Instagram, color: 'text-pink-600' },
  { name: 'Twitter', icon: Twitter, color: 'text-blue-400' },
  { name: 'YouTube', icon: Youtube, color: 'text-red-600' },
  { name: 'TikTok', icon: Music, color: 'text-black' },
  { name: 'Website', icon: Globe, color: 'text-gray-600' }
];

export const RegisterPage: React.FC<RegisterPageProps> = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    platform: '',
    profileLink: '',
    profileImage: '',
    bio: '',
    category: ''
  });
  const [socialLinks, setSocialLinks] = useState<Omit<SocialLink, 'id'>[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadingImage, setUploadingImage] = useState(false);

  const platforms = [
    'Facebook',
    'TikTok',
    'Instagram',
    'Twitter',
    'YouTube',
    'Other'
  ];

  const categories = [
    { id: 'facebook', name: 'Facebook Account of the Year' },
    { id: 'tiktok', name: 'TikTok Creator of the Year' },
    { id: 'instagram', name: 'Instagram Star of the Year' },
    { id: 'twitter', name: 'Twitter Personality of the Year' },
    { id: 'youtube', name: 'YouTube Channel of the Year' },
    { id: 'rising-star', name: 'Rising Star' }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.platform) newErrors.platform = 'Platform is required';
    if (!formData.profileLink.trim()) newErrors.profileLink = 'Profile link is required';
    if (!formData.bio.trim()) newErrors.bio = 'Bio is required';
    if (!formData.category) newErrors.category = 'Category is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const response = await apiService.uploadImage(file);
      if (response.success) {
        setFormData(prev => ({ ...prev, profileImage: response.data.url }));
      }
    } catch (error) {
      console.error('Image upload failed:', error);
    } finally {
      setUploadingImage(false);
    }
  };

  const addSocialLink = () => {
    if (socialLinks.length < 5) {
      setSocialLinks([...socialLinks, { platform: '', url: '', icon: '' }]);
    }
  };

  const removeSocialLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  const updateSocialLink = (index: number, field: string, value: string) => {
    const updated = [...socialLinks];
    updated[index] = { ...updated[index], [field]: value };
    
    if (field === 'platform') {
      const platform = socialPlatforms.find(p => p.name === value);
      updated[index].icon = platform?.name || '';
    }
    
    setSocialLinks(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const nominee = {
        ...formData,
        profileImage: formData.profileImage || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
        socialLinks: socialLinks.map((link, index) => ({ ...link, id: `social-${index}` })),
        isVisible: false,
        shareableLink: `nominee-${Date.now()}`,
        paymentRequests: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const response = await apiService.register(nominee);
      
      if (response.success) {
        onRegister(nominee);
        setIsSubmitted(true);
      } else {
        setErrors({ submit: response.message || 'Registration failed' });
      }
    } catch (error) {
      setErrors({ submit: 'Registration failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4">Registration Successful!</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Thank you for registering! Your nomination has been submitted. You'll need at least 20 votes 
            to appear on the main website. Share your unique link with fans to start collecting votes!
          </p>
          <div className="bg-gray-50 p-4 rounded-2xl mb-6">
            <p className="text-sm text-gray-600 mb-2">Your shareable link:</p>
            <code className="text-purple-600 font-mono text-sm break-all">
              {window.location.origin}/nominee/{formData.email.replace('@', '-').replace('.', '-')}
            </code>
          </div>
          <button
            onClick={() => {
              setIsSubmitted(false);
              setFormData({
                name: '',
                email: '',
                password: '',
                confirmPassword: '',
                platform: '',
                profileLink: '',
                profileImage: '',
                bio: '',
                category: ''
              });
              setSocialLinks([]);
            }}
            className="bg-gradient-to-r from-yellow-500 to-red-500 text-white px-8 py-3 rounded-full font-semibold hover:from-yellow-600 hover:to-red-600 transition-all duration-300"
          >
            Register Another Nominee
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-gray-900 mb-6">Register as Nominee</h1>
          <p className="text-xl text-gray-600">
            Submit your nomination for Creator Awards 2024. Showcase your creative work and compete for recognition!
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your email address"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors pr-12 ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors pr-12 ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Image Upload */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Profile Image</h3>
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <img
                    src={formData.profileImage || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400'}
                    alt="Profile preview"
                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                  />
                  {uploadingImage && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block">
                    <span className="sr-only">Choose profile photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                    />
                  </label>
                  <p className="text-sm text-gray-500 mt-2">
                    Upload a high-quality image (JPG, PNG). Max size: 5MB
                  </p>
                </div>
              </div>
            </div>

            {/* Platform Information */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Platform Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="platform" className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Platform *
                  </label>
                  <select
                    id="platform"
                    name="platform"
                    value={formData.platform}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                      errors.platform ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select platform</option>
                    {platforms.map(platform => (
                      <option key={platform} value={platform}>{platform}</option>
                    ))}
                  </select>
                  {errors.platform && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.platform}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Award Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                      errors.category ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.category}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="profileLink" className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Profile Link *
                </label>
                <input
                  type="url"
                  id="profileLink"
                  name="profileLink"
                  value={formData.profileLink}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                    errors.profileLink ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="https://..."
                />
                {errors.profileLink && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.profileLink}
                  </p>
                )}
              </div>
            </div>

            {/* Social Media Links */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Social Media Links</h3>
                <button
                  type="button"
                  onClick={addSocialLink}
                  disabled={socialLinks.length >= 5}
                  className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold hover:bg-purple-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Link ({socialLinks.length}/5)
                </button>
              </div>
              
              <div className="space-y-4">
                {socialLinks.map((link, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl">
                    <select
                      value={link.platform}
                      onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Select platform</option>
                      {socialPlatforms.map(platform => (
                        <option key={platform.name} value={platform.name}>{platform.name}</option>
                      ))}
                    </select>
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                      placeholder="https://..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => removeSocialLink(index)}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                Short Bio *
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-none ${
                  errors.bio ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Tell us about yourself and your content..."
              />
              {errors.bio && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.bio}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              {errors.submit && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                  <span className="text-red-700">{errors.submit}</span>
                </div>
              )}
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl text-lg font-bold transition-all duration-300 ${
                  isSubmitting
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:from-purple-700 hover:to-pink-700 hover:shadow-2xl hover:shadow-purple-500/25 hover:scale-105'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Submitting Registration...
                  </div>
                ) : (
                  'Submit Registration'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};