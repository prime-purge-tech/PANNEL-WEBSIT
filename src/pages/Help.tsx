import { ArrowLeft, Server, Terminal, Database, Globe, Gamepad2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Help() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-100 selection:text-blue-900">
      <header className="px-4 sm:px-8 py-4 sm:py-6 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 flex items-center gap-3 sm:gap-4">
        <Link to="/" className="text-slate-400 hover:text-blue-600 transition-colors">
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </Link>
        <h1 className="text-lg sm:text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400 tracking-tight">
          <span className="hidden sm:inline">PRIME PURGE SERVERS 🎁</span>
          <span className="sm:hidden">FPS 🎁</span>
        </h1>
      </header>

      <main className="flex-grow p-4 sm:p-6 md:p-10 max-w-4xl mx-auto w-full">
        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 md:p-12 shadow-sm">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3 sm:mb-4">Servers Guide</h2>
          <p className="text-slate-500 mb-8 sm:mb-10 text-base sm:text-lg">
            Discover the different types of servers available on our infrastructure and find the perfect one for your project.
          </p>

          <div className="space-y-10 sm:space-y-12">
            
            {/* Websites & Web Applications */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-start">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-50 rounded-2xl flex items-center justify-center flex-shrink-0 border border-purple-100">
                <Globe className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600" />
              </div>
              <div className="w-full">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">Websites & Web Applications</h3>
                <p className="text-sm sm:text-base text-slate-600 mb-4 leading-relaxed">
                  Host your websites, web applications, and APIs. Depending on the technology you used to build your site, choose the appropriate environment below.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                    <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span> Node.js
                    </h4>
                    <p className="text-sm text-slate-600">
                      Perfect for modern web applications, REST APIs, or backends for React/Vue/Angular apps. Uses JavaScript or TypeScript on the server side.
                    </p>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                    <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span> Python
                    </h4>
                    <p className="text-sm text-slate-600">
                      Ideal for web frameworks like Django, Flask, or FastAPI. Great for data-heavy applications or backend services.
                    </p>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                    <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-500"></span> PHP / Nginx
                    </h4>
                    <p className="text-sm text-slate-600">
                      The classic choice for WordPress blogs, Laravel applications, or traditional PHP websites.
                    </p>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                    <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-orange-500"></span> HTML / CSS / JS
                    </h4>
                    <p className="text-sm text-slate-600">
                      For static websites, portfolios, or landing pages that don't require server-side processing. Extremely fast and lightweight.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bots & Scripts */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-start">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0 border border-blue-100">
                <Terminal className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
              </div>
              <div className="w-full">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">Discord Bots & Scripts</h3>
                <p className="text-sm sm:text-base text-slate-600 mb-4 leading-relaxed">
                  Keep your Discord bots online 24/7 or run automated background tasks. These environments consume very few resources.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                    <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span> Node.js (Discord.js)
                    </h4>
                    <p className="text-sm text-slate-600">
                      The most popular choice for Discord bots. Use the Discord.js library to create powerful and interactive bots.
                    </p>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                    <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span> Python (Discord.py)
                    </h4>
                    <p className="text-sm text-slate-600">
                      A great alternative for Python developers. Excellent for bots that require data processing or machine learning integrations.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Minecraft */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-start">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-50 rounded-2xl flex items-center justify-center flex-shrink-0 border border-emerald-100">
                <Gamepad2 className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600" />
              </div>
              <div className="w-full">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">Game Servers (Minecraft)</h3>
                <p className="text-sm sm:text-base text-slate-600 mb-4 leading-relaxed">
                  Host your multiplayer games. Game servers require a lot of resources, we recommend at least <strong>512MB of RAM</strong> for a smooth experience on free servers. For larger servers, contact us on WhatsApp.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                    <h4 className="font-bold text-slate-800 mb-1">Paper / Purpur</h4>
                    <p className="text-sm text-slate-600">
                      Highly optimized for Minecraft servers with plugins. It's the best performing choice for a public server or playing with friends.
                    </p>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                    <h4 className="font-bold text-slate-800 mb-1">Forge / Fabric</h4>
                    <p className="text-sm text-slate-600">
                      Required if you want to play with Mods. Note that modded servers require significantly more RAM than plugin servers.
                    </p>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 sm:col-span-2">
                    <h4 className="font-bold text-slate-800 mb-1">Vanilla</h4>
                    <p className="text-sm text-slate-600">
                      The base version of the game directly from Mojang, without any modifications or optimizations.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Databases */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-start">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-orange-50 rounded-2xl flex items-center justify-center flex-shrink-0 border border-orange-100">
                <Database className="w-6 h-6 sm:w-7 sm:h-7 text-orange-600" />
              </div>
              <div className="w-full">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">Databases</h3>
                <p className="text-sm sm:text-base text-slate-600 mb-4 leading-relaxed">
                  Securely store data for your applications, websites, or game servers.
                </p>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                    <h4 className="font-bold text-slate-800 mb-1">MySQL / MariaDB</h4>
                    <p className="text-sm text-slate-600">
                      Classic relational database. Widely used with PHP, WordPress, and Minecraft plugins.
                    </p>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                    <h4 className="font-bold text-slate-800 mb-1">MongoDB</h4>
                    <p className="text-sm text-slate-600">
                      Flexible NoSQL database. Very popular with Node.js and modern web applications.
                    </p>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                    <h4 className="font-bold text-slate-800 mb-1">Redis</h4>
                    <p className="text-sm text-slate-600">
                      In-memory data structure store. Used for caching and ultra-fast performance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
