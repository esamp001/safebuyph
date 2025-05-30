import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import LandingPageHeader from '@/components/ui/landingpageHeader';
import landingPageImage from '@/assets/start-landpage.png';
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
import FAQ from '@/components/ui/FAQComponents';
import secureTransaction from '@/assets/secure-trans.jpg';
import thanksSB from '@/assets/thanks-sb.jpg';
import lookingItem from '@/assets/lookingItem.jpg';

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
                        className="w-16 h-16 mb-2 object-contain mx-auto"
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
            Key Features That Set Us Apart
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-center mb-4 sm:mb-6 font-poppins px-4 sm:px-8 md:px-12 max-w-3xl mx-auto">
            Discover the powerful features that make SafeBuy PH the preferred choice for secure
            online transactions
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
                  Advanced escrow protection ensuring your funds are safe until delivery
                  confirmation
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
                  Live transaction monitoring with detailed status updates and delivery tracking
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
                  One-click integration with major marketplaces and business platforms
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
      {/* BENEFITS SECTION */}
      <div className="w-full">
        <div className="container mx-auto px-4 py-4 sm:py-6 md:py-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-3 sm:mb-4 font-poppins px-2 sm:px-4 md:px-6 max-w-4xl mx-auto text-[#1f3f6f]">
            Experience SafeBuy PH
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-center mb-3 sm:mb-4 font-poppins px-2 sm:px-4 md:px-6 max-w-3xl mx-auto">
            Experience the benefits of using SafeBuy PH for your online transactions
          </p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        <div className="grid grid-cols-4 grid-rows-6 gap-4 h-[600px] mx-8">
          <Card className="col-span-2 row-span-6 col-start-2 row-start-1 group hover:shadow-xl transition-all duration-300 h-full">
            <CardContent className="p-0 h-full">
              <div className="relative w-full h-full">
                <div className="relative w-full h-full">
                  <img
                    src={secureTransaction}
                    alt="Secure Transactions"
                    className="w-full h-full object-cover rounded-2xl group-hover:brightness-105 transition-all duration-300"
                  />
                  {/* Top left text */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60 rounded-2xl group-hover:from-black/50 group-hover:to-black/70 transition-all duration-300"></div>
                  <div className="absolute top-0 left-0 p-8">
                    <p className="text-5xl text-white font-bold tracking-tight">
                      100% Secure
                      <br />
                      Transactions
                    </p>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-start">
                    <div className="absolute bottom-0 left-0 right-0 text-white p-8">
                      <h3 className="text-4xl font-bold mb-6 text-left">Secure Transactions</h3>
                      <p className="text-md text-gray-100 font-poppins text-left">
                        At SafeBuy PH, we understand the importance of secure online transactions.
                        Our platform provides a safe environment where your funds are protected
                        until you confirm receipt of your purchase.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-1 row-span-3 col-start-1 row-start-1 group hover:shadow-xl transition-all duration-300 h-full bg-gradient-to-br from-[#1eafd0] to-[#2a5888] rounded-2xl">
            <CardContent className="flex flex-col items-start justify-start h-full p-8">
              <h3 className="text-3xl font-bold mb-4 text-[#FFFF] font-poppins text-left">
                Dispute Resolution
              </h3>
              <p className="text-white font-poppins text-left text-md leading-relaxed mt-auto">
                Fair and efficient handling of transaction disputes with our mediation system.
              </p>
            </CardContent>
          </Card>
          <Card className="row-span-3 col-start-1 row-start-4 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
            <CardContent className="flex flex-col items-center justify-center h-full p-0">
              <img
                src={thanksSB}
                alt="Secure Transactions"
                className="w-full h-full object-cover rounded-2xl brightness-75"
              />
            </CardContent>
          </Card>
          <Card className="row-span-3 col-start-4 row-start-1 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 p-0 h-full">
            <CardContent className="flex flex-col items-center justify-center h-full p-0">
              <img
                src={lookingItem}
                alt="Secure Transactions"
                className="w-full h-full object-cover rounded-2xl brightness-75"
              />
            </CardContent>
          </Card>
          <Card className="row-span-3 col-start-4 row-start-4 group hover:shadow-xl transition-all duration-300 h-full bg-gradient-to-br from-[#1eafd0] to-[#2a5888] rounded-2xl">
            <CardContent className="flex flex-col items-start justify-start h-full p-8">
              <h3 className="text-2xl font-bold mb-4 text-[#FFFF] font-poppins text-left">
                Secure Payment Options
              </h3>
              <p className="text-white font-poppins text-left text-md leading-relaxed mt-auto">
                Shop securely with multiple payment options, all protected by advanced encryption.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* HOW IT WORKS SECTION */}
      <div className="w-full">
        <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
          <ZigzagCard />
        </div>
      </div>
      {/* TRUST INDICATORS SECTION */}
      <div className="w-full bg-[#FFFF] -mt-10">
        <Card className="container mx-auto px-4 py-8 sm:py-12 md:py-16 bg-gradient-to-br from-[#1eafd0] via-[#0b92bc] to-[#1f3f6f] p-6 text-white shadow-lg min-h-[600px] relative overflow-hidden">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
          <CardContent className="flex flex-col items-center justify-center relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-10 text-center font-poppins text-white">
              What Others Say About SafebuyPH
            </h2>
            <h2 className="sm:text-lg md:text-xl text-center mb-4 sm:mb-6 font-poppins px-4 sm:px-8 md:px-12 max-w-3xl mx-auto text-white/90 font-poppins mb-10">
              Read what our users have to say about SafebuyPH
            </h2>
            <TestimonialCarousel />
          </CardContent>
          <div className="flex justify-center mt-12 relative z-10">
            <Button
              className="bg-white text-[#1eafd0] hover:bg-gray-100 rounded-full font-bold h-12 sm:h-14 md:h-16 lg:h-20 px-8 sm:px-10 md:px-12 lg:px-14 text-xl sm:text-2xl md:text-3xl flex items-center gap-3 sm:gap-4 transform hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl"
              onClick={() => navigate('/signup')}
            >
              Join now!
            </Button>
          </div>
        </Card>
      </div>
      {/* FAQ SECTION */}
      <div className="w-full bg-[#f5f5f5]">
        <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
          <FAQ />
        </div>
      </div>
      {/* PRICING AND PLANS SECTION */}
      <div className="w-full">
        <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-4 sm:mb-6 font-poppins px-4 sm:px-8 md:px-12 max-w-4xl mx-auto text-[#1f3f6f]">
            Pricing and Plans
          </h2>
          <div className="flex justify-center items-center">
            <PricingTabs />
          </div>
          <div className="flex justify-center mt-8">
            <Button className="bg-white text-[#1eafd0] hover:bg-gray-100 rounded-full font-bold h-10 px-4 text-sm flex items-center gap-2">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
