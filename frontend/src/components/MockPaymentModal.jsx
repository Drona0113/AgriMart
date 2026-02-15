import { useState, useEffect } from 'react';
import { X, CreditCard, Smartphone, Building, Lock, CheckCircle2, Loader2 } from 'lucide-react';

const MockPaymentModal = ({ isOpen, onClose, onSuccess, amount }) => {
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState('payment'); // payment | processing | success
  const [activeTab, setActiveTab] = useState('card'); // card | upi | netbanking

  useEffect(() => {
    if (isOpen) {
      setStep('payment');
      setProcessing(false);
      setActiveTab('card');
    }
  }, [isOpen]);

  const handlePay = () => {
    setProcessing(true);
    setStep('processing');
    
    // Simulate network delay
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
        
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-green-600 text-white p-1 rounded">
              <Lock size={16} />
            </div>
            <span className="font-bold text-gray-700">AgriMart Secure Pay</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'payment' && (
            <>
              <div className="mb-6 text-center">
                <p className="text-gray-500 text-sm mb-1">Total Amount</p>
                <h2 className="text-3xl font-black text-gray-900">₹{amount}</h2>
              </div>

              {/* Payment Methods Tabs */}
              <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-lg">
                <button 
                  onClick={() => setActiveTab('card')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
                    activeTab === 'card' 
                      ? 'bg-white shadow-sm text-green-700 font-bold' 
                      : 'text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  <CreditCard size={16} /> Card
                </button>
                <button 
                  onClick={() => setActiveTab('upi')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
                    activeTab === 'upi' 
                      ? 'bg-white shadow-sm text-green-700 font-bold' 
                      : 'text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  <Smartphone size={16} /> UPI
                </button>
                <button 
                  onClick={() => setActiveTab('netbanking')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
                    activeTab === 'netbanking' 
                      ? 'bg-white shadow-sm text-green-700 font-bold' 
                      : 'text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  <Building size={16} /> NetBanking
                </button>
              </div>

              {/* Payment Forms */}
              <div className="space-y-4 min-h-[200px]">
                
                {/* CARD FORM */}
                {activeTab === 'card' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Card Number</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          defaultValue="4111 1111 1111 1111"
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none font-mono text-gray-600"
                          readOnly
                        />
                        <CreditCard className="absolute left-3 top-3.5 text-gray-400" size={18} />
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Expiry</label>
                        <input 
                          type="text" 
                          defaultValue="12/25"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none font-mono text-gray-600"
                          readOnly
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">CVV</label>
                        <input 
                          type="password" 
                          defaultValue="123"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none font-mono text-gray-600"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* UPI FORM */}
                {activeTab === 'upi' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Enter UPI ID</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="username@upi"
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none font-mono text-gray-600"
                        />
                        <Smartphone className="absolute left-3 top-3.5 text-gray-400" size={18} />
                      </div>
                      <p className="text-xs text-gray-400 mt-2 ml-1">
                        Examples: phonepe@ybl, gpay@okaxis
                      </p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                      <p className="text-xs text-green-700">
                        <strong>Note:</strong> Since this is a mock payment, you can enter any ID or leave it blank.
                      </p>
                    </div>
                  </div>
                )}

                {/* NETBANKING FORM */}
                {activeTab === 'netbanking' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Select Bank</label>
                      <div className="relative">
                        <select 
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-600 appearance-none bg-white"
                        >
                          <option>State Bank of India</option>
                          <option>HDFC Bank</option>
                          <option>ICICI Bank</option>
                          <option>Axis Bank</option>
                          <option>Kotak Mahindra Bank</option>
                        </select>
                        <Building className="absolute left-3 top-3.5 text-gray-400" size={18} />
                      </div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                      <p className="text-xs text-green-700">
                        <strong>Note:</strong> You will be redirected to the bank's page (Simulated).
                      </p>
                    </div>
                  </div>
                )}

              </div>

              {/* Pay Button */}
              <div className="pt-4">
                <button 
                  onClick={handlePay}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-200 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  Pay ₹{amount}
                </button>
                <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
                  <Lock size={10} /> 100% Secure Transaction (Simulated)
                </p>
              </div>
            </>
          )}

          {step === 'processing' && (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <Loader2 className="animate-spin text-green-600 mb-4" size={48} />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Processing Payment...</h3>
              <p className="text-gray-500">Please do not close this window</p>
            </div>
          )}

          {step === 'success' && (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="bg-green-100 p-4 rounded-full mb-4">
                <CheckCircle2 className="text-green-600" size={48} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
              <p className="text-gray-500">Redirecting to order confirmation...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MockPaymentModal;
