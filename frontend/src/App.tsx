import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Header } from './components/layout/Header';
import { LandingPage } from './components/home/LandingPage';
import { Dashboard } from './components/dashboard/Dashboard';
import { SkillExplorer } from './components/skills/SkillExplorer';
import { ProfilePage } from './components/profile/ProfilePage';
import { MessagesPage } from './components/messages/MessagesPage';
import { AuthModal } from './components/auth/AuthModal';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleGetStarted = () => {
    setShowAuthModal(true);
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  if (!isAuthenticated) {
    return (
      <>
        <LandingPage onGetStarted={handleGetStarted} />
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialMode="register"
        />
      </>
    );
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'explore':
        return <SkillExplorer onNavigate={handleNavigate} />;
      case 'profile':
        return <ProfilePage />;
      case 'messages':
        return <MessagesPage />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onNavigate={handleNavigate} currentPage={currentPage} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderCurrentPage()}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;