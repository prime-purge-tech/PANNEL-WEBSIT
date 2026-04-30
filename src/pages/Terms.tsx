import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-100 selection:text-blue-900">
      <header className="px-8 py-6 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 flex items-center gap-4">
        <Link to="/" className="text-slate-400 hover:text-blue-600 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400 tracking-tight">
          PRIME PURGE SERVER🎁
        </h1>
      </header>

      <main className="flex-grow p-6 md:p-10 max-w-4xl mx-auto w-full">
        <div className="bg-white border border-slate-100 rounded-3xl p-8 md:p-12 shadow-sm">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-8">Terms of Service</h2>
          <div className="prose prose-slate max-w-none">
            <p>Welcome to FREE PANELS SERVERS. By using our services, you agree to these terms.</p>
            <h3>1. Service Usage</h3>
            <p>Our free hosting services are provided "as is". We reserve the right to suspend or terminate any server that violates our policies, including but not limited to: hosting illegal content, launching DDoS attacks, or excessive resource abuse.</p>
            <h3>2. Data & Backups</h3>
            <p>While we strive for maximum uptime, we are not responsible for data loss. Users are expected to maintain their own backups.</p>
            <h3>3. Premium Upgrades</h3>
            <p>Premium upgrades are non-refundable once the resources have been allocated to your account.</p>
            <h3>4. Advertisements</h3>
            <p>To keep our services free, we may display advertisements on our website. By using our service, you agree to the presence of these advertisements. We do not use your personal server data for advertising purposes.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
