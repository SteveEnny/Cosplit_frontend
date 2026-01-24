// pages/PaymentPage.jsx
import { useState } from 'react';
import { ChevronLeft, Check, Copy, MapPin, Calendar, Users } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // ALL DATA COMES FROM CREATE SPLIT PAGE - NO EXTERNAL API CALLS
  const splitData = location.state || {};
  
  // Destructure all data passed from CreateSplitzPage
  const {
    splitId,
    title = "Untitled Split",
    amount = 0,
    category = "Other",
    location: splitLocation = "",
    startDate = "",
    endDate = "",
    participantsNeeded = 1,
    includeCreator = true,
    perPersonAmount = 0,
    imageUrl = "",
    rules = "",
    splitMethod = "SpecificAmounts",
  } = splitData;

  // Redirect if no data (user accessed directly without creating split)
  if (!splitId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4">No Split Data Found</h2>
          <p className="text-gray-600 mb-6">Please create a split first to proceed to payment.</p>
          <button
            onClick={() => navigate("/dashboard/create-split")}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
          >
            Create New Split
          </button>
        </div>
      </div>
    );
  }

  const [paymentMethod, setPaymentMethod] = useState('cards');
  const [cardType, setCardType] = useState('debit');
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    saveCard: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const paymentMethods = [
    { id: 'cards', label: 'Cards', icon: '💳' },
    { id: 'transfer', label: 'Transfer', icon: '💸' },
    { id: 'wallet', label: 'Wallet', icon: '👛' },
  ];

  const cardOptions = [
    { id: 'debit', label: 'Debit card', icon: '✓' },
    { id: 'credit', label: 'Credit card', icon: '☐' },
  ];

  // Handle payment success - navigate to success page with data
  const handlePaymentSuccess = () => {
    setIsLoading(true);
    
    // Simulate payment processing (replace with actual payment gateway if needed)
    setTimeout(() => {
      setIsLoading(false);
      
      // Navigate to success page with all split data
      navigate("/dashboard/split-success", {
        state: {
          splitId,
          title,
          amount,
          category,
          paymentMethod,
          paymentDate: new Date().toISOString(),
          participantsNeeded,
          perPersonAmount,
        },
        replace: true, // Prevent back button to payment
      });
    }, 1500);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const totalParticipants = participantsNeeded + (includeCreator ? 1 : 0);

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 lg:px-8 py-6">
      <main className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <Header title="Payment" onBack={() => navigate(-1)} />

        {/* Split Summary Card - ALL DATA FROM CREATE SPLIT */}
        <SplitSummaryCard 
          title={title}
          category={category}
          amount={amount}
          location={splitLocation}
          startDate={formatDate(startDate)}
          endDate={formatDate(endDate)}
          participantsNeeded={participantsNeeded}
          totalParticipants={totalParticipants}
          perPersonAmount={perPersonAmount}
          imageUrl={imageUrl}
          splitMethod={splitMethod}
        />

        {/* Cost Summary */}
        <CostSummary 
          total={amount}
          perPerson={perPersonAmount}
          participants={totalParticipants}
        />

        {/* Payment Method Tabs */}
        <PaymentTabs
          paymentMethods={paymentMethods}
          selected={paymentMethod}
          onSelect={setPaymentMethod}
        />

        {/* Payment Method Forms */}
        {paymentMethod === 'cards' && (
          <CardsPayment
            cardType={cardType}
            setCardType={setCardType}
            formData={formData}
            handleInputChange={handleInputChange}
            setFormData={setFormData}
            cardOptions={cardOptions}
          />
        )}

        {paymentMethod === 'transfer' && (
          <BankTransfer 
            amount={perPersonAmount} 
            splitId={splitId}
            accountNumber="1234567890"
            bankName="First Bank Nigeria"
            accountName="Cosplitz Ltd"
          />
        )}

        {paymentMethod === 'wallet' && (
          <WalletPayment 
            amount={perPersonAmount}
            walletBalance={5500} // This could also come from user context/state
          />
        )}

        {/* Rules Display */}
        {rules && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-800 text-sm mb-2">Split Rules</h4>
            <p className="text-sm text-yellow-700">{rules}</p>
          </div>
        )}

        {/* Make Payment Button */}
        <button 
          onClick={handlePaymentSuccess} 
          disabled={isLoading}
          className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? "Processing Payment..." : `Pay ₦${perPersonAmount.toLocaleString()}`}
        </button>

        {/* Security Info */}
        <div className="mt-4 p-4 bg-gray-100 rounded-lg text-center">
          <p className="text-xs text-gray-600">
            🔒 Your payment information is encrypted and secure. Split ID: {splitId}
          </p>
        </div>
      </main>
    </div>
  );
};

/* ================== Components ================== */

const Header = ({ title, onBack }) => (
  <div>
    <button 
      onClick={onBack}
      className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium mb-4"
    >
      <ChevronLeft size={20} /> Back to Split Details
    </button>
    <h1 className="text-3xl font-bold text-gray-900 text-center">{title}</h1>
    <p className="text-center text-gray-500 mt-2">Complete your contribution</p>
  </div>
);

const SplitSummaryCard = ({ 
  title, 
  category, 
  amount, 
  location, 
  startDate, 
  endDate, 
  participantsNeeded, 
  totalParticipants,
  perPersonAmount,
  imageUrl,
  splitMethod
}) => (
  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
    <div className="flex gap-4">
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-20 h-20 object-cover rounded-lg"
        />
      )}
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <span className="inline-block px-2 py-1 bg-green-200 text-green-800 text-xs font-semibold rounded-full mb-2">
              {category}
            </span>
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-xl font-bold text-green-700">₦{amount.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin size={16} />
            <span className="truncate">{location}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar size={16} />
            <span>{startDate} - {endDate}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Users size={16} />
            <span>{participantsNeeded} needed + you = {totalParticipants} total</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <span className="font-medium">Method:</span>
            <span>{splitMethod === 'SpecificAmounts' ? 'Equal Split' : 'Custom Split'}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const CostSummary = ({ total, perPerson, participants }) => (
  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 space-y-4">
    <div className="flex items-center justify-between">
      <span className="text-gray-700 font-medium">Total Split Amount</span>
      <span className="text-xl font-bold text-gray-900">₦{total.toLocaleString()}</span>
    </div>
    <div className="h-px bg-gray-300" />
    <div className="flex items-center justify-between">
      <span className="text-gray-700 font-medium">Number of Participants</span>
      <span className="text-lg font-semibold text-gray-900">{participants}</span>
    </div>
    <div className="h-px bg-gray-300" />
    <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
      <span className="text-green-800 font-semibold">Your Contribution</span>
      <span className="text-2xl font-bold text-green-700">₦{perPerson.toLocaleString()}</span>
    </div>
  </div>
);

const PaymentTabs = ({ paymentMethods, selected, onSelect }) => (
  <div>
    <div className="flex items-center justify-center gap-8 mb-4">
      <div className="h-px flex-1 bg-gray-300" />
      <span className="font-semibold text-gray-700">Pay With</span>
      <div className="h-px flex-1 bg-gray-300" />
    </div>
    <div className="flex gap-4 justify-evenly mb-6 border p-1 rounded-md border-gray-300">
      {paymentMethods.map(method => (
        <button
          key={method.id}
          onClick={() => onSelect(method.id)}
          className={`px-6 py-2 rounded-full font-medium transition-all ${
            selected === method.id
              ? 'bg-gray-800 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <span className="mr-2">{method.icon}</span>
          {method.label}
        </button>
      ))}
    </div>
  </div>
);

const CardsPayment = ({ cardType, setCardType, formData, handleInputChange, setFormData, cardOptions }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center w-full gap-4 mb-4">
      {cardOptions.map(option => (
        <button
          key={option.id}
          onClick={() => setCardType(option.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition flex-1 ${
            cardType === option.id
              ? 'border-green-600 bg-green-50'
              : 'border-gray-300 bg-white hover:border-gray-400'
          }`}
        >
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
            cardType === option.id ? 'bg-green-600 border-green-600' : 'border-gray-400'
          }`}>
            {cardType === option.id && <Check size={16} className="text-white" />}
          </div>
          <span className={`font-medium ${cardType === option.id ? 'text-gray-900' : 'text-gray-700'}`}>
            {option.label}
          </span>
        </button>
      ))}
    </div>

    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900">Card Information</h3>
      <InputField 
        label="Card Number" 
        name="cardNumber" 
        value={formData.cardNumber} 
        onChange={handleInputChange} 
        placeholder="0000 0000 0000 0000" 
      />
      <div className="grid grid-cols-2 gap-4">
        <InputField 
          label="Expiry Date" 
          name="expiryDate" 
          value={formData.expiryDate} 
          onChange={handleInputChange} 
          placeholder="MM/YY" 
        />
        <InputField 
          label="CVV" 
          name="cvv" 
          value={formData.cvv} 
          onChange={handleInputChange} 
          placeholder="123" 
        />
      </div>
      <CheckboxField 
        label="Save this card for future payments" 
        checked={formData.saveCard} 
        onChange={(e) => setFormData(prev => ({ ...prev, saveCard: e.target.checked }))} 
      />
    </div>
  </div>
);

const InputField = ({ label, name, value, onChange, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
    />
  </div>
);

const CheckboxField = ({ label, checked, onChange }) => (
  <div className="flex items-center gap-3 pt-2">
    <input 
      type="checkbox" 
      checked={checked} 
      onChange={onChange} 
      className="w-4 h-4 accent-green-600 rounded cursor-pointer" 
    />
    <label className="text-sm text-gray-600 cursor-pointer">{label}</label>
  </div>
);

const BankTransfer = ({ amount, splitId, accountNumber, bankName, accountName }) => (
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
    <h3 className="font-semibold text-blue-900 mb-2">Bank Transfer Details</h3>
    
    <div className="bg-white p-4 rounded-lg border border-blue-200">
      <p className="text-sm text-gray-600 mb-1">Amount to Transfer</p>
      <p className="text-3xl font-bold text-blue-900">₦{amount.toLocaleString()}</p>
    </div>

    <div className="space-y-3">
      <TransferRow label="Bank Name" value={bankName} />
      <TransferRow label="Account Number" value={accountNumber} />
      <TransferRow label="Account Name" value={accountName} />
      <TransferRow label="Reference" value={`SPLIT-${splitId}`} isImportant={true} />
    </div>

    <div className="p-3 bg-yellow-100 rounded border border-yellow-300">
      <p className="text-sm text-yellow-800">
        <strong>Important:</strong> Use <code className="bg-yellow-200 px-1 rounded">SPLIT-{splitId}</code> as your transfer reference. 
        Transfer valid for 30 minutes.
      </p>
    </div>
  </div>
);

const TransferRow = ({ label, value, isImportant = false }) => (
  <div className="flex items-center justify-between p-3 bg-white rounded border border-blue-200">
    <span className="text-gray-700 text-sm">{label}</span>
    <div className="flex items-center gap-2">
      <span className={`font-mono font-semibold ${isImportant ? 'text-blue-700 text-lg' : 'text-gray-900'}`}>
        {value}
      </span>
      <button 
        onClick={() => navigator.clipboard.writeText(value)}
        className="p-1 hover:bg-gray-100 rounded transition"
        title="Copy to clipboard"
      >
        <Copy size={16} className="text-blue-600" />
      </button>
    </div>
  </div>
);

const WalletPayment = ({ amount, walletBalance }) => {
  const hasEnoughBalance = walletBalance >= amount;
  const shortfall = amount - walletBalance;

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-6 space-y-4">
      <h3 className="font-semibold text-green-900 mb-2">Cosplitz Wallet</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded border border-green-200">
          <p className="text-sm text-gray-600 mb-1">Wallet Balance</p>
          <p className={`text-2xl font-bold ${hasEnoughBalance ? 'text-green-600' : 'text-red-600'}`}>
            ₦{walletBalance.toLocaleString()}
          </p>
        </div>
        <div className="p-4 bg-white rounded border border-green-200">
          <p className="text-sm text-gray-600 mb-1">Required Amount</p>
          <p className="text-2xl font-bold text-gray-900">₦{amount.toLocaleString()}</p>
        </div>
      </div>

      {!hasEnoughBalance ? (
        <div className="space-y-3">
          <div className="p-3 bg-red-100 rounded border border-red-300">
            <p className="text-sm text-red-800">
              Insufficient balance. You need <strong>₦{shortfall.toLocaleString()}</strong> more.
            </p>
          </div>
          <button className="w-full py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700">
            Top Up Wallet
          </button>
        </div>
      ) : (
        <div className="p-3 bg-green-100 rounded border border-green-300">
          <p className="text-sm text-green-800">
            ✓ Sufficient balance available. Click "Make Payment" to complete your contribution.
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;