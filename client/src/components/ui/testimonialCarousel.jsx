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
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-2xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
}
