import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { HomePage } from './components/pages/HomePage';
import { CategoriesPage } from './components/pages/CategoriesPage';
import { RegisterPage } from './components/pages/RegisterPage';
import { VotePage } from './components/pages/VotePage';
import { HowItWorksPage } from './components/pages/HowItWorksPage';
import { ResultsPage } from './components/pages/ResultsPage';
import { LoginPage } from './components/pages/LoginPage';
import { ProfilePage } from './components/pages/ProfilePage';
import { NomineeProfilePage } from './components/pages/NomineeProfilePage';
import { AuthProvider } from './contexts/AuthContext';
import { Page, Nominee, Vote } from './types';
import { categories } from './data/mockData';
import { apiService } from './services/api';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedNomineeId, setSelectedNomineeId] = useState<string>('');
  const [nominees, setNominees] = useState<Nominee[]>([]);
  const [userVotes, setUserVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      // Load nominees
      const nomineesResponse = await apiService.getNominees();
      if (nomineesResponse.success) {
        setNominees(nomineesResponse.data);
      }

      // Load user votes from localStorage
      const savedVotes = localStorage.getItem('creatorAwards_votes');
      if (savedVotes) {
        try {
          setUserVotes(JSON.parse(savedVotes));
        } catch (error) {
          console.error('Error loading votes from localStorage:', error);
        }
      }
    } catch (error) {
      console.error('Failed to load initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: Page, nomineeId?: string) => {
    setCurrentPage(page);
    if (nomineeId) {
      setSelectedNomineeId(nomineeId);
    }
  };

  const handleRegister = async (nomineeData: Omit<Nominee, 'id' | 'votes'>) => {
    try {
      const response = await apiService.register(nomineeData);
      if (response.success) {
        // Reload nominees to include the new one
        const nomineesResponse = await apiService.getNominees();
        if (nomineesResponse.success) {
          setNominees(nomineesResponse.data);
        }
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const handleVote = async (voteData: Omit<Vote, 'timestamp'>) => {
    try {
      const response = await apiService.vote(voteData.nomineeId, voteData.category);
      if (response.success) {
        const newVote: Vote = {
          ...voteData,
          id: response.data.id,
          timestamp: Date.now(),
          ipAddress: ''
        };
        
        // Add vote to user's votes
        const updatedVotes = [...userVotes, newVote];
        setUserVotes(updatedVotes);
        localStorage.setItem('creatorAwards_votes', JSON.stringify(updatedVotes));
        
        // Update nominee's vote count locally
        setNominees(prev => prev.map(nominee => 
          nominee.id === voteData.nomineeId 
            ? { ...nominee, votes: nominee.votes + 1 }
            : nominee
        ));
      }
    } catch (error) {
      console.error('Voting failed:', error);
    }
  };

  const renderCurrentPage = () => {
    if (loading) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      );
    }

    switch (currentPage) {
      case 'home':
        return <HomePage nominees={nominees} onPageChange={handlePageChange} />;
      case 'categories':
        return <CategoriesPage categories={categories} onPageChange={handlePageChange} />;
      case 'register':
        return <RegisterPage onRegister={handleRegister} />;
      case 'vote':
        return <VotePage nominees={nominees} onVote={handleVote} userVotes={userVotes} />;
      case 'how-it-works':
        return <HowItWorksPage onPageChange={handlePageChange} />;
      case 'results':
        return <ResultsPage nominees={nominees} />;
      case 'login':
        return <LoginPage onPageChange={handlePageChange} />;
      case 'profile':
        return <ProfilePage onPageChange={handlePageChange} />;
      case 'nominee-profile':
        return (
          <NomineeProfilePage 
            nomineeId={selectedNomineeId} 
            onVote={handleVote} 
            userVotes={userVotes} 
          />
        );
      default:
        return <HomePage nominees={nominees} onPageChange={handlePageChange} />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navigation currentPage={currentPage} onPageChange={handlePageChange} />
        <main>
          {renderCurrentPage()}
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;