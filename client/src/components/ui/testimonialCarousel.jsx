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
      <Carousel className="w-full max-w-2x1 mx-auto">
        <CarouselContent>
          {testimonials.map((testimonial, index) => (
            <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/3">
              <Card className="p-6 border-radius-lg h-[500px] w-full">
                <div className="flex flex-col h-full">
                  <div className="flex flex-row items-start justify-start">
                    <img
                      src={Quotation}
                      alt="Quotation"
                      className="w-16 h-16 object-cover rounded-full mr-4"
                    />
                  </div>
                  <div className="flex flex-col items-start justify-start mt-6 px-4 py-2">
                    <p className="italic text-base sm:text-lg md:text-xl mb-4 text-center text-black">
                      {testimonial.quote}
                    </p>
                  </div>
                  <div className="flex items-end mt-auto">
                    <div className="flex items-center gap-4">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-20 h-20 object-cover rounded-full"
                      />
                      <div className="flex flex-col">
                        <div className="font-bold text-black text-xl">{testimonial.name}</div>
                        <div className="text-sm text-black">{testimonial.role}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
}
