import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { FilePlus, Facebook, X, Edit2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FaFacebook } from 'react-icons/fa';
import { Steps } from '@/components/ui/steps';
import { Card } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';

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
  const [marketplaceUrl, setMarketplaceUrl] = useState('');
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [urlError, setUrlError] = useState('');
  const [showFacebookLogin, setShowFacebookLogin] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    image: '',
    // ... other form fields
  });
  const [showImportModal, setShowImportModal] = useState(false);
  const [importUrl, setImportUrl] = useState('');
  // Add new state variables for edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [editedFields, setEditedFields] = useState({
    item: false,
    price: false,
    description: false,
    image: false,
  });
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  console.log('Location:', location);
  console.log('Search params:', location.search);

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

  useEffect(() => {
    // Parse the data from URL
    const params = new URLSearchParams(location.search);
    const dataParam = params.get('data');

    console.log('URL params:', location.search);
    console.log('Data param:', dataParam);

    if (dataParam) {
      try {
        const importedData = JSON.parse(decodeURIComponent(dataParam));
        console.log('Parsed imported data:', importedData);

        // Update form fields with imported data
        if (importedData.title) {
          console.log('Setting title:', importedData.title);
          setItem(importedData.title);
        }
        if (importedData.price) {
          // Format price to remove any non-numeric characters
          const cleanPrice = importedData.price.replace(/[^0-9.]/g, '');
          console.log('Setting price:', cleanPrice);
          setPrice(cleanPrice);
        }
        if (importedData.description) {
          // Clean up description
          const cleanDescription = importedData.description.replace(/\n+/g, '\n').trim();
          console.log('Setting description:', cleanDescription);
          setItemDescription(cleanDescription);
        }
        if (importedData.image) {
          console.log('Setting image:', importedData.image);
          setItemImage(importedData.image);
        }
        if (importedData.url) {
          console.log('Setting marketplace URL:', importedData.url);
          setMarketplaceUrl(importedData.url);
        }

        // Clear the URL parameter to prevent re-importing
        const newUrl = '/transaction/new';
        window.history.replaceState({}, '', newUrl);
        console.log('URL cleared, new URL:', newUrl);
      } catch (error) {
        console.error('Error parsing imported data:', error);
        console.error('Raw data param:', dataParam);
      }
    }
  }, [location]);

  // Add a debug effect to monitor state changes
  useEffect(() => {
    console.log('Form state updated:', {
      item,
      price,
      itemDescription,
      itemImage,
      marketplaceUrl,
    });
  }, [item, price, itemDescription, itemImage, marketplaceUrl]);

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

  const handleMarketplaceUrlChange = async (e) => {
    const url = e.target.value;
    setMarketplaceUrl(url);
    setUrlError('');

    if (!url) return;

    if (url.includes('facebook.com/marketplace')) {
      setIsLoadingData(true);
      try {
        // First check if we have a Facebook token
        const response = await axios.get('/api/auth/facebook-token');
        const { hasToken } = response.data;

        if (!hasToken) {
          setShowFacebookLogin(true);
          return;
        }

        // If we have a token, try to extract the data
        const extractResponse = await axios.post('/api/marketplace/extract', { url });
        const data = extractResponse.data;

        // Validate the extracted data
        if (!data.title && !data.price) {
          throw new Error('No data could be extracted from the URL');
        }

        // Update all fields with the extracted data
        if (data.image) setItemImage(data.image);
        if (data.title) setItem(data.title);
        if (data.description) setItemDescription(data.description);
        if (data.price) setPrice(data.price);

        setUrlError('');
      } catch (error) {
        console.error('Error details:', error.response?.data || error.message);

        if (error.response?.status === 401) {
          setShowFacebookLogin(true);
        } else {
          setUrlError(
            error.response?.data?.message ||
              'Could not extract data from URL. Please try again or enter the details manually.'
          );
        }
      } finally {
        setIsLoadingData(false);
      }
    }
  };

  // Add this effect to retry URL extraction after Facebook login
  useEffect(() => {
    const checkStoredUrl = async () => {
      try {
        const response = await axios.get('/api/marketplace/get-stored-url');
        const { url } = response.data;
        if (url) {
          // Add a small delay to ensure the Facebook token is available
          setTimeout(() => {
            handleMarketplaceUrlChange({ target: { value: url } });
          }, 1000);
        }
      } catch (error) {
        console.error('Failed to retrieve stored URL:', error);
      }
    };

    checkStoredUrl();
  }, []);

  const clearMarketplaceData = () => {
    setMarketplaceUrl('');
    setItemImage('');
    setItem('');
    setItemDescription('');
    setPrice('');
    setUrlError('');
  };

  // Add this function to handle direct URL import
  const handleDirectImport = async (url) => {
    if (!url.includes('facebook.com/marketplace')) {
      setUrlError('Please enter a valid Facebook Marketplace URL');
      return;
    }

    setIsLoadingData(true);
    try {
      const response = await axios.post('/api/marketplace/extract', { url });
      const data = response.data;

      if (data.title) setItem(data.title);
      if (data.price) setPrice(data.price);
      if (data.description) setItemDescription(data.description);
      if (data.image) setItemImage(data.image);

      setUrlError('');
    } catch (error) {
      setUrlError(error.response?.data?.error || 'Failed to import data');
    } finally {
      setIsLoadingData(false);
    }
  };

  // Add new function to handle field editing
  const handleFieldEdit = (field) => {
    setEditedFields((prev) => ({
      ...prev,
      [field]: true,
    }));
    setIsEditing(true);
  };

  // Add new function to handle field save
  const handleFieldSave = (field) => {
    setEditedFields((prev) => ({
      ...prev,
      [field]: false,
    }));
    setIsEditing(false);
  };

  // // For displaying the price
  // <div className="flex justify-between mb-2">
  //   <span>Subtotal:</span>
  //   <span>₱{formatPrice(Number(price) * Number(quantity))}</span>
  // </div>
  // <div className="flex justify-between mb-2">
  //   <span>Escrow Fee ({ESCROW_FEE_PERCENT}%):</span>
  //   <span>₱{formatPrice(escrowFee)}</span>
  // </div>
  // <div className="flex justify-between font-semibold">
  //   <span>Total Amount:</span>
  //   <span>₱{formatPrice(totalAmount)}</span>
  // </div>

  // For the price input, you can add an onChange handler that formats the display
  // but keeps the raw number in state
  const handlePriceChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setPrice(value);
  };

  // Step 1: Item Details
  const ItemDetailsStep = () => (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Item Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Item Name</label>
              <Input
                value={item}
                onChange={(e) => setItem(e.target.value)}
                placeholder="Enter item name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Price</label>
              <Input
                value={formatPrice(price)}
                onChange={handlePriceChange}
                placeholder="Enter price"
                type="text"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Quantity</label>
              <Input
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                type="number"
                min="1"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Item Description</label>
              <textarea
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
                className="w-full min-h-[100px] p-2 border rounded-md bg-white"
                placeholder="Manually enter item description"
              />
            </div>
            <div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Item Image URL</label>
                <Input
                  value={itemImage}
                  onChange={(e) => setItemImage(e.target.value)}
                  placeholder="Enter image URL"
                />
                {itemImage && (
                  <div className="mt-2">
                    <img
                      src={itemImage}
                      alt="Item preview"
                      className="w-full h-48 object-contain rounded-lg border"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/400x300?text=Invalid+Image+URL';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  // Step 2: Payment Details
  const PaymentDetailsStep = () => (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Payment Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between mb-2">
                <span>Subtotal:</span>
                <span>₱{formatPrice(Number(price) * Number(quantity))}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Escrow Fee ({ESCROW_FEE_PERCENT}%):</span>
                <span>₱{formatPrice(escrowFee)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total Amount:</span>
                <span>₱{formatPrice(totalAmount)}</span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="SafeBuyPH Escrow">SafeBuyPH Escrow</option>
                {/* Add other payment methods */}
              </select>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Reference Number</label>
              <Input value={referenceNumber} readOnly />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox checked={buyerConfirmed} onCheckedChange={setBuyerConfirmed} />
              <label>I confirm that I will pay the total amount</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox checked={agreedToTerms} onCheckedChange={setAgreedToTerms} />
              <label>I agree to the escrow terms and conditions</label>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  // Step 3: Review and Submit
  const ReviewStep = () => (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Review Transaction</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-medium">Item Information</h3>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Name:</span> {item}
              </p>
              <p>
                <span className="font-medium">Price:</span> ₱{price}
              </p>
              <p>
                <span className="font-medium">Quantity:</span> {quantity}
              </p>
              <p>
                <span className="font-medium">Description:</span> {itemDescription}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-medium">Payment Information</h3>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Total Amount:</span> ₱{totalAmount}
              </p>
              <p>
                <span className="font-medium">Payment Method:</span> {paymentMethod}
              </p>
              <p>
                <span className="font-medium">Reference Number:</span> {referenceNumber}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">New Transaction</h1>
        <p className="text-gray-600">Create a new escrow transaction</p>
      </div>

      <Steps
        currentStep={currentStep}
        totalSteps={totalSteps}
        steps={[
          { title: 'Item Details', description: 'Enter item information' },
          { title: 'Payment Details', description: 'Review payment information' },
          { title: 'Review', description: 'Confirm transaction' },
        ]}
      />

      <div className="mt-8">
        {currentStep === 1 && <ItemDetailsStep />}
        {currentStep === 2 && <PaymentDetailsStep />}
        {currentStep === 3 && <ReviewStep />}
      </div>

      <div className="mt-8 flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(currentStep - 1)}
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        <Button
          onClick={() => {
            if (currentStep === totalSteps) {
              handleSubmit();
            } else {
              setCurrentStep(currentStep + 1);
            }
          }}
        >
          {currentStep === totalSteps ? 'Submit Transaction' : 'Next'}
        </Button>
      </div>
    </div>
  );
};

export default NewTransaction;
