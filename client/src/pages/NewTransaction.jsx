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

  return (
    <div className="container mx-auto px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg"
      >
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">Create New Transaction</h2>
          <p className="text-sm text-gray-500">Fill in the details to start a new transaction</p>
        </div>

        <div className="space-y-4 border-b pb-4">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              onClick={() => setShowImportModal(true)}
              className="flex-1 flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#166FE5] text-white"
            >
              <FaFacebook className="w-5 h-5" />
              Import from Facebook
            </Button>
            <Button
              type="button"
              onClick={() => {
                // Open extension installation page if not installed
                window.open(
                  'https://chrome.google.com/webstore/detail/safebuy-ph-helper/your-extension-id',
                  '_blank'
                );
              }}
              className="flex-1 flex items-center justify-center gap-2 bg-[#1eafd0] hover:bg-[#0b92bc] text-white"
            >
              <FaFacebook className="w-5 h-5" />
              Use Extension
            </Button>
          </div>
          <p className="text-xs text-gray-500 text-center">
            Use the extension for faster imports or paste the URL directly
          </p>
        </div>

        <div className="space-y-2 border-b pb-4">
          <label htmlFor="marketplaceUrl" className="text-sm font-medium text-gray-700">
            Facebook Marketplace URL
          </label>
          <div className="space-y-2">
            <Input
              id="marketplaceUrl"
              type="text"
              placeholder="Paste Facebook Marketplace URL to auto-fill details"
              value={marketplaceUrl}
              onChange={handleMarketplaceUrlChange}
              className="w-full"
            />
            {isLoadingData && <div className="text-sm text-gray-500">Loading data from URL...</div>}
            {urlError && <div className="text-sm text-red-500">{urlError}</div>}
          </div>
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
            <div className="flex items-center gap-2">
              <Input
                id="item"
                type="text"
                placeholder="Enter item name"
                value={item}
                onChange={(e) => setItem(e.target.value)}
                readOnly={!!marketplaceUrl}
                required
                className={`flex-1 ${editedFields.item ? 'border-blue-500' : ''}`}
                disabled={!editedFields.item}
              />
              {!editedFields.item ? (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleFieldEdit('item')}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleFieldSave('item')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="itemDescription" className="text-sm font-medium text-gray-700">
              Item Description
            </label>
            <div className="flex items-center gap-2">
              <textarea
                id="itemDescription"
                placeholder="Describe the item"
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-[#020202] focus:border-transparent bg-white text-gray-900 ${editedFields.description ? 'border-blue-500' : ''}`}
                readOnly={!!marketplaceUrl}
                required
                disabled={!editedFields.description}
              />
              {!editedFields.description ? (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleFieldEdit('description')}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleFieldSave('description')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="itemImage" className="text-sm font-medium text-gray-700">
              Item Image URL
            </label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Input
                  id="itemImage"
                  type="text"
                  placeholder="Paste image URL"
                  value={itemImage}
                  onChange={(e) => setItemImage(e.target.value)}
                  readOnly={!!marketplaceUrl}
                  className={`flex-1 ${editedFields.image ? 'border-blue-500' : ''}`}
                  disabled={!editedFields.image}
                />
                {!editedFields.image ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleFieldEdit('image')}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleFieldSave('image')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {itemImage && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={itemImage}
                    alt="Item preview"
                    className="w-full h-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={clearMarketplaceData}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              )}
            </div>
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
            <div className="flex items-center gap-2">
              <Input
                id="price"
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                readOnly={!!marketplaceUrl}
                required
                className={`flex-1 ${editedFields.price ? 'border-blue-500' : ''}`}
                disabled={!editedFields.price}
              />
              {!editedFields.price ? (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleFieldEdit('price')}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleFieldSave('price')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
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
              <Checkbox
                id="buyerConfirmed"
                checked={buyerConfirmed}
                onCheckedChange={(checked) => setBuyerConfirmed(checked)}
                required
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
              <Checkbox
                id="agreedToTerms"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked)}
                required
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

        <Dialog open={showFacebookLogin} onOpenChange={setShowFacebookLogin}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Connect with Facebook</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-gray-500 mb-4">
              To extract data from Facebook Marketplace, you need to connect your Facebook account.
            </p>
            <Button
              type="button"
              onClick={async () => {
                try {
                  if (!marketplaceUrl) {
                    setUrlError('Please enter a Facebook Marketplace URL first');
                    return;
                  }

                  // Store the URL in the session via a POST request
                  const response = await axios.post('/api/marketplace/store-url', {
                    url: marketplaceUrl,
                  });

                  if (response.data.success) {
                    // Redirect to Facebook auth with return URL
                    const returnUrl = encodeURIComponent(window.location.href);
                    window.location.href = `http://localhost:3000/api/auth/facebook?returnTo=${returnUrl}`;
                  }
                } catch (error) {
                  console.error('Failed to store URL:', error);
                  setUrlError(
                    error.response?.data?.error ||
                      error.response?.data?.details ||
                      'Failed to process URL. Please try again.'
                  );
                }
              }}
              className="w-full flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#166FE5] text-white"
            >
              <FaFacebook className="w-5 h-5" />
              Connect with Facebook
            </Button>
          </DialogContent>
        </Dialog>

        <Dialog open={showImportModal} onOpenChange={setShowImportModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Import from Facebook Marketplace</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Paste the Facebook Marketplace listing URL to import item details
              </p>
              <Input
                type="text"
                placeholder="Paste Facebook Marketplace URL"
                value={importUrl}
                onChange={(e) => setImportUrl(e.target.value)}
              />
              {urlError && <div className="text-sm text-red-500">{urlError}</div>}
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={() => handleDirectImport(importUrl)}
                  className="flex-1 bg-[#1877F2] hover:bg-[#166FE5] text-white"
                  disabled={isLoadingData}
                >
                  {isLoadingData ? 'Importing...' : 'Import'}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setShowImportModal(false);
                    setImportUrl('');
                  }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </form>
    </div>
  );
};

export default NewTransaction;
