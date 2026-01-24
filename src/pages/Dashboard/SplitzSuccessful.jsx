// pages/SplitzSuccessful.jsx
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { CheckCircle, Calendar, Users, CreditCard } from "lucide-react";
import CheckLast from "../../assets/CheckLast.svg";

function SplitzSuccessful() {
  const navigate = useNavigate();
  const { state } = useLocation();
  
  // ALL DATA PASSED THROUGH NAVIGATION STATE
  const {
    splitId,
    title = "Split Created",
    amount = 0,
    category = "Other",
    paymentMethod = "card",
    paymentDate = new Date().toISOString(),
    participantsNeeded = 1,
    perPersonAmount = 0,
  } = state || {};

  // Security: Prevent direct access without payment completion
  useEffect(() => {
    if (!splitId) {
      navigate("/dashboard", { replace: true });
    }
  }, [splitId, navigate]);

  if (!splitId) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPaymentMethodLabel = (method) => {
    const labels = {
      cards: 'Card Payment',
      transfer: 'Bank Transfer',
      wallet: 'Wallet Payment'
    };
    return labels[method] || method;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* Success Header */}
        <div className="bg-green-600 p-8 text-center">
          <img src={CheckLast} alt="Success" className="w-20 h-20 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">PAYMENT SUCCESSFUL</h1>
          <p className="text-green-100">Your contribution has been recorded</p>
        </div>

        {/* Payment Details */}
        <div className="p-8 space-y-6">
          
          {/* Split Info */}
          <div className="text-center pb-6 border-b border-gray-200">
            <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full mb-3">
              {category}
            </span>
            <h2 className="text-xl font-bold text-gray-900 mb-1">{title}</h2>
            <p className="text-gray-500">Split ID: #{splitId}</p>
          </div>

          {/* Payment Summary */}
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 text-gray-600">
                <CreditCard size={20} />
                <span>Payment Method</span>
              </div>
              <span className="font-semibold text-gray-900">
                {getPaymentMethodLabel(paymentMethod)}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 text-gray-600">
                <Calendar size={20} />
                <span>Date & Time</span>
              </div>
              <span className="font-semibold text-gray-900 text-sm">
                {formatDate(paymentDate)}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 text-gray-600">
                <Users size={20} />
                <span>Participants</span>
              </div>
              <span className="font-semibold text-gray-900">
                You + {participantsNeeded} others
              </span>
            </div>
          </div>

          {/* Amount Paid */}
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center">
            <p className="text-sm text-green-700 mb-1">Amount Paid</p>
            <p className="text-4xl font-bold text-green-800">
              ₦{perPersonAmount.toLocaleString()}
            </p>
            <p className="text-xs text-green-600 mt-2">
              of total ₦{amount.toLocaleString()}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={() => navigate(`/dashboard/split/${splitId}`)}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
            >
              View Split Details
            </button>
            
            <button
              onClick={() => navigate("/dashboard")}
              className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-lg font-semibold transition"
            >
              Back to Dashboard
            </button>
          </div>

          {/* Share Option */}
          <button
            onClick={() => {
              // Copy split link to clipboard
              const link = `${window.location.origin}/split/join/${splitId}`;
              navigator.clipboard.writeText(link);
              alert("Split link copied to clipboard!");
            }}
            className="w-full py-2 text-green-600 hover:text-green-700 text-sm font-medium transition"
          >
            Copy Split Invitation Link
          </button>
        </div>
      </div>
    </div>
  );
}

export default SplitzSuccessful;