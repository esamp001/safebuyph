import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqData = [
  {
    question: 'What is SafeBuyPH?',
    answer:
      'SafeBuyPH is a secure escrow service platform that protects both buyers and sellers during online transactions in the Philippines. We hold the payment until the buyer confirms receipt of the item, ensuring a safe and trustworthy marketplace experience.',
  },
  {
    question: 'How does the escrow service work?',
    answer:
      'When you make a purchase through SafeBuyPH, the payment is held securely in our escrow account. Once you receive and verify the item, you can release the payment to the seller. If there are any issues, our dispute resolution team will help resolve the matter fairly.',
  },
  {
    question: 'Is SafeBuyPH free to use?',
    answer:
      'SafeBuyPH charges a small service fee for each successful transaction. The fee is calculated as a percentage of the transaction amount and is clearly displayed before you complete your purchase.',
  },
  {
    question: 'How long does the escrow process take?',
    answer:
      'The escrow process typically takes 3-5 business days from the time of payment to the release of funds, depending on shipping times and buyer confirmation. We work to make the process as quick and efficient as possible while maintaining security.',
  },
  {
    question: "What happens if there's a dispute?",
    answer:
      "If there's a dispute between buyer and seller, our dedicated support team will investigate the case. We'll review all communication, shipping information, and evidence provided by both parties to reach a fair resolution.",
  },
];

const FAQ = () => {
  return (
    <div className="container px-4 md:px-6 bg-[#f5f5f5]">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-poppins">
            Frequently Asked Questions
          </h2>
          <p className="max-w-[900px] font-poppins text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            Find answers to common questions about our escrow service
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-3xl mt-8">
        <Accordion type="single" collapsible defaultValue="item-0" className="w-full">
          {faqData.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-poppins">{faq.question}</AccordionTrigger>
              <AccordionContent className="px-4 py-2">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default FAQ;
