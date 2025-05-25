import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';

const steps = [
  {
    title: '1. Buyer Finds a Product',
    description: `The buyer spots an item they like on Facebook Marketplace and wants a safer way to transact. They invite the seller to use SafeBuy PH for secure handling and peace of mind.`,
    icon: '/src/assets/Collab-pana.png',
  },
  {
    title: '2. Transaction is Created on SafeBuy PH',
    description: `The buyer initiates the process on SafeBuy PH by entering the seller’s email, item details, and agreed price. The transaction is now marked as PENDING.`,
    icon: '/src/assets/future-pana.png',
  },
  {
    title: '3. Seller Accepts the Transaction',
    description: `The seller logs in and accepts the pending request. The transaction status changes to ACCEPTED, and the buyer is notified to proceed with payment.`,
    icon: '/src/assets/Active Support-pana.png',
  },
  {
    title: '4. Buyer Sends Payment to Escrow',
    description: `The buyer uploads payment proof. Once verified, SafeBuy PH securely holds the funds in escrow. This protects both sides before shipment.`,
    icon: '/src/assets/coming-soon.gif',
  },
  {
    title: '5. Seller Ships the Item',
    description: `The seller ships the product via courier (e.g. LBC) and optionally uploads proof. The transaction is marked as SHIPPED, and a 3-day confirmation countdown begins.`,
    icon: '/src/assets/Real-time Sync-pana.png',
  },
  {
    title: '6. Buyer Confirms Item Received with 3-Day Confirmation Window',
    description: `The buyer has 3 days to confirm the item arrived. If confirmed, escrow is released. If disputed, SafeBuy PH steps in to resolve. If no action, funds auto-release to the seller.`,
    icon: '/src/assets/stay-pana.png',
  },
];

export function ZigzagCard() {
  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4 space-y-4">
        <div className="flex flex-row items-center gap-4">
          <img src="/src/assets/Collab-pana.png" alt="Buyer Finds Product" className="w-1/2" />
          <div className="w-1/2">
            <h3 className="text-2xl font-bold text-center mb-4">{steps[0].title}</h3>
            <p className="text-gray-700">{steps[0].description}</p>
          </div>
        </div>
        <div className="flex flex-row items-center gap-4">
          <div className="w-1/2">
            <h3 className="text-2xl font-bold text-center mb-4">{steps[1].title}</h3>
            <p className="text-gray-700">{steps[1].description}</p>
          </div>
          <img
            src="/src/assets/future-pana.png"
            alt="Buyer Initiates Transaction"
            className="w-1/2"
          />
        </div>
        <div className="flex flex-row items-center gap-4">
          <img
            src="/src/assets/Real-time Sync-pana.png"
            alt="Seller Ships Item"
            className="w-1/2"
          />
          <div className="w-1/2">
            <h3 className="text-2xl font-bold text-center mb-4">{steps[2].title}</h3>
            <p className="text-gray-700">{steps[2].description}</p>
          </div>
        </div>
        <div className="flex flex-row items-center gap-4">
          <div className="w-1/2">
            <h3 className="text-2xl font-bold text-center mb-4">{steps[3].title}</h3>
            <p className="text-gray-700">{steps[3].description}</p>
          </div>
          <img src="/src/assets/yes-high.png" alt="Rating" className="w-1/2" />
        </div>
      </div>
      <div className="flex flex-row items-center gap-4">
        <img
          src="/src/assets/Real-time Sync-pana.png"
          alt="Buyer Confirms Item"
          className="w-1/2"
        />
        <div className="w-1/2">
          <h3 className="text-2xl font-bold text-center mb-4">{steps[4].title}</h3>
          <p className="text-gray-700">{steps[4].description}</p>
        </div>
      </div>
      <div className="flex flex-row items-center gap-4">
        <div className="w-1/2">
          <h3 className="text-2xl font-bold text-center mb-4">{steps[5].title}</h3>
          <p className="text-gray-700">{steps[5].description}</p>
        </div>
        <img src="/src/assets/stay-pana.png" alt="Confirmation Window" className="w-1/2" />
      </div>
    </section>
  );
}

export default ZigzagCard;
