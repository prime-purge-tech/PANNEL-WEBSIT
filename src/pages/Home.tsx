import { useState, useEffect } from 'react';
import { Server, Shield, Zap, ArrowRight, CheckCircle2, Users, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

// Custom hook for animated numbers
function useAnimatedNumber(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      // Ease out expo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeProgress * end));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration]);

  return count;
}

export default function Home() {
  // Simulated stats
  const usersCount = useAnimatedNumber(15420, 2500);
  const serversCount = useAnimatedNumber(28954, 3000);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-blue-100 selection:text-blue-900">
      <header className="px-4 sm:px-8 py-4 sm:py-6 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src="https://files.catbox.moe/tl9u70.png" alt="FPS Logo" className="w-8 h-8 rounded-lg shadow-sm" />
          <h1 className="text-lg sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400 tracking-tight">
            <span className="hidden sm:inline">PRIME PURGE SERVERS</span>
            <span className="sm:hidden">FPS</span>
          </h1>
        </div>
        <nav>
          <Link 
            to="/dashboard" 
            className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full transition-all"
          >
            Access Panel
          </Link>
        </nav>
      </header>
      
      <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 py-12 sm:py-20 text-center relative overflow-hidden">
        {/* Decorative background blur */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[800px] h-[400px] sm:h-[800px] bg-blue-400/10 blur-[60px] sm:blur-[100px] rounded-full pointer-events-none"></div>

        <div className="max-w-5xl z-10 w-full">
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6 sm:mb-8 text-slate-900 tracking-tight leading-[1.1]">
            Free Hosting, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
              No Time Limits
            </span>
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl text-slate-500 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-2">
            Create your Minecraft, Node.js, and Python servers for free. 
            Your server stays online until you decide to delete it.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 w-full px-4 sm:px-0">
            <Link 
              to="/dashboard" 
              className="group flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/20 transition-all duration-300 w-full sm:w-auto"
            >
              Create my server now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Live Stats */}
          <div className="flex flex-col sm:flex-row justify-center gap-8 sm:gap-16 mb-24">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 text-slate-500 mb-2 font-medium">
                <Users className="w-5 h-5" />
                Users Online
              </div>
              <div className="text-4xl font-extrabold text-slate-900 tabular-nums">
                {usersCount.toLocaleString()}
              </div>
            </div>
            <div className="hidden sm:block w-px h-16 bg-slate-200"></div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 text-slate-500 mb-2 font-medium">
                <Activity className="w-5 h-5 text-green-500" />
                Active Servers
              </div>
              <div className="text-4xl font-extrabold text-slate-900 tabular-nums">
                {serversCount.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Features Grid with Illustrations */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mb-24">
            <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="w-full h-40 bg-slate-50 rounded-2xl mb-6 flex items-center justify-center overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
                <Server className="w-20 h-20 text-blue-500 group-hover:scale-110 transition-transform duration-500" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Multi-Games & Apps</h3>
              <p className="text-slate-500 leading-relaxed">Minecraft, Node.js, Python. Everything is ready to use with our optimized Pterodactyl infrastructure.</p>
            </div>
            <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="w-full h-40 bg-slate-50 rounded-2xl mb-6 flex items-center justify-center overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5"></div>
                <Zap className="w-20 h-20 text-amber-500 group-hover:scale-110 transition-transform duration-500" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Lightning Deployment</h3>
              <p className="text-slate-500 leading-relaxed">Your server is online in seconds, ready to be used by you and your friends without waiting.</p>
            </div>
            <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="w-full h-40 bg-slate-50 rounded-2xl mb-6 flex items-center justify-center overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5"></div>
                <Shield className="w-20 h-20 text-emerald-500 group-hover:scale-110 transition-transform duration-500" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Secure & Isolated</h3>
              <p className="text-slate-500 leading-relaxed">Each server is strictly isolated in its own container to guarantee the absolute security of your data.</p>
            </div>
          </div>

          {/* Why Choose Us Section */}
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 sm:p-12 text-left shadow-sm mb-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-6">Why choose FPS?</h2>
                <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                  We believe that everyone should have access to high-quality hosting without breaking the bank. Our platform is built on enterprise-grade hardware to ensure your projects run smoothly 24/7.
                </p>
                <ul className="space-y-4">
                  {[
                    "100% Free Forever, No hidden fees",
                    "DDoS Protection Included",
                    "Full FTP & Database Access",
                    "99.9% Uptime Guarantee"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                      <CheckCircle2 className="w-6 h-6 text-blue-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-purple-50 rounded-3xl transform rotate-3"></div>
                <div className="bg-white border border-slate-200 p-6 rounded-3xl relative shadow-lg">
                  <div className="flex items-center gap-4 mb-4 border-b border-slate-100 pb-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-xl font-bold text-slate-400">
                      AR
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Alex Rivera</h4>
                      <p className="text-sm text-slate-500">Minecraft Server Owner</p>
                    </div>
                  </div>
                  <p className="text-slate-600 italic">
                    "I've tried many free hosts, but FPS is by far the best. The performance is incredible for a free service, and the panel is super easy to use. My friends and I play without any lag!"
                  </p>
                  <div className="flex gap-1 mt-4 text-amber-400">
                    {'★★★★★'.split('').map((star, i) => <span key={i}>{star}</span>)}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
