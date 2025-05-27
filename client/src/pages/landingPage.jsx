import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import LandingPageHeader from '@/components/ui/landingpageHeader';
import landingPageImage from '@/assets/start-landpage.png';
import yesLogo from '@/assets/yes-high.png';
import activeSupportImg from '@/assets/Active Support-pana.png';
import realTimeSystemImg from '@/assets/Real-time Sync-pana.png';
import SecureLogin from '@/assets/Secure login-pana.png';
import SoftwareIntegration from '@/assets/Software integration-amico.png';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import '@/styles/carousel.css';
import colabPana from '@/assets/Collab-pana.png';
import comingPana from '@/assets/coming-set.png';
import futurePana from '@/assets/future-pana.png';
import stayPana from '@/assets/stay-pana.png';
import { ZigzagCard } from '@/components/ui/zigzag-card';
import TestimonialCarousel from '@/components/ui/testimonialCarousel';
import PricingTabs from '@/components/ui/PricingTabs';
const LandingPage = () => {
  const navigate = useNavigate();

  const partnershipItems = [
    {
      title: 'Coming Soon',
      description: 'Strategic partnerships with leading payment providers',
      image: comingPana,
    },
    {
      title: 'In Development',
      description: 'Integration with major logistics companies',
      image: futurePana,
    },
    {
      title: 'Future Partners',
      description: 'Security and verification service providers',
      image: futurePana,
    },
    {
      title: 'Stay Tuned',
      description: 'E-commerce platform integrations',
      image: stayPana,
    },
    {
      title: 'Coming Up',
      description: 'Customer support service partnerships',
      image: comingPana,
    },
    {
      title: 'Watch This Space',
      description: 'Technology and infrastructure collaborations',
      image: colabPana,
    },
  ];

  const autoplay = useMemo(
    () =>
      Autoplay({
        delay: 2000,
        stopOnInteraction: false,
        stopOnMouseEnter: false,
        playOnInit: true,
        stopOnFocusIn: false,
      }),
    []
  );

  const [emblaRef] = useEmblaCarousel({ loop: true }, [autoplay]);

  return (
    <div className="min-h-screen">
      {/* HEADER SECTION */}
      <LandingPageHeader />
      {/* HERO SECTION */}
      <div className="w-full bg-[#1eafd0] relative min-h-[350px]">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-6">
            {/* Left Content */}
            <div className="flex-1 w-full max-w-2xl px-4 sm:px-6 md:px-8 lg:px-0">
              <div className="mt-6 sm:mt-10 md:mt-16 lg:mt-32">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-10 sm:mb-6">
                  Secure your online transactions with confidence
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8">
                  Safebuy PH provides a secure escrow service for your online purchase and sales.
                </p>
              </div>
              <Button
                className="bg-white text-[#1eafd0] hover:bg-gray-100 rounded-full font-bold h-10 sm:h-12 md:h-14 lg:h-16 px-6 sm:px-8 md:px-10 lg:px-12 text-lg sm:text-xl md:text-2xl flex items-center gap-2 sm:gap-3"
                onClick={() => navigate('/signup')}
              >
                Get Started
                <ArrowRightIcon className="w-6 h-6" />
              </Button>
            </div>

            {/* Right Content - Image */}
            <div className="flex-1 max-w-4xl flex items-center justify-end bg-[#1eafd0] rounded-2xl p-4">
              <div className="w-full h-full flex items-center justify-end">
                <img
                  src={landingPageImage}
                  alt="Hero Image"
                  className="w-full max-w-md sm:max-w-xl md:max-w-xl lg:max-w-2xl h-48 sm:h-64 md:h-80 lg:h-[400px] object-contain rounded-2xl bg-[#1eafd0]"
                  style={{ backgroundColor: '#1eafd0' }}
                />
              </div>
            </div>
          </div>
          {/* Partnership Section */}
          <div className="w-full max-w-7xl mx-auto px-4 mt-16">
            <div className="embla" ref={emblaRef}>
              <div className="embla__container flex">
                {partnershipItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="embla__slide basis-full sm:basis-1/2 md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                  >
                    <Card className="p-6 bg-white/10 backdrop-blur-sm border-none h-[200px] flex flex-col items-center justify-center">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 mb-2 object-contain self-start"
                      />
                      <div className="flex flex-col items-center text-center">
                        <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                        <p className="text-sm text-gray-200 mt-1">{item.description}</p>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* KEY FEATURES SECTION */}
      <div className="w-full">
        <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-4 sm:mb-6 font-poppins px-4 sm:px-8 md:px-12 max-w-4xl mx-auto text-[#1f3f6f]">
            The Smartest All-in-One Marketplace Solution
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-center mb-4 sm:mb-6 font-poppins px-4 sm:px-8 md:px-12 max-w-3xl mx-auto">
            Smarter buying and selling starts with SafeBuy PH. Track, protect, and enjoy
            expert-backed escrow security—all in one place.
          </p>
          <div className="flex flex-col items-center gap-8 mt-10">
            <div className="flex flex-col md:flex-row w-full gap-y-8 md:gap-y-0 md:gap-x-8">
              <Card className="w-full md:w-1/2 lg:w-1/4 bg-[#98d2e1] rounded-xl p-8 flex flex-col items-center">
                <img
                  src={SecureLogin}
                  alt="Secure Login"
                  className="w-20 h-20 object-contain mb-4"
                />
                <h3 className="text-2xl font-bold mb-4 text-[#1f3f6f]">Secure Escrow Service</h3>
                <p className="text-[#1f3f6f] text-lg text-center">
                  Your funds are held securely until you confirm receipt of your purchase, ensuring
                  a safe transaction.
                </p>
              </Card>
              <Card className="w-full md:w-1/2 lg:w-1/4 bg-[#1f3f6f] rounded-xl p-8 flex flex-col items-center">
                <img
                  src={realTimeSystemImg}
                  alt="Real-time Tracking"
                  className="w-28 h-28 object-contain mb-4"
                />
                <h3 className="text-2xl font-bold mb-4 text-white">Real-time Tracking</h3>
                <p className="text-white text-lg text-center">
                  Monitor your transaction status in real-time with our intuitive tracking system.
                </p>
              </Card>
              <Card className="w-full md:w-1/2 lg:w-1/4 bg-[#4a8bb2] rounded-xl p-8 flex flex-col items-center">
                <img
                  src={activeSupportImg}
                  alt="Active Support"
                  className="w-28 h-28 object-contain mb-4"
                />
                <h3 className="text-2xl font-bold mb-4 text-white">Expert Support</h3>
                <p className="text-white text-lg text-center">
                  Get assistance from our dedicated support team whenever you need help.
                </p>
              </Card>
              <Card className="w-full md:w-1/2 lg:w-1/4 bg-[#dce1e6] rounded-xl p-8 flex flex-col items-center">
                <img
                  src={SoftwareIntegration}
                  alt="Software Integration"
                  className="w-20 h-20 object-contain mb-4"
                />
                <h3 className="text-2xl font-bold mb-4 text-[#1f3f6f]">Easy Integration</h3>
                <p className="text-[#1f3f6f] text-lg text-center">
                  Seamlessly integrate our service with your existing marketplace or business.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
      {/* HOW IT WORKS SECTION */}
      <div className="w-full">
        <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-4 sm:mb-6 font-poppins px-4 sm:px-8 md:px-12 max-w-4xl mx-auto text-[#1f3f6f]">
            How It Works
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-center mb-4 sm:mb-6 font-poppins px-4 sm:px-8 md:px-12 max-w-3xl mx-auto">
            SafeBuy PH is designed to make your online transactions as secure and seamless as
            possible. Here's how it works:
          </p>
          <ZigzagCard />
        </div>
      </div>
      {/* TRUST INDICATORS SECTION */}
      <div className="w-full bg-[#FFFF]">
        <Card className="container mx-auto px-4 py-8 sm:py-12 md:py-16 bg-[linear-gradient(to_right_top,#1eafd0,#0b92bc,#0f75a4,#195a8b,#1f3f6f)] p-6 text-white shadow-lg">
          <CardContent>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-4 sm:mb-6 font-poppins px-4 sm:px-8 md:px-12 max-w-4xl mx-auto text-[#FFFF]">
              Why Choose SafeBuy PH?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-center mb-4 sm:mb-6 font-poppins px-4 sm:px-8 md:px-12 max-w-3xl mx-auto">
              Join the millions of users who trust SafeBuy PH for their online transactions.
            </p>
            <div className="flex justify-center mb-12">
              <Button className="bg-white text-[#1eafd0] hover:bg-gray-100 rounded-full font-bold h-12 sm:h-14 md:h-16 lg:h-20 px-8 sm:px-10 md:px-12 lg:px-14 text-xl sm:text-2xl md:text-3xl flex items-center gap-3 sm:gap-4">
                Join now!
              </Button>
            </div>

            {/* SHADCDN CAROUSEL*/}
            <TestimonialCarousel />
          </CardContent>
        </Card>
      </div>
      {/* PRICING AND PLANS SECTION */}
      <div className="w-full">
        <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-4 sm:mb-6 font-poppins px-4 sm:px-8 md:px-12 max-w-4xl mx-auto text-[#1f3f6f]">
            Pricing and Plans
          </h2>
          <PricingTabs />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
