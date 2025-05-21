import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import LandingPageHeader from '@/components/ui/landingpageHeader';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER SECTION */}
      <LandingPageHeader />
    </div>
  );
};

export default LandingPage;
