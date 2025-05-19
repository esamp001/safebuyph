import { ShoppingBag } from 'lucide-react';
import { HandCoins } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import buy from '@/assets/I want to buy.jpg';
import sell from '@/assets/I want to sell.jpg';

export function ButtonWithIcon({ onSelect }) {
  return (
    <div className="flex gap-6">
      <Card className="w-64 shadow-lg bg-white rounded-3xl overflow-hidden flex flex-col p-0 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
        {/* Image section */}
        <div className="bg-blue-100 w-full h-32 overflow-hidden">
          <img src={buy} alt="buy" className="w-full h-32 object-cover" />
        </div>
        <CardContent className="flex flex-col items-center py-6 px-4 h-[250px]">
          <div className="w-full flex flex-col items-center flex-grow">
            <div className="font-bold text-xl font-poppins text-[#0e1d54] mb-3">I want to buy</div>
            <p className="text-xs text-gray-600 font-poppins mb-4 text-center leading-relaxed">
              Safely purchase products from Facebook Marketplace using our secure escrow system.
              Avoid scams and ensure you receive your item before releasing payment.
            </p>
          </div>
          <Button
            className="bg-[#597aaf] hover:bg-[#0e1d54] w-full rounded-full font-poppins mt-auto py-2 transition-all duration-300"
            onClick={() => onSelect('buyer')}
          >
            Select
          </Button>
        </CardContent>
      </Card>
      <Card className="w-64 shadow-lg bg-white rounded-3xl overflow-hidden flex flex-col p-0 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
        {/* Image section */}
        <div className="bg-blue-100 w-full h-32 overflow-hidden">
          <img src={sell} alt="sell" className="w-full h-32 object-cover" />
        </div>
        <CardContent className="flex flex-col items-center py-6 px-4 h-[250px]">
          <div className="w-full flex flex-col items-center flex-grow">
            <div className="font-bold text-xl font-poppins text-[#0e1d54] mb-3">I want to sell</div>
            <p className="text-xs text-gray-600 font-poppins mb-4 text-center leading-relaxed">
              Protect your sales and build trust. Get notified when a buyer starts a transaction and
              receive payment only after delivery is confirmed.
            </p>
          </div>
          <Button
            className="bg-[#597aaf] hover:bg-[#0e1d54] w-full rounded-full font-poppins mt-auto py-2 transition-all duration-300"
            onClick={() => onSelect('seller')}
          >
            Select
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
