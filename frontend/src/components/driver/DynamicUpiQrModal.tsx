import React, { useState } from 'react';
import { X, QrCode, CheckCircle2, ShieldCheck, IndianRupee } from 'lucide-react';
import { Order } from '../../types';

interface Props {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

export const DynamicUpiQrModal: React.FC<Props> = ({
  order,
  isOpen,
  onClose,
  onPaymentSuccess
}) => {
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen || !order) return null;

  const handleConfirmPayment = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onPaymentSuccess();
      onClose();
    }, 1000);
  };

  const upiId = `garuda.logistics@upi`;
  const amount = order.cod_amount_inr || 1450.0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="bg-[#111827] border border-slate-700 w-full max-w-sm rounded-2xl shadow-2xl p-6 text-center">
        <div className="flex justify-between items-center pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <QrCode className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-white text-sm">Dynamic UPI Cashless COD</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4">
          <span className="text-xs text-slate-400">Order #{order.tracking_code}</span>
          <h4 className="text-xl font-extrabold text-white mt-1">₹{amount.toFixed(2)}</h4>
          <span className="text-[11px] text-cyan-400 font-mono">Recipient: {order.customer_name}</span>
        </div>

        {/* Dynamic Mock UPI QR Canvas */}
        <div className="my-5 p-4 bg-white rounded-xl inline-block shadow-inner border border-slate-200">
          <div className="w-48 h-48 bg-slate-900 rounded-lg flex flex-col items-center justify-center p-2 relative overflow-hidden">
            {/* Grid pattern resembling QR */}
            <div className="grid grid-cols-6 gap-1 w-full h-full p-2 opacity-90">
              {Array.from({ length: 36 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`rounded-sm ${
                    i % 2 === 0 || i % 5 === 0 ? 'bg-cyan-400' : 'bg-slate-950'
                  }`} 
                />
              ))}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-slate-950/90 text-cyan-400 border border-cyan-500/50 text-[10px] font-bold px-2 py-1 rounded">
                SCAN & PAY
              </span>
            </div>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 space-y-1 mb-4">
          <p>Scan with GPay, PhonePe, Paytm, or BHIM</p>
          <p className="font-mono text-xs text-slate-300">VPA: {upiId}</p>
        </div>

        <button
          onClick={handleConfirmPayment}
          disabled={isVerifying}
          className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center space-x-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{isVerifying ? 'Reconciling Transaction...' : 'Verify Instant UPI Receipt'}</span>
        </button>
      </div>
    </div>
  );
};
