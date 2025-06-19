import React from 'react';
import { UserPlus, Vote, Trophy, Star, Award, Users, Calendar, CheckCircle } from 'lucide-react';
import { Page } from '../../types';

interface HowItWorksPageProps {
  onPageChange: (page: Page) => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onPageChange }) => {
  const steps = [
    {
      icon: UserPlus,
      title: 'Nominees Register',
      description: 'Content creators register themselves with their social media profiles, showcase their work, and provide information about their creative journey.',
      details: [
        'Fill out registration form with personal details',
        'Link to social media profiles',
        'Upload profile picture and bio',
        'Choose appropriate award category'
      ]
    },
    {
      icon: Vote,
      title: 'Fans Vote',
      description: 'Fans and followers vote for their favorite creators in different categories to show their support and appreciation.',
      details: [
        'Browse nominees by category',
        'Vote once per category',
        'See real-time voting results',
        'Share nominees with friends'
      ]
    },
    {
      icon: Trophy,
      title: 'Winners Announced',
      description: 'The creators with the most votes in each category are crowned as the winners and receive recognition for their outstanding work.',
      details: [
        'Winners announced at ceremony',
        'Digital awards and certificates',
        'Media coverage and promotion',
        'Networking opportunities'
      ]
    }
  ];

  const timeline = [
    { date: 'Jan 1 - Mar 31', event: 'Nominee Registration Period', status: 'active' },
    { date: 'Apr 1 - Jun 30', event: 'Public Voting Period', status: 'upcoming' },
    { date: 'Jul 15', event: 'Winners Announcement', status: 'upcoming' },
    { date: 'Aug 1', event: 'Awards Ceremony', status: 'upcoming' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">How Creator Awards Works</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A simple three-step process that celebrates digital creativity and connects creators with their communities.
          </p>
        </div>

        {/* Main Steps */}
        <div className="mb-20">
          <div className="grid lg:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl shadow-lg p-8 h-full">
                  <div className="bg-gradient-to-br from-yellow-400 to-red-500 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 text-white">
                    <step.icon className="w-10 h-10" />
                  </div>
                  <div className="bg-gradient-to-r from-yellow-500 to-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold mb-4">
                    {index + 1}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{step.description}</p>
                  <ul className="space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-6 transform -translate-y-1/2">
                    <div className="w-12 h-0.5 bg-gradient-to-r from-yellow-400 to-red-500"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-20 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">2024 Awards Timeline</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {timeline.map((item, index) => (
              <div key={index} className="text-center">
                <div className={`w-4 h-4 rounded-full mx-auto mb-4 ${
                  item.status === 'active' ? 'bg-green-500' : 
                  item.status === 'completed' ? 'bg-blue-500' : 'bg-gray-300'
                }`}></div>
                <div className="text-sm font-semibold text-gray-600 mb-2">{item.date}</div>
                <div className="text-lg font-bold text-gray-900">{item.event}</div>
                <div className={`text-sm mt-2 px-3 py-1 rounded-full inline-block ${
                  item.status === 'active' ? 'bg-green-100 text-green-800' :
                  item.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {item.status === 'active' ? 'Active Now' : 
                   item.status === 'completed' ? 'Completed' : 'Coming Soon'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Why Creator Awards?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <Award className="w-12 h-12 text-yellow-500 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Recognition</h3>
              <p className="text-gray-600">
                Get the recognition you deserve for your creative work and impact on digital communities.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <Users className="w-12 h-12 text-red-500 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Community</h3>
              <p className="text-gray-600">
                Connect with fellow creators and build stronger relationships with your audience.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <Star className="w-12 h-12 text-pink-500 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Growth</h3>
              <p className="text-gray-600">
                Gain exposure, attract new followers, and take your creative career to the next level.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-20 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Who can register as a nominee?</h3>
              <p className="text-gray-600 mb-4">
                Any content creator with an active social media presence can register. We welcome creators from all platforms and backgrounds.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Is there a fee to participate?</h3>
              <p className="text-gray-600 mb-4">
                No, registration and voting are completely free. Creator Awards is funded by sponsors and community support.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How many times can I vote?</h3>
              <p className="text-gray-600 mb-4">
                You can vote once per category. This ensures fair competition and prevents vote manipulation.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What do winners receive?</h3>
              <p className="text-gray-600 mb-4">
                Winners receive digital awards, certificates, media coverage, and opportunities for brand partnerships.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-yellow-400 to-red-500 rounded-2xl p-12 text-white">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of creators and fans in celebrating digital excellence
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onPageChange('register')}
              className="bg-white text-red-500 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              Register as Nominee
            </button>
            <button
              onClick={() => onPageChange('vote')}
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-red-500 transition-colors"
            >
              Start Voting
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};