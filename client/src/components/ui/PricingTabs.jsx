import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default function PricingTabs() {
  return (
    <Tabs
      defaultValue="transaction"
      className="w-full max-w-2xl mx-auto flex flex-col items-center"
    >
      <TabsList className="flex justify-center w-full">
        <TabsTrigger value="transaction">Per-Transaction Fee</TabsTrigger>
        <TabsTrigger value="subscription">Subscription Plan</TabsTrigger>
      </TabsList>
      <TabsContent value="transaction" className="text-center">
        <h2 className="text-xl font-bold mb-2">Per-Transaction Fee</h2>
        <p>2% per transaction (Min ₱20, Max ₱500)</p>
        <p>Perfect for casual users. No monthly fees.</p>
      </TabsContent>
      <TabsContent value="subscription">
        <h2 className="text-xl font-bold mb-2">Subscription Plan</h2>
        <p>₱499/month – 20 transactions included</p>
        <p>₱4,999/year – 250 transactions included</p>
        <p>Lower fee after included transactions, priority support, and more.</p>
      </TabsContent>
    </Tabs>
  );
}
