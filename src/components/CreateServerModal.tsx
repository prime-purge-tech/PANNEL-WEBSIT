import React, { useState, useEffect } from 'react';
import { X, Loader2, AlertCircle, Star, Server, CheckCircle2 } from 'lucide-react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from 'axios';

interface CreateServerModalProps {
  onClose: () => void;
  onSuccess: (server: any, username: string) => void;
}

const PLANS = [
  { id: 'free', name: 'Free Plan', cpu: 100, ram: 512, disk: 2048, price: 0, oldPrice: 0 },
  { id: 'cloud1', name: 'Cloud 1', cpu: 150, ram: 1024, disk: 5120, price: 1.00, oldPrice: 2.50 },
  { id: 'cloud2', name: 'Cloud 2', cpu: 250, ram: 3072, disk: 10240, price: 1.87, oldPrice: 3.70 },
  { id: 'cloud3', name: 'Cloud 3 (Unlimited)', cpu: 0, ram: 0, disk: 0, price: 2.99, oldPrice: 5.50, isUnlimited: true },
];

export default function CreateServerModal({ onClose, onSuccess }: CreateServerModalProps) {
  const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || "test";
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [nests, setNests] = useState<any[]>([]);
  
  // Form state
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [serverName, setServerName] = useState('');
  const [nestId, setNestId] = useState('');
  const [eggId, setEggId] = useState('');
  
  const [selectedPlan, setSelectedPlan] = useState(PLANS[0]);
  const [isSuccess, setIsSuccess] = useState(false);

  // Load remembered credentials and fetch nests
  useEffect(() => {
    const savedUsername = localStorage.getItem('fps_username');
    const savedPassword = localStorage.getItem('fps_password');
    const savedEmail = localStorage.getItem('fps_email');
    if (savedUsername) setUsername(savedUsername);
    if (savedPassword) setPassword(savedPassword);
    if (savedEmail) setEmail(savedEmail);

    axios.get('/api/nests')
      .then(res => {
        if (res.data.data) setNests(res.data.data);
      })
      .catch(err => console.error("Failed to load nests", err));
  }, []);

  const validateForm = () => {
    const isConnected = !!localStorage.getItem('fps_username');
    
    if (!username || (!isConnected && !password) || !serverName || !eggId || !nestId) {
      setError('Please fill in all required fields and select a server type.');
      return false;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError("Username must contain only letters, numbers, and underscores (no spaces or special characters).");
      return false;
    }

    if (serverName.length < 3 || serverName.length > 50) {
      setError("Server name must be between 3 and 50 characters.");
      return false;
    }

    if (!isConnected && password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return false;
    }

    setError('');
    return true;
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    if (selectedPlan.price === 0) {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError('');

    try {
      // 1. Save credentials for next time
      localStorage.setItem('fps_username', username);
      if (password) localStorage.setItem('fps_password', password);
      if (email) localStorage.setItem('fps_email', email);

      // 2. Call backend to create user & server on Pterodactyl
      const response = await axios.post('/api/servers/create', {
        username,
        email,
        password,
        serverName,
        eggId,
        nestId,
        cpu: selectedPlan.cpu,
        ram: selectedPlan.ram,
        disk: selectedPlan.disk
      });

      // 3. Success
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess({
          id: response.data.server?.id || Date.now().toString(),
          identifier: response.data.server?.identifier,
          name: serverName,
          type: response.data.server?.name || 'Server',
          cpu: selectedPlan.cpu,
          ram: selectedPlan.ram,
          disk: selectedPlan.disk,
          status: 'active',
          createdAt: new Date().toISOString()
        }, username);
      }, 2000);

    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'An error occurred during creation.');
    } finally {
      setIsLoading(false);
    }
  };

  const isConnected = !!localStorage.getItem('fps_username');

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="p-4 sm:p-6 border-b border-gray-100 flex justify-between items-center bg-blue-50/50">
          <h2 className="text-xl sm:text-2xl font-bold text-blue-900">
            Create New Server
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto flex-grow">
          {isSuccess ? (
            <div className="py-16 text-center animate-in fade-in zoom-in">
              <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto mb-6" />
              <h3 className="text-3xl font-bold text-slate-900 mb-2">Server Created!</h3>
              <p className="text-slate-500 text-lg">Your server is being provisioned and will be ready shortly.</p>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              <form id="server-form" onSubmit={handleNextStep} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column: Form Details */}
                  <div className="space-y-6">
                    {/* Pterodactyl User Info */}
                    <div className="space-y-4">
                      <h3 className="font-bold text-gray-900 border-b pb-2">Pterodactyl Account</h3>
                      
                      {isConnected ? (
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                          <p className="text-sm text-blue-800 mb-2">
                            You are logged in as:
                          </p>
                          <p className="font-bold text-blue-900 text-lg">{username}</p>
                          <p className="text-xs text-blue-600 mt-2">
                            The server will be created on this account.
                          </p>
                        </div>
                      ) : (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                            <input 
                              type="text" 
                              required
                              value={username}
                              onChange={e => setUsername(e.target.value)}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                              placeholder="e.g. fps_user"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
                            <input 
                              type="email" 
                              value={email}
                              onChange={e => setEmail(e.target.value)}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                              placeholder="your@email.com"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input 
                              type="password" 
                              required
                              value={password}
                              onChange={e => setPassword(e.target.value)}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                              placeholder="••••••••"
                            />
                          </div>
                          <p className="text-xs text-gray-500">
                            If the account exists, the server will be added to it. Otherwise, it will be created.
                          </p>
                        </>
                      )}
                    </div>

                    {/* Server Info */}
                    <div className="space-y-4">
                      <h3 className="font-bold text-gray-900 border-b pb-2">Server Details</h3>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Server Name</label>
                        <input 
                          type="text" 
                          required
                          value={serverName}
                          onChange={e => setServerName(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                          placeholder="My Awesome Server"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between items-end mb-1">
                          <label className="block text-sm font-medium text-gray-700">Server Type</label>
                          <a href="/help" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline font-medium">
                            Which type to choose?
                          </a>
                        </div>
                        <select 
                          required
                          value={eggId}
                          onChange={(e) => {
                            const selectedOption = e.target.options[e.target.selectedIndex];
                            const newEggId = e.target.value;
                            const newNestId = selectedOption.getAttribute('data-nest') || '';
                            
                            setEggId(newEggId);
                            setNestId(newNestId);
                          }}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                        >
                          <option value="">Select a type...</option>
                          {nests.map((nest: any) => (
                            <optgroup key={nest.attributes.id} label={nest.attributes.name}>
                              {nest.attributes.relationships.eggs.data.map((egg: any) => (
                                <option key={egg.attributes.id} value={egg.attributes.id} data-nest={nest.attributes.id}>
                                  {egg.attributes.name}
                                </option>
                              ))}
                            </optgroup>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Plans */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-gray-900 border-b pb-2">Select a Plan</h3>
                    <div className="grid grid-cols-1 gap-3">
                      {PLANS.map(plan => (
                        <div 
                          key={plan.id}
                          onClick={() => setSelectedPlan(plan)}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            selectedPlan.id === plan.id 
                              ? 'border-blue-500 bg-blue-50 shadow-md shadow-blue-500/10' 
                              : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-bold text-slate-900 flex items-center gap-2">
                              {plan.isUnlimited ? <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> : <Server className="w-4 h-4 text-slate-500" />}
                              {plan.name}
                            </h4>
                            <div className="text-right">
                              {plan.oldPrice > 0 && (
                                <span className="text-xs text-slate-400 line-through mr-2">{plan.oldPrice}€</span>
                              )}
                              <span className={`font-black ${plan.price > 0 ? 'text-blue-600' : 'text-emerald-600'}`}>
                                {plan.price === 0 ? 'FREE' : `${plan.price}€`}
                              </span>
                            </div>
                          </div>
                          <ul className="text-xs text-slate-600 flex gap-4">
                            <li>• {plan.isUnlimited ? '∞' : `${plan.cpu}%`} CPU</li>
                            <li>• {plan.isUnlimited ? '∞' : `${plan.ram / 1024} GB`} RAM</li>
                            <li>• {plan.isUnlimited ? '∞' : `${plan.disk / 1024} GB`} Disk</li>
                          </ul>
                        </div>
                      ))}
                    </div>

                    {/* Payment / Action Area */}
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      {selectedPlan.price > 0 ? (
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                          <div className="flex justify-between items-center mb-4">
                            <span className="font-bold text-slate-700">Total Due:</span>
                            <span className="font-black text-xl text-blue-600">{selectedPlan.price}€</span>
                          </div>
                          <div className="relative z-0">
                            <PayPalScriptProvider options={{ clientId: paypalClientId, currency: "EUR" }}>
                              <PayPalButtons 
                                style={{ layout: "vertical", shape: "rect", color: "blue" }}
                                forceReRender={[selectedPlan.id, username, serverName, eggId, nestId]}
                                onClick={(data, actions) => {
                                  if (!validateForm()) {
                                    return actions.reject();
                                  }
                                  return actions.resolve();
                                }}
                                createOrder={(data, actions) => {
                                  return actions.order.create({
                                    intent: "CAPTURE",
                                    purchase_units: [{
                                      description: `${selectedPlan.name} for server ${serverName}`,
                                      amount: { currency_code: "EUR", value: selectedPlan.price.toString() },
                                    }],
                                  });
                                }}
                                onApprove={async (data, actions) => {
                                  if (actions.order) {
                                    await actions.order.capture();
                                    await handleSubmit();
                                  }
                                }}
                              />
                            </PayPalScriptProvider>
                          </div>
                        </div>
                      ) : (
                        <button 
                          type="submit"
                          form="server-form"
                          disabled={isLoading}
                          className="w-full px-6 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Creating Server...
                            </>
                          ) : (
                            'Create Free Server'
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </>
          )}
        </div>

        {!isSuccess && (
          <div className="p-4 sm:p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
