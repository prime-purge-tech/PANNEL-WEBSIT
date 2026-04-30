import { ArrowLeft, Copy, CheckCircle2, Download, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function MiniPay() {
  const [copied, setCopied] = useState(false);
  const number = "+24177994005";

  const handleCopy = () => {
    navigator.clipboard.writeText(number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-green-100 selection:text-green-900">
      <header className="px-8 py-6 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 flex items-center gap-4">
        <Link to="/donate" className="text-slate-400 hover:text-green-600 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-400 tracking-tight">
          MiniPay Donation
        </h1>
      </header>

      <main className="flex-grow p-4 sm:p-6 md:p-10 max-w-3xl mx-auto w-full">
        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-12 shadow-sm mb-8">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Smartphone className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">Donate via MiniPay</h2>
            <p className="text-slate-600 text-lg max-w-xl mx-auto">
              MiniPay is a fast and easy way to send funds. Follow the instructions below to support us.
            </p>
          </div>

          <div className="bg-green-500 text-white rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-lg shadow-green-500/20 mb-10">
            <h3 className="font-black text-2xl mb-2 tracking-wide">MINIPAY NUMBER</h3>
            <p className="text-4xl font-bold mb-6 font-mono tracking-tight">{number}</p>
            
            <button 
              onClick={handleCopy}
              className="flex items-center gap-2 px-6 py-3 bg-white text-green-600 hover:bg-green-50 rounded-xl transition-colors font-bold shadow-sm text-lg"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-6 h-6" />
                  Copied to clipboard!
                </>
              ) : (
                <>
                  <Copy className="w-6 h-6" />
                  Copy Number
                </>
              )}
            </button>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-4">How to donate with MiniPay?</h3>
            <ol className="list-decimal list-inside space-y-3 text-slate-700 mb-8">
              <li>Open your <strong>MiniPay</strong> application.</li>
              <li>Select the <strong>Send</strong> option.</li>
              <li>Paste the number <strong className="font-mono bg-slate-200 px-1 rounded">{number}</strong> copied above.</li>
              <li>Enter the amount you wish to donate and confirm.</li>
            </ol>

            <div className="border-t border-slate-200 pt-6">
              <h4 className="font-bold text-slate-900 mb-2">Don't have MiniPay yet?</h4>
              <p className="text-slate-600 mb-4 text-sm">Download the app and get started in minutes.</p>
              <a 
                href="https://link.minipay.xyz/invite?ref=FJJn1fHu" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-md"
              >
                <Download className="w-5 h-5" />
                Download MiniPay
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
