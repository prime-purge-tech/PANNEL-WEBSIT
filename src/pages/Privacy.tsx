import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Privacy() {
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
        <div className="bg-white border border-slate-100 rounded-3xl p-8 md:p-12 shadow-sm">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-8">Privacy Policy</h2>
          <div className="prose prose-slate max-w-none">
            <p>Your privacy is important to us. Here is how we handle your data.</p>
            <h3>1. Data Collection</h3>
            <p>We collect minimal data necessary to provide our services, such as your email address and server configurations.</p>
            <h3>2. Data Usage</h3>
            <p>Your data is used exclusively to maintain your servers and provide support. We do not sell your data to third parties.</p>
            <h3>3. Security</h3>
            <p>We implement industry-standard security measures to protect your information and server data.</p>
            <h3>4. Advertising and Cookies</h3>
            <p>We use cookies and similar technologies to show you relevant advertisements and analyze our traffic. These advertisements help us fund the free hosting we provide to you. You can manage your cookie preferences in your browser settings.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
