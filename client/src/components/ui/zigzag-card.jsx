import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

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
    icon: '/src/assets/Accept request-bro.png',
  },
  {
    title: 'Buyer Sends Payment to Escrow',
    description: `The buyer uploads payment proof. Once verified, SafeBuy PH securely holds the funds in escrow. This protects both sides before shipment.`,
    icon: '/src/assets/Payment Information-bro.png',
  },
  {
    title: 'Seller Ships the Item',
    description: `The seller ships the product via courier (e.g. LBC) and optionally uploads proof. The transaction is marked as SHIPPED, and a 3-day confirmation countdown begins.`,
    icon: '/src/assets/Profile Interface-bro.png',
  },
  {
    title: 'Buyer Confirms Item Received with 3-Day Confirmation Window',
    description: `The buyer has 3 days to confirm the item arrived. If confirmed, escrow is released. If disputed, SafeBuy PH steps in to resolve. If no action, funds auto-release to the seller.`,
    icon: '/src/assets/Enthusiastic-pana.png',
  },
];

export function ZigzagCard() {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4 space-y-4">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{
              duration: 0.6,
              delay: index * 0.2,
              ease: 'easeOut',
            }}
          >
            <Card className="relative flex flex-col md:flex-row items-center gap-4 p-4 border-radius-lg bg-white hover:shadow-xl transition-all duration-300 border border-gray-100">
              <CardContent className="flex flex-col md:flex-row items-center gap-4 w-full">
                {index % 2 === 0 ? (
                  <>
                    <motion.span
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.2 + 0.3 }}
                      className="absolute top-4 left-4 bg-[#1eafd0] text-white font-bold rounded-full w-8 h-8 flex items-center justify-center shadow"
                    >
                      {index + 1}
                    </motion.span>
                    <motion.img
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.2 + 0.4 }}
                      src={step.icon}
                      alt={step.title}
                      className="w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 object-contain"
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.2 + 0.5 }}
                      className="w-full md:w-1/2 text-center md:text-left"
                    >
                      <h3 className="text-xl md:text-2xl font-bold mb-2 font-poppins">
                        {step.title}
                      </h3>
                      <p className="text-sm md:text-base text-gray-700 font-sans">
                        {step.description}
                      </p>
                    </motion.div>
                  </>
                ) : (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.2 + 0.5 }}
                      className="w-full md:w-1/2 text-center md:text-left"
                    >
                      <motion.span
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2 + 0.3 }}
                        className="absolute top-4 left-4 bg-[#1eafd0] text-white font-bold rounded-full w-8 h-8 flex items-center justify-center shadow"
                      >
                        {index + 1}
                      </motion.span>
                      <h3 className="text-xl md:text-2xl font-bold mb-2 font-poppins">
                        {step.title}
                      </h3>
                      <p className="text-sm md:text-base text-gray-700 font-sans">
                        {step.description}
                      </p>
                    </motion.div>
                    <motion.img
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.2 + 0.4 }}
                      src={step.icon}
                      alt={step.title}
                      className="w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 object-contain"
                    />
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default ZigzagCard;
