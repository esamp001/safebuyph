import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';

const steps = [
  {
    title: 'Buyer Finds a Product',
    description: `The buyer spots an item they like on Facebook Marketplace and wants a safer way to transact. They invite the seller to use SafeBuy PH for secure handling and peace of mind.`,
    icon: '/src/assets/Collab-pana.png',
  },
  {
    title: 'Transaction is Created on SafeBuy PH',
    description: `The buyer initiates the process on SafeBuy PH by entering the seller's email, item details, and agreed price. The transaction is now marked as PENDING.`,
    icon: '/src/assets/future-pana.png',
  },
  {
    title: 'Seller Accepts the Transaction',
    description: `The seller logs in and accepts the pending request. The transaction status changes to ACCEPTED, and the buyer is notified to proceed with payment.`,
    icon: '/src/assets/Active Support-pana.png',
  },
  {
    title: 'Buyer Sends Payment to Escrow',
    description: `The buyer uploads payment proof. Once verified, SafeBuy PH securely holds the funds in escrow. This protects both sides before shipment.`,
    icon: '/src/assets/coming-soon.gif',
  },
  {
    title: 'Seller Ships the Item',
    description: `The seller ships the product via courier (e.g. LBC) and optionally uploads proof. The transaction is marked as SHIPPED, and a 3-day confirmation countdown begins.`,
    icon: '/src/assets/Real-time Sync-pana.png',
  },
  {
    title: 'Buyer Confirms Item Received with 3-Day Confirmation Window',
    description: `The buyer has 3 days to confirm the item arrived. If confirmed, escrow is released. If disputed, SafeBuy PH steps in to resolve. If no action, funds auto-release to the seller.`,
    icon: '/src/assets/stay-pana.png',
  },
];

export function ZigzagCard() {
  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4 space-y-4">
        <Card className="flex flex-row items-center gap-2 p-2 border-radius-lg bg-[#f5f5f5]">
          <CardContent className="flex flex-row items-center gap-2">
            <img
              src="/src/assets/Collab-pana.png"
              alt="Buyer Finds Product"
              className="w-96 h-96 object-contain"
            />
            <div className="w-1/2 ml-auto">
              <h3 className="text-2xl font-bold text-center mb-2 font-poppins">{steps[0].title}</h3>
              <p className="text-gray-700 font-sans">{steps[0].description}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="flex flex-row items-center gap-2 p-2 border-radius-lg bg-[#f5f5f5]">
          <CardContent className="flex flex-row items-center gap-2">
            <div className="w-1/2">
              <h3 className="text-2xl font-bold text-center mb-2 font-poppins">{steps[1].title}</h3>
              <p className="text-gray-700 font-sans">{steps[1].description}</p>
            </div>
            <img
              src="/src/assets/future-pana.png"
              alt="Buyer Initiates Transaction"
              className="w-96 h-96 object-contain"
            />
          </CardContent>
        </Card>
        <Card className="flex flex-row items-center gap-2 p-2 border-radius-lg bg-[#f5f5f5]">
          <CardContent className="flex flex-row items-center gap-2">
            <img src={steps[2].icon} alt="Seller Ships Item" className="w-96 h-96 object-contain" />
            <div className="w-1/2 ml-auto">
              <h3 className="text-2xl font-bold text-center mb-2 font-poppins">{steps[2].title}</h3>
              <p className="text-gray-700 font-sans">{steps[2].description}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="flex flex-row items-center gap-2 p-2 border-radius-lg bg-[#f5f5f5]">
          <CardContent className="flex flex-row items-center gap-2">
            <div className="w-1/2">
              <h3 className="text-2xl font-bold text-center mb-2 font-poppins">{steps[3].title}</h3>
              <p className="text-gray-700 font-sans">{steps[3].description}</p>
            </div>
            <img
              src={steps[3].icon}
              alt="Buyer Sends Payment"
              className="w-96 h-96 object-contain"
            />
          </CardContent>
        </Card>
        <Card className="flex flex-row items-center gap-2 p-2 border-radius-lg bg-[#f5f5f5]">
          <CardContent className="flex flex-row items-center gap-2">
            <img src={steps[4].icon} alt="Seller Ships Item" className="w-96 h-96 object-contain" />
            <div className="w-1/2 ml-auto">
              <h3 className="text-2xl font-bold text-center mb-2 font-poppins">{steps[4].title}</h3>
              <p className="text-gray-700 font-sans">{steps[4].description}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="flex flex-row items-center gap-2 p-2 border-radius-lg bg-[#f5f5f5]">
          <CardContent className="flex flex-row items-center gap-2">
            <div className="w-1/2">
              <h3 className="text-2xl font-bold text-center mb-2 font-poppins">{steps[5].title}</h3>
              <p className="text-gray-700 font-sans">{steps[5].description}</p>
            </div>
            <img
              src={steps[5].icon}
              alt="Confirmation Window"
              className="w-96 h-96 object-contain"
            />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export default ZigzagCard;
