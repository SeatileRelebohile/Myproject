import { Nominee, Category } from '../types';

export const categories: Category[] = [
  {
    id: 'facebook',
    name: 'Facebook Account of the Year',
    description: 'Outstanding Facebook content creator with engaging posts and community building',
    icon: 'Facebook'
  },
  {
    id: 'tiktok',
    name: 'TikTok Creator of the Year',
    description: 'Viral TikTok creator with creative and entertaining content',
    icon: 'Music'
  },
  {
    id: 'instagram',
    name: 'Instagram Star of the Year',
    description: 'Instagram influencer with stunning visuals and engaging stories',
    icon: 'Instagram'
  },
  {
    id: 'twitter',
    name: 'Twitter Personality of the Year',
    description: 'Twitter user with witty content and strong community engagement',
    icon: 'Twitter'
  },
  {
    id: 'youtube',
    name: 'YouTube Channel of the Year',
    description: 'Outstanding YouTube channel with quality video content',
    icon: 'Youtube'
  },
  {
    id: 'rising-star',
    name: 'Rising Star',
    description: 'Emerging creator showing exceptional growth and potential',
    icon: 'Star'
  }
];

export const mockNominees: Nominee[] = [
  {
    id: '1',
    name: 'Sophia Martinez',
    email: 'sophia@example.com',
    platform: 'Instagram',
    profileLink: 'https://instagram.com/sophiamartinez',
    profileImage: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=600',
    bio: 'Fashion and lifestyle content creator inspiring millions with sustainable fashion choices and authentic storytelling',
    category: 'instagram',
    votes: 2847
  },
  {
    id: '2',
    name: 'Marcus Chen',
    email: 'marcus@example.com',
    platform: 'TikTok',
    profileLink: 'https://tiktok.com/@marcuschen',
    profileImage: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=600',
    bio: 'Viral dance choreographer and comedy creator bringing joy to millions with innovative content and positive energy',
    category: 'tiktok',
    votes: 3421
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    email: 'elena@example.com',
    platform: 'YouTube',
    profileLink: 'https://youtube.com/elenarodriguez',
    profileImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=600',
    bio: 'Tech educator and reviewer making complex technology accessible through detailed analysis and honest reviews',
    category: 'youtube',
    votes: 2956
  },
  {
    id: '4',
    name: 'James Thompson',
    email: 'james@example.com',
    platform: 'Facebook',
    profileLink: 'https://facebook.com/jamesthompson',
    profileImage: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=600',
    bio: 'Culinary artist and food blogger sharing incredible recipes and cooking techniques with a growing community',
    category: 'facebook',
    votes: 2134
  },
  {
    id: '5',
    name: 'Aria Williams',
    email: 'aria@example.com',
    platform: 'Twitter',
    profileLink: 'https://twitter.com/ariawilliams',
    profileImage: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=600',
    bio: 'Social commentator and thought leader sparking meaningful conversations about culture and society',
    category: 'twitter',
    votes: 1876
  },
  {
    id: '6',
    name: 'Dylan Park',
    email: 'dylan@example.com',
    platform: 'Instagram',
    profileLink: 'https://instagram.com/dylanpark',
    profileImage: 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=600',
    bio: 'Rising fitness influencer transforming lives through authentic fitness journeys and motivational content',
    category: 'rising-star',
    votes: 1543
  },
  {
    id: '7',
    name: 'Isabella Kim',
    email: 'isabella@example.com',
    platform: 'TikTok',
    profileLink: 'https://tiktok.com/@isabellakim',
    profileImage: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=600',
    bio: 'Educational content creator making learning fun and accessible through creative storytelling and visual content',
    category: 'tiktok',
    votes: 2687
  },
  {
    id: '8',
    name: 'Alexander Davis',
    email: 'alex@example.com',
    platform: 'YouTube',
    profileLink: 'https://youtube.com/alexanderdavis',
    profileImage: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=600',
    bio: 'Gaming content creator and esports commentator building communities around competitive gaming',
    category: 'youtube',
    votes: 3156
  },
  {
    id: '9',
    name: 'Maya Patel',
    email: 'maya@example.com',
    platform: 'Instagram',
    profileLink: 'https://instagram.com/mayapatel',
    profileImage: 'https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=600',
    bio: 'Beauty and wellness expert sharing skincare routines and self-care practices for holistic well-being',
    category: 'instagram',
    votes: 2234
  },
  {
    id: '10',
    name: 'Noah Johnson',
    email: 'noah@example.com',
    platform: 'Twitter',
    profileLink: 'https://twitter.com/noahjohnson',
    profileImage: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=600',
    bio: 'Sports analyst and commentator providing insightful commentary and engaging with passionate sports communities',
    category: 'twitter',
    votes: 1789
  },
  {
    id: '11',
    name: 'Zoe Anderson',
    email: 'zoe@example.com',
    platform: 'Facebook',
    profileLink: 'https://facebook.com/zoeanderson',
    profileImage: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=600',
    bio: 'Travel blogger and photographer capturing breathtaking destinations and inspiring wanderlust in her audience',
    category: 'facebook',
    votes: 1967
  },
  {
    id: '12',
    name: 'Ethan Lee',
    email: 'ethan@example.com',
    platform: 'YouTube',
    profileLink: 'https://youtube.com/ethanlee',
    profileImage: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=600',
    bio: 'Music producer and artist sharing behind-the-scenes content and tutorials for aspiring musicians',
    category: 'rising-star',
    votes: 1432
  }
];