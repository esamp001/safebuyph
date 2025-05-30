import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, InstagramIcon, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full bg-[#334e6a]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">SafeBuy PH</h3>
            <p className="text-gray-200">
              Secure your online transactions with confidence. Your trusted escrow service for safe
              online purchases and sales.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-200 hover:text-[#1eafd0] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/how-it-works"
                  className="text-gray-200 hover:text-[#1eafd0] transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="text-gray-200 hover:text-[#1eafd0] transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-200 hover:text-[#1eafd0] transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Contact Us</h3>
            <ul className="space-y-2">
              <li className="text-gray-200">Email: support@safebuy.ph</li>
              <li className="text-gray-200">Phone: +63 (XXX) XXX-XXXX</li>
              <li className="text-gray-200">Address: Manila, Philippines</li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-200 hover:text-[#1eafd0] transition-colors"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-200 hover:text-[#1eafd0] transition-colors"
              >
                <Twitter className="w-6 h-6" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-200 hover:text-[#1eafd0] transition-colors"
              >
                <InstagramIcon className="w-6 h-6" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-200 hover:text-[#1eafd0] transition-colors"
              >
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-300 mt-12 pt-8">
          <p className="text-center text-gray-200">
            © {new Date().getFullYear()} SafeBuy PH. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
