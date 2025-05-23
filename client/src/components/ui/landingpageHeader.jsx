import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import logo from '@/assets/SAFEBUYPH - TRANS.png';
import { Separator } from '@/components/ui/separator';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const LandingPageHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [menuOpen]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full h-16 flex items-center justify-between px-5 h-[80px] bg-white/50 backdrop-blur-lg">
      <div className="flex-shrink-0">
        <img src={logo} alt="SafeBuy PH Logo" className="w-26 h-16" />
      </div>

      {/* Desktop Nav */}
      <ul className="hidden lg:flex space-x-10">
        <li>
          <a href="#about" className="text-[#1f3f6f] font-poppins hover:text-gray-300 font-bold">
            Features & Pricing
          </a>
        </li>
        <li>
          <a href="#features" className="text-[#1f3f6f] font-poppins hover:text-gray-300 font-bold">
            How It Works
          </a>
        </li>
        <li>
          <a href="#pricing" className="text-[#1f3f6f] font-poppins hover:text-gray-300 font-bold">
            Why Safebuy?
          </a>
        </li>
        <li>
          <a href="#aboutus" className="text-[#1f3f6f] font-poppins hover:text-gray-300 font-bold">
            About Us
          </a>
        </li>
      </ul>

      {/* Desktop Buttons */}
      <div className="hidden lg:flex items-center gap-4">
        <Button
          className="bg-[#2a5888] text-white hover:bg-gray-800 rounded-full h-10 px-8 text-lg flex items-center"
          onClick={() => navigate('/login')}
        >
          Login
        </Button>
        <Button
          className="bg-[#FFFF] text-black hover:bg-gray-800 rounded-full h-10 px-8 text-lg flex items-center"
          onClick={() => navigate('/signup')}
        >
          Sign Up
        </Button>
      </div>

      {/* Hamburger - only on mobile */}
      <button
        className="lg:hidden p-2 rounded focus:outline-none ml-2"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6 text-[#1f3f6f]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="fixed top-16 left-0 w-full bg-white shadow-lg z-50 flex flex-col items-center py-4">
          <a
            href="#about"
            className="text-[#1f3f6f] font-poppins py-2"
            onClick={() => setMenuOpen(false)}
          >
            Features & Pricing
          </a>
          <a
            href="#features"
            className="text-[#1f3f6f] font-poppins py-2"
            onClick={() => setMenuOpen(false)}
          >
            How It Works
          </a>
          <a
            href="#pricing"
            className="text-[#1f3f6f] font-poppins py-2"
            onClick={() => setMenuOpen(false)}
          >
            Why Safebuy?
          </a>
          <a
            href="#aboutus"
            className="text-[#1f3f6f] font-poppins py-2"
            onClick={() => setMenuOpen(false)}
          >
            About Us
          </a>
          <Button
            className="my-2 bg-[#2a5888] text-white w-4/5"
            onClick={() => {
              setMenuOpen(false);
              navigate('/login');
            }}
          >
            Login
          </Button>
          <Button
            className="my-2 bg-white text-black w-4/5"
            onClick={() => {
              setMenuOpen(false);
              navigate('/signup');
            }}
          >
            Sign Up
          </Button>
        </div>
      )}
    </nav>
  );
};

export default LandingPageHeader;
