import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import LandingPageHeader from '@/components/ui/landingpageHeader';
import landingPageImage from '@/assets/start-landpage.png';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* HEADER SECTION */}
      <LandingPageHeader />
      {/* HERO SECTION */}
      <div className="w-full bg-[#1eafd0] relative">
        <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
          <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-8">
            {/* Left Content */}
            <div className="flex-1 max-w-2xl">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
                Secure your online transactions
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8">
                Safebuy PH provides a secure escrow service for your online purchase and sales.
              </p>
              <Button
                className="bg-white text-[#1eafd0] hover:bg-gray-100 rounded-full font-bold h-12 px-8 text-lg flex items-center gap-2"
                onClick={() => navigate('/signup')}
              >
                Get Started
              </Button>
            </div>

            {/* Right Content - Image */}
            <div className="flex-1 max-w-4xl flex items-center justify-end bg-[#1eafd0] rounded-2xl p-4">
              <div className="w-full h-full flex items-center justify-end">
                <img
                  src={landingPageImage}
                  alt="Hero Image"
                  className="w-[90%] h-auto object-contain rounded-2xl bg-[#1eafd0]"
                  style={{ backgroundColor: '#1eafd0' }}
                />
              </div>
            </div>
          </div>
        </div>
        <svg
          className="absolute left-0 bottom-0 w-full"
          viewBox="0 0 1440 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'block' }}
        >
          <path fill="#fff" d="M0,250 C480,400 960,100 1440,250 L1440,320 L0,320 Z" />
        </svg>
      </div>
      {/* KEY FEATURES SECTION */}
      <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold text-center mb-4 sm:mb-6 font-poppins">
          The Smartest All-in-One Marketplace Solution
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-center mb-6 sm:mb-8 font-poppins">
          Smarter buying and selling starts with SafeBuy PH. Track, protect, and enjoy expert-backed
          escrow security—all in one place.
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
