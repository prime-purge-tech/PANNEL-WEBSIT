import { ArrowLeft, Copy, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function MobilePay() {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const providers = [
    { id: 'orange', name: 'AIRTEL MONEY', number: '+24177994005', color: 'bg-airtel-500', text: 'text-white' },
    { id: 'mtn', name: 'Moov MONEY', number: '+24177994005', color: 'bg-yellow-400', text: 'text-slate-900' },
    { id: 'wave', name: 'WAVE', number: '+24177994005', color: 'bg-cyan-500', text: 'text-white' },
    { id: 'moov', name: 'MOOV AFRICA', number: '(Coming soon)', color: 'bg-blue-600', text: 'text-white', disabled: true },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-red-100 selection:text-red-900">
      <header className="px-8 py-6 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 flex items-center gap-4">
        <Link to="/donate" className="text-slate-400 hover:text-red-600 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400 tracking-tight">
          Mobile Money Donation
        </h1>
      </header>

      <main className="flex-grow p-4 sm:p-6 md:p-10 max-w-3xl mx-auto w-full">
        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-12 shadow-sm mb-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">Donate via Mobile Money</h2>
            <p className="text-slate-600 text-lg max-w-xl mx-auto">
              Please send your donation to one of the numbers below. Thank you for your support!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {providers.map((p) => (
              <div key={p.id} className={`${p.color} ${p.text} rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-md relative overflow-hidden`}>
                <h3 className="font-black text-xl mb-2 tracking-wide">{p.name}</h3>
                <p className="text-2xl font-bold mb-4 font-mono">{p.number}</p>
                
                {!p.disabled && (
                  <button 
                    onClick={() => handleCopy(p.number, p.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-black/10 hover:bg-black/20 rounded-xl transition-colors font-semibold backdrop-blur-sm"
                  >
                    {copied === p.id ? (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5" />
                        Copy Number
                      </>
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
