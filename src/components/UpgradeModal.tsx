import React, { useState } from 'react';
import { X, Loader2, Zap, CheckCircle2, Server, Star } from 'lucide-react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from 'axios';

interface UpgradeModalProps {
  server: any;
  onClose: () => void;
  onSuccess: (serverId: string, newLimits: any) => void;
}

const PLANS = [
  { id: 'cloud1', name: 'Cloud 1', cpu: 150, ram: 1024, disk: 5120, price: 1.00, oldPrice: 2.50 },
  { id: 'cloud2', name: 'Cloud 2', cpu: 250, ram: 3072, disk: 10240, price: 1.87, oldPrice: 3.70 },
  { id: 'cloud3', name: 'Cloud 3', cpu: 0, ram: 0, disk: 0, price: 2.99, oldPrice: 5.50, isUnlimited: true },
];

export default function UpgradeModal({ server, onClose, onSuccess }: UpgradeModalProps) {
  const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || "test";
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(PLANS[0]);

  const handleUpgrade = async () => {
    setIsProcessing(true);
    try {
      const payload = {
        cpu: selectedPlan.cpu,
        memory: selectedPlan.ram,
        disk: selectedPlan.disk
      };
      const res = await axios.post(`/api/servers/${server.id}/upgrade`, payload);
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess(server.id, res.data.limits);
      }, 2000);
    } catch (error) {
      console.error(error);
      alert("Failed to upgrade server resources.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-500" />
            Upgrade Server: {server.name}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {isSuccess ? (
            <div className="py-12 text-center animate-in fade-in zoom-in">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Upgrade Successful!</h3>
              <p className="text-slate-500">Your server has been upgraded to {selectedPlan.name}.</p>
            </div>
          ) : isProcessing ? (
            <div className="py-16 flex flex-col items-center text-center">
              <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
              <p className="text-slate-600 font-medium">Applying upgrades to your server...</p>
              <p className="text-sm text-slate-400 mt-2">This may take a few seconds.</p>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-4">
                <h3 className="font-bold text-slate-900 mb-4">Select a Plan</h3>
                {PLANS.map(plan => (
                  <div 
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      selectedPlan.id === plan.id 
                        ? 'border-purple-500 bg-purple-50 shadow-md shadow-purple-500/10' 
                        : 'border-slate-200 hover:border-purple-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold text-slate-900 flex items-center gap-2">
                        {plan.isUnlimited ? <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> : <Server className="w-4 h-4 text-slate-500" />}
                        {plan.name}
                      </h4>
                      <div className="text-right">
                        <span className="text-xs text-slate-400 line-through mr-2">{plan.oldPrice}€</span>
                        <span className="font-black text-purple-600">{plan.price}€</span>
                      </div>
                    </div>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li>• {plan.isUnlimited ? '∞' : `${plan.cpu}%`} CPU</li>
                      <li>• {plan.isUnlimited ? '∞' : `${plan.ram / 1024} GB`} RAM</li>
                      <li>• {plan.isUnlimited ? '∞' : `${plan.disk / 1024} GB`} NVMe Disk</li>
                    </ul>
                  </div>
                ))}
              </div>

              <div className="w-full md:w-64 flex flex-col">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-6 flex-grow">
                  <h3 className="font-bold text-slate-900 mb-4 border-b border-slate-200 pb-2">Order Summary</h3>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-600">{selectedPlan.name}</span>
                    <span className="font-bold">{selectedPlan.price}€</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-emerald-600 mb-4">
                    <span>Discount</span>
                    <span>-{(selectedPlan.oldPrice - selectedPlan.price).toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-slate-200 pt-4 mt-auto">
                    <span className="font-bold text-slate-900">Total</span>
                    <span className="font-black text-xl text-purple-600">{selectedPlan.price}€</span>
                  </div>
                </div>

                <div className="relative z-0">
                  <PayPalScriptProvider options={{ clientId: paypalClientId, currency: "EUR" }}>
                    <PayPalButtons 
                      style={{ layout: "vertical", shape: "rect", color: "blue" }}
                      forceReRender={[selectedPlan.id]}
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          intent: "CAPTURE",
                          purchase_units: [{
                            description: `Upgrade to ${selectedPlan.name} for server ${server.name}`,
                            amount: { currency_code: "EUR", value: selectedPlan.price.toString() },
                          }],
                        });
                      }}
                      onApprove={async (data, actions) => {
                        if (actions.order) {
                          await actions.order.capture();
                          await handleUpgrade();
                        }
                      }}
                    />
                  </PayPalScriptProvider>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
