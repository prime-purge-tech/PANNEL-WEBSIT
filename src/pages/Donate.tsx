import { ArrowLeft, Heart, Server, Shield, Zap, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useState } from 'react';

export default function Donate() {
  const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || "test";
  const [amount, setAmount] = useState<string>("5");
  const [isSuccess, setIsSuccess] = useState(false);
  const [donorName, setDonorName] = useState("");

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-100 selection:text-blue-900">
      <header className="px-8 py-6 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 flex items-center gap-4">
        <Link to="/" className="text-slate-400 hover:text-blue-600 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400 tracking-tight">
          PRIME PURGE SERVERS 🎁
        </h1>
      </header>

      <main className="flex-grow p-4 sm:p-6 md:p-10 max-w-5xl mx-auto w-full">
        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-12 shadow-sm mb-8">
          <div className="text-center mb-12">
            <Heart className="w-16 h-16 text-pink-500 mx-auto mb-6 animate-pulse" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Support Our Project</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
              We provide free servers out of passion for the community. Your donations are essential to keep this service 100% free, performant, and accessible to everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
              <Server className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="font-bold text-slate-900 mb-2">Server Costs</h3>
              <p className="text-sm text-slate-600">Paying for the enterprise-grade VPS, RAM, and NVMe SSDs that host your servers 24/7.</p>
            </div>
            <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
              <Shield className="w-8 h-8 text-emerald-600 mb-4" />
              <h3 className="font-bold text-slate-900 mb-2">DDoS Protection</h3>
              <p className="text-sm text-slate-600">Maintaining premium network security and dedicated IP addresses to keep your servers online.</p>
            </div>
            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
              <Zap className="w-8 h-8 text-amber-600 mb-4" />
              <h3 className="font-bold text-slate-900 mb-2">Upgrades</h3>
              <p className="text-sm text-slate-600">Adding new nodes, increasing resource limits, and improving the panel's performance.</p>
            </div>
          </div>
          
          <div className="max-w-md mx-auto bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200">
            {isSuccess ? (
              <div className="text-center py-8 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-3">Thank you so much!</h3>
                <p className="text-slate-600 mb-8">
                  Your generous donation of <strong className="text-slate-900">{amount}€</strong> has been received, {donorName}. This helps us keep the servers running for everyone! ❤️
                </p>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="px-6 py-3 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300 transition-colors"
                >
                  Make another donation
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-center text-slate-900 mb-6">Make a Donation</h3>
                
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-3 text-center">Select Amount (EUR)</label>
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {[1, 5, 10, 20].map((preset) => (
                      <button
                        key={preset}
                        onClick={() => setAmount(preset.toString())}
                        className={`py-2 rounded-xl font-bold text-sm transition-all ${
                          amount === preset.toString() 
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 scale-105' 
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {preset}€
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">€</span>
                    <input 
                      type="number" 
                      min="1" 
                      step="1"
                      value={amount}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val) && val >= 1) {
                          setAmount(e.target.value);
                        } else if (e.target.value === '') {
                          setAmount('');
                        }
                      }}
                      onBlur={() => {
                        if (amount === '' || parseInt(amount) < 1) setAmount('1');
                      }}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-bold text-slate-700 bg-white"
                      placeholder="Custom amount (Min 1€)"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="relative z-0 min-h-[150px]">
                      <PayPalScriptProvider options={{ clientId: paypalClientId, currency: "EUR" }}>
                        <PayPalButtons 
                          style={{ layout: "vertical", shape: "rect", color: "blue" }}
                          forceReRender={[amount]}
                          createOrder={(data, actions) => {
                            const finalAmount = parseInt(amount) >= 1 ? amount : "1";
                            return actions.order.create({
                              intent: "CAPTURE",
                              purchase_units: [
                                {
                                  description: "Donation to Prime purge Servers",
                                  amount: {
                                    currency_code: "EUR",
                                    value: finalAmount,
                                  },
                                },
                              ],
                            });
                          }}
                          onApprove={async (data, actions) => {
                            if (actions.order) {
                              const details = await actions.order.capture();
                              setDonorName(details.payer?.name?.given_name || "Awesome Supporter");
                              setIsSuccess(true);
                            }
                          }}
                        />
                      </PayPalScriptProvider>
                    </div>
                  </div>

                  <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-slate-300"></div>
                    <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-medium">OR</span>
                    <div className="flex-grow border-t border-slate-300"></div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-3 text-center">Other Payment Methods</p>
                    <div className="flex flex-col gap-3">
                      <Link 
                        to="/donate/mobilepay" 
                        className="flex items-center justify-center w-full px-8 py-3.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-sm"
                      >
                        Donate via Mobile Money
                      </Link>
                      <Link 
                        to="/donate/minipay" 
                        className="flex items-center justify-center w-full px-8 py-3.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-sm"
                      >
                        Donate via MiniPay
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
