import { ShoppingBag } from 'lucide-react';
import { HandCoins } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function ButtonWithIcon({ onSelect }) {
  return (
    <div className="flex gap-6">
      <Card className="w-64">
        <CardContent className="flex flex-col items-center py-8">
          <ShoppingBag className="mb-4 w-10 h-10" />
          <div className="mb-4 font-semibold text-lg">I want to buy</div>
          <Button onClick={() => onSelect('buyer')}>Choose Buyer</Button>
        </CardContent>
      </Card>
      <Card className="w-64">
        <CardContent className="flex flex-col items-center py-8">
          <HandCoins className="mb-4 w-10 h-10" />
          <div className="mb-4 font-semibold text-lg">I want to sell</div>
          <Button onClick={() => onSelect('seller')}>Choose Seller</Button>
        </CardContent>
      </Card>
    </div>
  );
}
