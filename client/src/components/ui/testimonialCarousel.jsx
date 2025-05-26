import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';
import { Card } from '@/components/ui/card';

const testimonials = [
  {
    name: 'Jane D.',
    quote: 'SafeBuy PH made my transaction so much safer!',
    avatar: '/src/assets/yes-high.png',
    role: 'Verified Buyer',
  },
  {
    name: 'Mark S.',
    quote: 'The escrow system gave me peace of mind as a seller.',
    avatar: '/src/assets/Collab-pana.png',
    role: 'Seller',
  },
  {
    name: 'Aira P.',
    quote: 'Super easy to use and very secure. Highly recommended!',
    avatar: '/src/assets/Enthusiastic-pana.png',
    role: 'Buyer',
  },
  {
    name: 'Juan C.',
    quote: 'I love how transparent and fair the process is.',
    avatar: '/src/assets/Profile Interface-bro.png',
    role: 'Seller',
  },
  {
    name: 'Liza M.',
    quote: 'Customer support was quick and helpful. 5 stars!',
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
              <Card className="aspect-square p-6 border-radius-lg">
                <div className="flex items-end h-full">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-16 h-16 object-cover rounded-full"
                  />
                </div>
                <p className="italic text-lg mb-2 text-center text-black">"{testimonial.quote}"</p>
                <div className="font-bold text-black">{testimonial.name}</div>
                <div className="text-xs text-black">{testimonial.role}</div>
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
