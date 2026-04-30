import React, { useState } from 'react';
import { X, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

interface ConnectAccountModalProps {
  onClose: () => void;
  onSuccess: (user: { username: string, email: string, isAdmin?: boolean }, servers: any[], password?: string) => void;
  panelUrl: string;
}

export default function ConnectAccountModal({ onClose, onSuccess, panelUrl }: ConnectAccountModalProps) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      setError('Please enter both identifier and password.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/users/connect', { identifier, password });
      
      // Save credentials
      localStorage.setItem('fps_username', response.data.user.username);
      localStorage.setItem('fps_email', response.data.user.email);
      localStorage.setItem('fps_password', password);
      if (response.data.user.isAdmin) {
        localStorage.setItem('fps_is_admin', 'true');
      } else {
        localStorage.removeItem('fps_is_admin');
      }
      localStorage.setItem('fps_connected_at', Date.now().toString());
      
      onSuccess(response.data.user, response.data.servers, password);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'An error occurred during connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-900">
            Connect an account
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email or Pterodactyl Username</label>
              <input 
                type="text" 
                required
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="e.g. my_email@domain.com"
              />
            </div>

            <div>
              <div className="flex justify-between items-end mb-2">
                <label className="block text-sm font-semibold text-slate-700">Password</label>
                {panelUrl && (
                  <a 
                    href={`${panelUrl}/auth/password`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors"
                  >
                    Forgot Password?
                  </a>
                )}
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full p-4 pr-12 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Your panel password"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Connecting...
                </>
              ) : (
                'Connect and Synchronize'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
