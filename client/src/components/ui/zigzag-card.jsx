import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';

const steps = [
  {
    title: 'Buyer Finds Product on Facebook Marketplace',
    description: `Ellejun (the buyer) sees a PS5 for ₱15,000 being sold by Juan (the seller) on Facebook Marketplace. They chat via Messenger. Ellejun wants a safe transaction, so she suggests using SafeBuy PH.`,
    icon: '/src/assets/Collab-pana.png', // Use your own relevant image
  },
  {
    title: 'Buyer Initiates Transaction on SafeBuy PH',
    description: `Ellejun logs into SafeBuy PH and fills out a transaction form: Seller's SafeBuy email or user ID, Item description (optional), Price: ₱15,000. She submits it. The transaction is now PENDING.`,
    icon: '/src/assets/future-pana.png',
  },
  {
    title: 'Seller Accepts Request',
    description: `Juan logs into SafeBuy PH and sees the pending transaction. He accepts it — status changes to ACCEPTED. Buyer is notified.`,
    icon: '/src/assets/Active Support-pana.png',
  },
  {
    title: 'Buyer Pays',
    description: `Ellejun uploads payment proof or confirms transfer to escrow. (SafeBuy PH marks the transaction as PAID.) This step confirms that funds are held in escrow.`,
    icon: '/src/assets/coming-soon.gif',
  },
  {
    title: 'Seller Ships Item',
    description: `Juan ships the PS5 via LBC and uploads shipping proof (optional). He then marks the transaction as SHIPPED.`,
    icon: '/src/assets/Real-time Sync-pana.png',
  },
  {
    title: '3-Day Confirmation Window',
    description: `Once marked as SHIPPED, a 3-day countdown begins. Ellejun (the buyer) can: Click "Confirm Received" → Status becomes COMPLETED, escrow is released to Juan. Click "File Dispute" → Status becomes DISPUTED. If she does nothing for 3 days: Escrow is auto-released to Juan (status: COMPLETED).`,
    icon: '/src/assets/stay-pana.png',
  },
  {
    title: 'Optional: Buyer Files a Dispute',
    description: `If Ellejun receives a defective or wrong item, she clicks "File Dispute". Transaction status becomes DISPUTED. Admin manually reviews evidence from both sides. Admin decides outcome: refund to buyer or release to seller.`,
    icon: '/src/assets/coming-set.png',
  },
  {
    title: 'Rating',
    description: `After completion, Ellejun rates Juan (1 to 5 stars). Juan's profile is updated with a new rating score. Ratings help future buyers decide who to trust.`,
    icon: '/src/assets/yes-high.png',
  },
];

export function ZigzagCard() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-row items-center gap-8">
          {/* First Image on left */}
          <img src="/src/assets/Collab-pana.png" alt="Buyer Finds Product" className="w-1/2" />
          {/* Text Description 1 */}
          <div className="w-1/2">
            <h3 className="text-2xl font-bold text-center mb-8">{steps[0].title}</h3>
            <p className="text-gray-700">{steps[0].description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ZigzagCard;
