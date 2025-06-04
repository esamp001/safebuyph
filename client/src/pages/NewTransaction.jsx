import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FilePlus, Facebook } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const ESCROW_FEE_PERCENT = 2; // Example: 2% escrow fee

const NewTransaction = () => {
  const [sellerId, setSellerId] = useState('');
  const [item, setItem] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemImage, setItemImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState('');
  const [escrowFee, setEscrowFee] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('SafeBuyPH Escrow');
  const [buyerConfirmed, setBuyerConfirmed] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [status, setStatus] = useState('');

  // Auto-generate reference/order number on mount
  useEffect(() => {
    setReferenceNumber(uuidv4().slice(0, 8).toUpperCase());
  }, []);

  // Calculate escrow fee and total amount whenever price or quantity changes
  useEffect(() => {
    const subtotal = Number(price) * Number(quantity);
    const fee = subtotal * (ESCROW_FEE_PERCENT / 100);
    setEscrowFee(fee);
    setTotalAmount(subtotal + fee);
  }, [price, quantity]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!buyerConfirmed || !agreedToTerms) {
      setStatus('You must confirm payment and agree to escrow terms.');
      return;
    }
    try {
      await axios.post('/api/transactions', {
        sellerId,
        item,
        itemDescription,
        itemImage,
        quantity,
        price,
        escrowFee,
        totalAmount,
        paymentMethod,
        referenceNumber,
      });
      setStatus('Transaction request sent!');
      // Optionally, redirect to dashboard
    } catch (err) {
      setStatus('Error creating transaction');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Create New Transaction</h2>
        <p className="text-sm text-gray-500">Fill in the details to start a new transaction</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="sellerId" className="text-sm font-medium text-gray-700">
            Seller ID
          </label>
          <Input
            id="sellerId"
            type="text"
            placeholder="Enter seller ID"
            value={sellerId}
            onChange={(e) => setSellerId(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="item" className="text-sm font-medium text-gray-700">
            Item
          </label>
          <Input
            id="item"
            type="text"
            placeholder="Enter item name"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="itemDescription" className="text-sm font-medium text-gray-700">
            Item Description
          </label>
          <textarea
            id="itemDescription"
            placeholder="Describe the item"
            value={itemDescription}
            onChange={(e) => setItemDescription(e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-[#020202] focus:border-transparent bg-white text-gray-900"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="itemImage" className="text-sm font-medium text-gray-700">
            Item Image URL
          </label>
          <Input
            id="itemImage"
            type="text"
            placeholder="Paste image URL"
            value={itemImage}
            onChange={(e) => setItemImage(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
            Quantity
          </label>
          <Input
            id="quantity"
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="price" className="text-sm font-medium text-gray-700">
            Price
          </label>
          <Input
            id="price"
            type="number"
            placeholder="Enter price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="escrowFee" className="text-sm font-medium text-gray-700">
            Escrow Fee ({ESCROW_FEE_PERCENT}%)
          </label>
          <Input id="escrowFee" type="number" value={escrowFee.toFixed(2)} readOnly />
        </div>

        <div className="space-y-2">
          <label htmlFor="totalAmount" className="text-sm font-medium text-gray-700">
            Total Amount
          </label>
          <Input id="totalAmount" type="number" value={totalAmount.toFixed(2)} readOnly />
        </div>

        <div className="space-y-2">
          <label htmlFor="paymentMethod" className="text-sm font-medium text-gray-700">
            Payment Method
          </label>
          <select
            id="paymentMethod"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded-md bg-white text-gray-900"
          >
            <option value="SafeBuyPH Escrow">SafeBuyPH Escrow</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="buyerConfirmed" className="text-sm font-medium text-gray-700">
            Buyer's Payment Confirmation
          </label>
          <div className="flex items-center space-x-2">
            <input
              id="buyerConfirmed"
              type="checkbox"
              checked={buyerConfirmed}
              onChange={(e) => setBuyerConfirmed(e.target.checked)}
              required
              className="accent-[#1eafd0] bg-white"
            />
            <label htmlFor="buyerConfirmed" className="text-sm text-gray-700">
              I confirm I will pay via SafeBuyPH escrow.
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="agreedToTerms" className="text-sm font-medium text-gray-700">
            Escrow Terms & Agreement
          </label>
          <div className="flex items-center space-x-2">
            <input
              id="agreedToTerms"
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              required
              className="accent-[#1eafd0] bg-white"
            />
            <label htmlFor="agreedToTerms" className="text-sm text-gray-700">
              I agree to the{' '}
              <a href="/terms" className="underline" target="_blank" rel="noopener noreferrer">
                escrow terms & agreement
              </a>
              .
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="referenceNumber" className="text-sm font-medium text-gray-700">
            Reference/Order Number
          </label>
          <Input id="referenceNumber" type="text" value={referenceNumber} readOnly />
        </div>
      </div>

      <Button type="submit" className="w-full bg-[#1eafd0] hover:bg-[#1eafd0]/90">
        Send Transaction
      </Button>

      {status && (
        <div
          className={`p-3 rounded-md text-sm ${
            status.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
          }`}
        >
          {status}
        </div>
      )}
    </form>
  );
};

export default NewTransaction;
