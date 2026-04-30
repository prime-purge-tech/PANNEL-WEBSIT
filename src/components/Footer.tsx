import { ExternalLink, Youtube, MessageCircle, Send, Linkedin, Twitter, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FooterProps {
  variant?: 'home' | 'dashboard';
  onCreateServer?: () => void;
  panelUrl?: string;
}

export default function Footer({ variant = 'home', onCreateServer, panelUrl }: FooterProps) {
  if (variant === 'dashboard') {
    return (
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10 text-center">
          <p className="text-slate-500 text-sm font-medium">
            Made with ❤️ by PRIME PURGE TECH
          </p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src="https://files.catbox.moe/tl9u70.png" alt="FPS Logo" className="w-8 h-8 rounded-lg shadow-sm" />
              <h3 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400 tracking-tight">
                FPS
              </h3>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Providing high-quality, free server hosting for everyone. Deploy your next big project with us today.
            </p>
            <div className="flex flex-col gap-3 items-start">
              <a 
                href="https://t.me/FreePterodactylPanels_Bot" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#0088cc] text-white font-semibold rounded-xl hover:bg-[#0077b3] transition-colors text-sm shadow-sm"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                Telegram Bot
              </a>
              <Link 
                to="/donate" 
                className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500 text-white font-semibold rounded-xl hover:bg-pink-600 transition-colors text-sm shadow-sm shadow-pink-500/20"
              >
                <Heart className="w-5 h-5 fill-current" />
                Support Us
              </Link>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/dashboard" className="text-slate-500 hover:text-blue-600 transition-colors text-sm">Dashboard</Link></li>
              <li>
                {onCreateServer ? (
                  <button onClick={onCreateServer} className="text-slate-500 hover:text-blue-600 transition-colors text-sm">Create Server</button>
                ) : (
                  <Link to="/dashboard" className="text-slate-500 hover:text-blue-600 transition-colors text-sm">Create Server</Link>
                )}
              </li>
              <li>
                {panelUrl ? (
                  <a href={`${panelUrl}/account`} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-blue-600 transition-colors text-sm">My Account</a>
                ) : (
                  <Link to="/dashboard" className="text-slate-500 hover:text-blue-600 transition-colors text-sm">My Account</Link>
                )}
              </li>
              <li><Link to="/donate" className="text-slate-500 hover:text-pink-600 transition-colors text-sm font-medium flex items-center gap-1">Donate <Heart className="w-3 h-3 text-pink-500" /></Link></li>
              <li><Link to="/contact" className="text-slate-500 hover:text-blue-600 transition-colors text-sm">Support</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><Link to="/terms" className="text-slate-500 hover:text-blue-600 transition-colors text-sm">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-slate-500 hover:text-blue-600 transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link to="/help" className="text-slate-500 hover:text-blue-600 transition-colors text-sm">Acceptable Use</Link></li>
              <li><Link to="/privacy" className="text-slate-500 hover:text-blue-600 transition-colors text-sm">Cookie Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-4">Other Sites</h4>
            <ul className="space-y-3">
              <li><a href="https://lordobitotech.xyz" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-blue-600 transition-colors text-sm flex items-center gap-1">PRIME PURGE TECH <ExternalLink className="w-3 h-3" /></a></li>
              <li><a href="https://t.me/JSTech_Gc" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-blue-600 transition-colors text-sm flex items-center gap-1">Community Forum <ExternalLink className="w-3 h-3" /></a></li>
            </ul>
          </div>
        </div>
        
        <div className="flex justify-center gap-6 mb-8">
          <a href="https://youtube.com/@JeanStephTech" className="text-slate-400 hover:text-blue-600 transition-colors"><Youtube className="w-5 h-5" /></a>
          <a href="https://whatsapp.com/channel/0029Vb7Ibg5002T79MWH2r1p" className="text-slate-400 hover:text-blue-600 transition-colors"><MessageCircle className="w-5 h-5" /></a>
          <a href="https://t.me/prime_purge_tech" className="text-slate-400 hover:text-blue-600 transition-colors"><Send className="w-5 h-5" /></a>
          <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors"><Linkedin className="w-5 h-5" /></a>
          <a href="https://x.com/JeanStephTech" className="text-slate-400 hover:text-blue-600 transition-colors"><Twitter className="w-5 h-5" /></a>
        </div>

        <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} Free Panels Servers. All rights reserved.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <span className="text-slate-400 text-sm font-medium">Powered by PRIME PURGE TECH</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
