import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import NgoFinderPage from './pages/NgoFinderPage';
import NgoDetailPage from './pages/NgoDetailPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import HowVerificationWorks from './pages/HowVerificationWorks';
import AuthModal from './components/AuthModal';
import SuggestNgoModal from './components/SuggestNgoModal';
import TrustScoreModal from './components/TrustScoreModal';
import MobileConnectModal from './components/MobileConnectModal';

function MainApp() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedNgoId, setSelectedNgoId] = useState(null);
  const [finderFilters, setFinderFilters] = useState({});

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [suggestModalOpen, setSuggestModalOpen] = useState(false);
  const [trustModalOpen, setTrustModalOpen] = useState(false);
  const [mobileConnectOpen, setMobileConnectOpen] = useState(false);
  const [trustNgo, setTrustNgo] = useState(null);

  const [finderKey, setFinderKey] = useState(0);

  // Sync with browser hash if user uses back/forward buttons or refreshes
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash || hash === 'home') {
        setCurrentPage('home');
        return;
      }
      if (hash.startsWith('ngo-')) {
        const id = parseInt(hash.replace('ngo-', ''), 10);
        if (!isNaN(id)) {
          setSelectedNgoId(id);
          setCurrentPage('detail');
          return;
        }
      }
      if (['home', 'finder', 'admin', 'how-it-works'].includes(hash)) {
        setCurrentPage(hash);
      }
    };

    window.addEventListener('hashchange', handleHash);
    handleHash();
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigateTo = (page, filters = {}) => {
    setFinderFilters(filters);
    setCurrentPage(page);
    if (page === 'finder' && Object.keys(filters).length === 0) {
      setFinderKey(k => k + 1);
    }
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectNgo = (id) => {
    const numId = parseInt(id, 10);
    if (!isNaN(numId)) {
      setSelectedNgoId(numId);
      setCurrentPage('detail');
      window.location.hash = `ngo-${numId}`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const openTrustBreakdown = (ngo) => {
    setTrustNgo(ngo);
    setTrustModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar
        currentPage={currentPage}
        onNavigate={navigateTo}
        onOpenSuggest={() => setSuggestModalOpen(true)}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenMobileConnect={() => setMobileConnectOpen(true)}
      />

      {/* Main Content Area - with bottom padding on mobile for BottomNav */}
      <main className="flex-1 pb-20 md:pb-0">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={navigateTo}
            onSelectNgo={selectNgo}
            onOpenSuggest={() => setSuggestModalOpen(true)}
            onOpenTrustBreakdown={openTrustBreakdown}
          />
        )}

        {currentPage === 'finder' && (
          <NgoFinderPage
            key={finderKey}
            initialFilters={finderFilters}
            onSelectNgo={selectNgo}
            onOpenTrustBreakdown={openTrustBreakdown}
          />
        )}

        {currentPage === 'detail' && (
          selectedNgoId ? (
            <NgoDetailPage
              ngoId={selectedNgoId}
              onBack={() => navigateTo('finder')}
              onOpenTrustBreakdown={openTrustBreakdown}
            />
          ) : (
            <NgoFinderPage
              key={finderKey}
              initialFilters={finderFilters}
              onSelectNgo={selectNgo}
              onOpenTrustBreakdown={openTrustBreakdown}
            />
          )
        )}

        {currentPage === 'admin' && (
          <AdminDashboardPage
            onSelectNgo={selectNgo}
          />
        )}

        {currentPage === 'how-it-works' && (
          <HowVerificationWorks
            onNavigate={navigateTo}
            onOpenSuggest={() => setSuggestModalOpen(true)}
          />
        )}
      </main>

      <Footer onNavigate={navigateTo} />

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        currentPage={currentPage}
        onNavigate={navigateTo}
        onOpenSuggest={() => setSuggestModalOpen(true)}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Global Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      <SuggestNgoModal
        isOpen={suggestModalOpen}
        onClose={() => setSuggestModalOpen(false)}
      />

      <TrustScoreModal
        ngo={trustNgo}
        isOpen={trustModalOpen}
        onClose={() => setTrustModalOpen(false)}
      />

      <MobileConnectModal
        isOpen={mobileConnectOpen}
        onClose={() => setMobileConnectOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
