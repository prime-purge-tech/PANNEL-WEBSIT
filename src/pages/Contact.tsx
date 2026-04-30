import { ArrowLeft, Mail, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Contact() {
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

      <main className="flex-grow p-6 md:p-10 max-w-4xl mx-auto w-full">
        <div className="bg-white border border-slate-100 rounded-3xl p-8 md:p-12 shadow-sm text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-8">Contact Us</h2>
          <p className="text-slate-600 mb-8 text-lg">Need help or have a question? Reach out to us through the following channels:</p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <a href="mailto:support@blackhatvps.store" className="flex items-center justify-center gap-3 px-8 py-4 bg-blue-50 text-blue-700 font-semibold rounded-xl hover:bg-blue-100 transition-colors">
              <Mail className="w-6 h-6" />
              Email Support
            </a>
            <a href="#" className="flex items-center justify-center gap-3 px-8 py-4 bg-indigo-50 text-indigo-700 font-semibold rounded-xl hover:bg-indigo-100 transition-colors">
              <MessageCircle className="w-6 h-6" />
              Discord Community
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
