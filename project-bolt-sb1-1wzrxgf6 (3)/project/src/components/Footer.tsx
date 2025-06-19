import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Mail, Award, Heart, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white py-16 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl blur-lg opacity-50"></div>
                <div className="relative bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-2xl">
                  <Award className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <span className="text-2xl font-black">Creator Awards</span>
                <div className="flex items-center">
                  <Sparkles className="w-4 h-4 text-yellow-400 mr-1" />
                  <span className="text-sm font-semibold opacity-80">2024</span>
                </div>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Celebrating digital creativity and recognizing the voices that shape our online world. 
              Join us in honoring the creators who inspire millions.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="group bg-white bg-opacity-10 hover:bg-opacity-20 p-3 rounded-2xl transition-all duration-300 hover:scale-110">
                <Facebook className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
              </a>
              <a href="#" className="group bg-white bg-opacity-10 hover:bg-opacity-20 p-3 rounded-2xl transition-all duration-300 hover:scale-110">
                <Twitter className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
              </a>
              <a href="#" className="group bg-white bg-opacity-10 hover:bg-opacity-20 p-3 rounded-2xl transition-all duration-300 hover:scale-110">
                <Instagram className="w-5 h-5 group-hover:text-pink-400 transition-colors" />
              </a>
              <a href="#" className="group bg-white bg-opacity-10 hover:bg-opacity-20 p-3 rounded-2xl transition-all duration-300 hover:scale-110">
                <Youtube className="w-5 h-5 group-hover:text-red-400 transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-black mb-6 flex items-center">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors hover:translate-x-2 transform duration-300 block">Home</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors hover:translate-x-2 transform duration-300 block">Categories</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors hover:translate-x-2 transform duration-300 block">How It Works</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors hover:translate-x-2 transform duration-300 block">Results</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors hover:translate-x-2 transform duration-300 block">Register</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xl font-black mb-6 flex items-center">
              <div className="w-2 h-2 bg-pink-400 rounded-full mr-3"></div>
              Support
            </h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors hover:translate-x-2 transform duration-300 block">FAQ</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors hover:translate-x-2 transform duration-300 block">Contact Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors hover:translate-x-2 transform duration-300 block">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors hover:translate-x-2 transform duration-300 block">Terms of Service</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors hover:translate-x-2 transform duration-300 block">Community Guidelines</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-black mb-6 flex items-center">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
              Contact
            </h3>
            <div className="space-y-4">
              <div className="flex items-center text-gray-300">
                <div className="bg-white bg-opacity-10 p-2 rounded-lg mr-3">
                  <Mail className="w-4 h-4" />
                </div>
                <span>hello@creatorawards.com</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                For partnerships, press inquiries, or general questions about Creator Awards. 
                We'd love to hear from you!
              </p>
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-2xl">
                <div className="flex items-center mb-2">
                  <Heart className="w-5 h-5 text-white mr-2" />
                  <span className="font-bold text-white">Join Our Community</span>
                </div>
                <p className="text-white text-sm opacity-90">
                  Stay updated with the latest news and announcements
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-center md:text-left">
              © 2024 Creator Awards. All rights reserved. Celebrating digital creativity worldwide.
            </p>
            <div className="flex items-center mt-4 md:mt-0">
              <span className="text-gray-400 text-sm mr-4">Made with</span>
              <Heart className="w-4 h-4 text-red-500 mr-4" />
              <span className="text-gray-400 text-sm">for creators everywhere</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};