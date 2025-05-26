import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';
import { Card } from '@/components/ui/card';
import Quotation from '@/assets/quote.png';

const testimonials = [
  {
    name: 'Jane D.',
    quote:
      'SafeBuy PH made my transaction so much safer! I can now shop online with confidence. The escrow system gives me peace of mind knowing my money is protected until I receive my items.',
    avatar: '/src/assets/yes-high.png',
    role: 'Verified Buyer',
  },
  {
    name: 'Mark S.',
    quote:
      'The escrow system gave me peace of mind as a seller. I know my payments are secure and the platform handles all the complex parts of the transaction process.',
    avatar: '/src/assets/Collab-pana.png',
    role: 'Seller',
  },
  {
    name: 'Aira P.',
    quote:
      'Super easy to use and very secure. The platform is intuitive and customer service is excellent. I love how they guide you through each step of the process.',
    avatar: '/src/assets/Enthusiastic-pana.png',
    role: 'Buyer',
  },
  {
    name: 'Juan C.',
    quote:
      'I love how transparent and fair the process is. Every step is clearly explained and monitored. The real-time updates keep me informed throughout the entire transaction.',
    avatar: '/src/assets/Profile Interface-bro.png',
    role: 'Seller',
  },
  {
    name: 'Liza M.',
    quote:
      'Customer support was quick and helpful. They resolved my issue within minutes. The team went above and beyond to ensure my transaction was completed successfully.',
    avatar: '/src/assets/Active Support-pana.png',
    role: 'Buyer',
  },
];

export default function TestimonialCarousel() {
  return (
    <section>
      <Carousel className="w-full max-w-5xl mx-auto relative">
        <CarouselContent className="-ml-4">
          {testimonials.map((testimonial, index) => (
            <CarouselItem key={index} className="pl-6 md:basis-1/2 lg:basis-1/3">
              <Card className="p-4 border-radius-lg h-[400px] w-full">
                <div className="flex flex-col h-full">
                  <div className="flex flex-row items-start justify-start">
                    <img
                      src={Quotation}
                      alt="Quotation"
                      className="w-12 h-12 object-cover rounded-full mr-4"
                    />
                  </div>
                  <div className="flex flex-col items-start justify-start mt-4 px-6 py-3 flex-grow">
                    <p className="italic text-sm sm:text-base md:text-lg mb-3 text-start text-black">
                      {testimonial.quote}
                    </p>
                  </div>
                  <div className="flex items-end mt-auto">
                    <div className="flex items-center gap-3 relative">
                      <div className="absolute -top-2 left-4">
                        <div className="flex gap-1">
                          {[...Array(6)].map((_, i) => (
                            <svg
                              key={i}
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-4 h-4 text-yellow-400"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-10 h-10 object-cover rounded-full"
                        />
                        <div className="flex flex-col p-1">
                          <div className="font-bold text-black text-lg">{testimonial.name}</div>
                          <div className="text-xs text-black">{testimonial.role}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 bg-white hover:bg-gray-100 text-[#1f3f6f] rounded-full w-10 h-10" />
        <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 bg-white hover:bg-gray-100 text-[#1f3f6f] rounded-full w-10 h-10" />
      </Carousel>
    </section>
  );
}
