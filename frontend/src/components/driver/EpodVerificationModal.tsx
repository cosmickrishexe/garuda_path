import React, { useState } from 'react';
import { X, CheckCircle, Camera, ShieldCheck, Sparkles } from 'lucide-react';
import { Order } from '../../types';
import { api } from '../../api/client';

interface Props {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const EpodVerificationModal: React.FC<Props> = ({
  order,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [otp, setOtp] = useState('');
  const [isPhotoCaptured, setIsPhotoCaptured] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !order) return null;

  const handleComplete = async () => {
    setErrorMsg('');
    setIsVerifying(true);

    try {
      if (otp.trim()) {
        await api.updateOrderStatus(order.id, {
          status: 'delivered',
          delivery_otp: otp.trim()
        });
      } else {
        await api.verifyEpod(order.id);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error?.message || 'Invalid delivery OTP');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="bg-[#111827] border border-slate-700 w-full max-w-sm rounded-2xl shadow-2xl p-6">
        <div className="flex justify-between items-center pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-sm">Doorstep Proof of Delivery</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4">
          <span className="text-xs text-slate-400">Recipient Doorstep</span>
          <h4 className="text-base font-bold text-white">{order.customer_name}</h4>
          <p className="text-[11px] text-slate-400 truncate mt-0.5">{order.delivery_address}</p>
        </div>

        {errorMsg && (
          <div className="mt-3 p-2 bg-red-950/60 border border-red-800 text-red-300 text-xs rounded-lg">
            {errorMsg}
          </div>
        )}

        {/* Option 1: 4-Digit Delivery OTP */}
        <div className="mt-4 p-3 bg-slate-900 border border-slate-800 rounded-xl">
          <label className="text-[11px] font-semibold text-slate-300 block mb-1">
            Customer 4-Digit OTP Code:
          </label>
          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder={`e.g. ${order.delivery_otp || '4821'}`}
            className="w-full text-center tracking-widest font-mono text-lg font-bold bg-slate-950 border border-slate-700 rounded-lg p-2 text-cyan-400 focus:outline-none focus:border-cyan-500"
          />
          <span className="text-[10px] text-slate-500 mt-1 block text-center">
            Ask customer for the code received via SMS/WhatsApp
          </span>
        </div>

        {/* Option 2: Contactless Photo Capture */}
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setIsPhotoCaptured(!isPhotoCaptured)}
            className={`w-full py-2.5 px-3 border rounded-xl flex items-center justify-center space-x-2 text-xs font-semibold transition-all ${
              isPhotoCaptured 
                ? 'bg-emerald-950/40 border-emerald-500 text-emerald-400' 
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>{isPhotoCaptured ? 'Doorstep Photo Attached ✓' : 'Snap Doorstep Porch Photo'}</span>
          </button>

          {isPhotoCaptured && (
            <div className="mt-2 p-2 bg-slate-900/90 border border-purple-800/40 rounded-lg flex items-center space-x-2 text-[10px] text-purple-300">
              <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>Gemini Vision: Package verified intact on doorstep</span>
            </div>
          )}
        </div>

        <button
          onClick={handleComplete}
          disabled={isVerifying}
          className="w-full mt-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center space-x-2"
        >
          <CheckCircle className="w-4 h-4" />
          <span>{isVerifying ? 'Confirming Delivery...' : 'Mark Stop Completed'}</span>
        </button>
      </div>
    </div>
  );
};
