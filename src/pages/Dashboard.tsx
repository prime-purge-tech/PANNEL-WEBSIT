import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Server, Plus, Play, Pause, Trash2, ArrowLeft, LogOut, Link as LinkIcon, ExternalLink, User, Eye, EyeOff, AlertTriangle, Loader2, Activity, Square, RefreshCw, PauseCircle, PlayCircle, Zap } from 'lucide-react';
import axios from 'axios';
import CreateServerModal from '../components/CreateServerModal';
import ConnectAccountModal from '../components/ConnectAccountModal';
import UpgradeModal from '../components/UpgradeModal';
import Footer from '../components/Footer';

interface ServerData {
  id: string;
  identifier?: string;
  name: string;
  type: string;
  cpu: number;
  ram: number;
  disk: number;
  status: 'active' | 'suspended';
  createdAt: string;
}

interface ResourceData {
  current_state: string;
  is_suspended: boolean;
  resources: {
    memory_bytes: number;
    cpu_absolute: number;
    disk_bytes: number;
    network_rx_bytes: number;
    network_tx_bytes: number;
  };
}

function ServerCard({ server, panelUrl, onDelete, onStatusChange, onUpgradeClick }: { key?: string | number, server: ServerData, panelUrl: string, onDelete: (server: ServerData) => void, onStatusChange: (id: string, status: 'active' | 'suspended') => void, onUpgradeClick: (server: ServerData) => void }) {
  const [resources, setResources] = useState<ResourceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const fetchResources = async () => {
      if (!server.identifier) {
        setLoading(false);
        return;
      }
      
      try {
        const res = await axios.get(`/api/servers/${server.identifier}/resources`);
        if (isMounted && res.data.success) {
          setResources(res.data.resources);
        }
      } catch (error) {
        console.error("Failed to fetch resources for", server.name);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchResources();
    const interval = setInterval(fetchResources, 10000); // Update every 10 seconds

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [server.identifier]);

  const handlePower = async (signal: string) => {
    try {
      await axios.post(`/api/servers/${server.identifier}/power`, { signal });
    } catch (error) {
      console.error(error);
      alert("Failed to send power signal.");
    }
  };

  const handleSuspendToggle = async () => {
    try {
      const action = server.status === 'active' ? 'suspend' : 'unsuspend';
      await axios.post(`/api/servers/${server.id}/${action}`);
      onStatusChange(server.id, action === 'suspend' ? 'suspended' : 'active');
    } catch (error) {
      console.error(error);
      alert(`Failed to ${server.status === 'active' ? 'suspend' : 'unsuspend'} server.`);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 MB';
    const mb = bytes / 1024 / 1024;
    return `${mb.toFixed(1)} MB`;
  };

  const isRunning = resources?.current_state === 'running';
  const stateColor = isRunning ? 'text-emerald-500' : 'text-slate-400';

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col">
      <div className="flex justify-between items-start mb-6 gap-2">
        <div className="min-w-0">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 truncate">{server.name}</h3>
          <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-[10px] sm:text-xs font-bold rounded-full uppercase tracking-wider truncate max-w-full">
            {server.type}
          </span>
        </div>
        <div className={`px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-1.5 flex-shrink-0 relative overflow-hidden ${
          server.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
        }`}>
          <span className={`w-2 h-2 rounded-full ${
            server.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
          }`}></span>
          {server.status === 'active' ? 'Active' : 'Suspended'}
        </div>
      </div>
      
      {/* Real-time Resources */}
      <div className="mb-6 sm:mb-8 bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-100">
        <div className="flex items-center gap-2 mb-4">
          <Activity className={`w-4 h-4 ${stateColor}`} />
          <span className="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider">
            Live Usage {loading && !resources && <Loader2 className="w-3 h-3 inline animate-spin ml-2 text-slate-400" />}
          </span>
          {resources && (
            <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${isRunning ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
              {resources.current_state}
            </span>
          )}
        </div>
        
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <div className="flex flex-col">
            <div className="text-[10px] sm:text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">CPU</div>
            <div className="font-mono text-slate-900 font-bold text-sm sm:text-base">
              {resources ? `${resources.resources.cpu_absolute.toFixed(1)}%` : '---'}
              <span className="text-xs text-slate-400 font-normal ml-1">/ {server.cpu === 0 ? '∞' : `${server.cpu}%`}</span>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="text-[10px] sm:text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">RAM</div>
            <div className="font-mono text-slate-900 font-bold text-sm sm:text-base">
              {resources ? formatBytes(resources.resources.memory_bytes) : '---'}
              <span className="text-xs text-slate-400 font-normal ml-1 block sm:inline">/ {server.ram === 0 ? '∞' : `${server.ram} MB`}</span>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="text-[10px] sm:text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Disk</div>
            <div className="font-mono text-slate-900 font-bold text-sm sm:text-base">
              {resources ? formatBytes(resources.resources.disk_bytes) : '---'}
              <span className="text-xs text-slate-400 font-normal ml-1 block sm:inline">/ {server.disk === 0 ? '∞' : `${server.disk} MB`}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <button onClick={() => handlePower('start')} className="p-2 bg-slate-100 hover:bg-emerald-100 text-emerald-600 rounded-lg transition-colors" title="Start"><Play className="w-4 h-4"/></button>
        <button onClick={() => handlePower('restart')} className="p-2 bg-slate-100 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors" title="Restart"><RefreshCw className="w-4 h-4"/></button>
        <button onClick={() => handlePower('stop')} className="p-2 bg-slate-100 hover:bg-red-100 text-red-600 rounded-lg transition-colors" title="Stop"><Square className="w-4 h-4"/></button>
        
        <div className="w-px h-6 bg-slate-200 mx-1"></div>
        
        <button onClick={handleSuspendToggle} className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors">
          {server.status === 'active' ? <><PauseCircle className="w-4 h-4"/> Suspend</> : <><PlayCircle className="w-4 h-4"/> Unsuspend</>}
        </button>

        <button onClick={() => onUpgradeClick(server)} className="px-3 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg text-xs font-bold flex items-center gap-1 ml-auto transition-colors">
          <Zap className="w-4 h-4"/> Upgrade
        </button>
      </div>

      <div className="mt-auto flex justify-between items-center pt-5 sm:pt-6 border-t border-slate-100">
        <div className="text-xs sm:text-sm font-medium text-slate-400">
          Created on {new Date(server.createdAt).toLocaleDateString()}
        </div>
        <div className="flex items-center gap-2">
          {panelUrl && (
            <a 
              href={`${panelUrl}/server/${server.identifier || server.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl transition-colors text-xs sm:text-sm font-bold"
            >
              <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Access Server</span>
              <span className="sm:hidden">Access</span>
            </a>
          )}
          <button 
            onClick={() => onDelete(server)}
            className="p-2 sm:p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [servers, setServers] = useState<ServerData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [pterodactylUsername, setPterodactylUsername] = useState('');
  const [pterodactylEmail, setPterodactylEmail] = useState('');
  const [pterodactylPassword, setPterodactylPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [panelUrl, setPanelUrl] = useState('');
  const [serverToDelete, setServerToDelete] = useState<ServerData | null>(null);
  const [serverToUpgrade, setServerToUpgrade] = useState<ServerData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');

  // Load saved data from localStorage (simulating device memory)
  useEffect(() => {
    const savedServers = localStorage.getItem('fps_servers');
    const savedUsername = localStorage.getItem('fps_username');
    const savedEmail = localStorage.getItem('fps_email');
    const savedPassword = localStorage.getItem('fps_password');
    const savedIsAdmin = localStorage.getItem('fps_is_admin');
    
    if (savedServers) setServers(JSON.parse(savedServers));
    if (savedUsername) setPterodactylUsername(savedUsername);
    if (savedEmail) setPterodactylEmail(savedEmail);
    if (savedPassword) setPterodactylPassword(savedPassword);
    if (savedIsAdmin === 'true') setIsAdmin(true);

    axios.get('/api/config')
      .then(res => {
        if (res.data.panelUrl) setPanelUrl(res.data.panelUrl);
      })
      .catch(err => console.error("Failed to load config", err));
  }, []);

  const handleStatusChange = (id: string, status: 'active' | 'suspended') => {
    const updated = servers.map(s => s.id === id ? { ...s, status } : s);
    setServers(updated);
    localStorage.setItem('fps_servers', JSON.stringify(updated));
  };

  const handleUpgradeSuccess = (id: string, newLimits: any) => {
    const updated = servers.map(s => s.id === id ? { 
      ...s, 
      cpu: newLimits.cpu, 
      ram: newLimits.memory, 
      disk: newLimits.disk 
    } : s);
    setServers(updated);
    localStorage.setItem('fps_servers', JSON.stringify(updated));
    setServerToUpgrade(null);
  };

  const handleServerCreated = (newServer: ServerData, username: string) => {
    const updatedServers = [...servers, newServer];
    setServers(updatedServers);
    setPterodactylUsername(username);
    
    const savedEmail = localStorage.getItem('fps_email');
    if (savedEmail) setPterodactylEmail(savedEmail);

    const savedPassword = localStorage.getItem('fps_password');
    if (savedPassword) setPterodactylPassword(savedPassword);
    
    localStorage.setItem('fps_servers', JSON.stringify(updatedServers));
    localStorage.setItem('fps_username', username);
    setIsModalOpen(false);
  };

  const handleAccountConnected = (user: { username: string, email: string, isAdmin?: boolean }, fetchedServers: any[], password?: string) => {
    setPterodactylUsername(user.username);
    setPterodactylEmail(user.email);
    if (password) setPterodactylPassword(password);
    setIsAdmin(!!user.isAdmin);
    setServers(fetchedServers);
    localStorage.setItem('fps_servers', JSON.stringify(fetchedServers));
    localStorage.setItem('fps_connected_at', Date.now().toString());
    setIsConnectModalOpen(false);
  };

  const handleLogout = () => {
    const connectedAt = localStorage.getItem('fps_connected_at');
    if (connectedAt) {
      const connectTime = parseInt(connectedAt, 10);
      const oneHour = 60 * 60 * 1000;
      if (Date.now() - connectTime < oneHour) {
        setError("You cannot disconnect your account within 1 hour of connecting.");
        setTimeout(() => setError(''), 5000);
        return;
      }
    }

    localStorage.removeItem('fps_username');
    localStorage.removeItem('fps_email');
    localStorage.removeItem('fps_password');
    localStorage.removeItem('fps_servers');
    localStorage.removeItem('fps_is_admin');
    localStorage.removeItem('fps_connected_at');
    setPterodactylUsername('');
    setPterodactylEmail('');
    setPterodactylPassword('');
    setIsAdmin(false);
    setServers([]);
  };

  const confirmDelete = async () => {
    if (!serverToDelete) return;
    setIsDeleting(true);
    try {
      await axios.delete(`/api/servers/${serverToDelete.id}`);
      const updatedServers = servers.filter(s => s.id !== serverToDelete.id);
      setServers(updatedServers);
      localStorage.setItem('fps_servers', JSON.stringify(updatedServers));
      setServerToDelete(null);
    } catch (error) {
      console.error("Failed to delete server:", error);
      alert("Failed to delete server. Please try again later.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Max 2 servers per user, unlimited for admins
  const canCreateServer = isAdmin || servers.length < 2;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-100 selection:text-blue-900">
      {error && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white px-6 py-3 rounded-full shadow-lg font-medium flex items-center gap-2 animate-in slide-in-from-top-4">
          <AlertTriangle className="w-5 h-5" />
          {error}
        </div>
      )}
      <header className="px-4 sm:px-8 py-4 sm:py-6 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 flex justify-between items-center">
        <div className="flex items-center gap-3 sm:gap-4">
          <Link to="/" className="text-slate-400 hover:text-blue-600 transition-colors">
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </Link>
          <div className="flex items-center gap-2">
            <img src="https://files.catbox.moe/tl9u70.png" alt="FPS Logo" className="w-8 h-8 rounded-lg shadow-sm" />
            <h1 className="text-lg sm:text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400 tracking-tight">
              <span className="hidden sm:inline">FREE PANELS SERVERS</span>
              <span className="sm:hidden">FPS</span>
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          {pterodactylUsername ? (
            <>
              <div className="text-xs sm:text-sm font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full max-w-[120px] sm:max-w-none truncate">
                👤 {pterodactylUsername}
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-red-600 transition-colors p-2 sm:p-0"
                title="Logout"
              >
                <LogOut className="w-5 h-5 sm:w-5 sm:h-5" />
              </button>
            </>
          ) : (
            <button 
              onClick={() => setIsConnectModalOpen(true)}
              className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors"
            >
              <LinkIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Connect an account</span>
              <span className="sm:hidden">Connect</span>
            </button>
          )}
        </div>
      </header>

      <main className="flex-grow p-4 sm:p-6 md:p-10 max-w-6xl mx-auto w-full">
        {pterodactylUsername && (
          <div className="mb-8 bg-blue-50 border border-blue-100 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-blue-900">Account Information</h2>
                <p className="text-sm text-blue-700 font-medium">Username: {pterodactylUsername}</p>
                {pterodactylEmail && <p className="text-sm text-blue-700 font-medium">Email: {pterodactylEmail}</p>}
                {pterodactylPassword && (
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-blue-700 font-medium">
                      Password: {showPassword ? pterodactylPassword : '••••••••'}
                    </p>
                    <button 
                      onClick={() => setShowPassword(!showPassword)} 
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                )}
              </div>
            </div>
            {panelUrl && (
              <a 
                href={panelUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors border border-blue-200 text-sm w-full sm:w-auto justify-center"
              >
                <ExternalLink className="w-4 h-4" />
                Open Panel
              </a>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-10 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Your Servers</h2>
            <p className="text-sm sm:text-base text-slate-500 mt-1 sm:mt-2 font-medium">Manage your instances ({servers.length}{!isAdmin ? '/2' : ''})</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {!pterodactylUsername && servers.length === 0 && (
              <button 
                onClick={() => setIsConnectModalOpen(true)}
                className="flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 px-6 py-3 rounded-full font-bold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm w-full sm:w-auto"
              >
                <LinkIcon className="w-5 h-5" />
                <span>Connect an account</span>
              </button>
            )}
            <button 
              onClick={() => setIsModalOpen(true)}
              disabled={!canCreateServer}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 shadow-sm w-full sm:w-auto ${
                canCreateServer 
                  ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md hover:shadow-blue-600/20' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Plus className="w-5 h-5" />
              New Server
            </button>
          </div>
        </div>

        {servers.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-16 text-center shadow-sm">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Server className="w-10 h-10 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">No servers</h3>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">You haven't created any servers yet. Deploy your first instance for free in seconds.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-8 py-4 bg-blue-50 text-blue-600 font-semibold rounded-full hover:bg-blue-100 transition-colors"
              >
                Create my first server
              </button>
              {!pterodactylUsername && (
                <button 
                  onClick={() => setIsConnectModalOpen(true)}
                  className="px-8 py-4 bg-white text-slate-700 border border-slate-200 font-semibold rounded-full hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                >
                  <LinkIcon className="w-5 h-5" />
                  Connect an existing account
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {servers.map(server => (
              <ServerCard 
                key={server.id} 
                server={server} 
                panelUrl={panelUrl} 
                onDelete={setServerToDelete} 
                onStatusChange={handleStatusChange}
                onUpgradeClick={setServerToUpgrade}
              />
            ))}
          </div>
        )}
      </main>

      <Footer 
        variant="dashboard" 
        onCreateServer={() => setIsModalOpen(true)}
        panelUrl={panelUrl}
      />

      {isModalOpen && (
        <CreateServerModal 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={handleServerCreated} 
        />
      )}

      {isConnectModalOpen && (
        <ConnectAccountModal 
          onClose={() => setIsConnectModalOpen(false)} 
          onSuccess={handleAccountConnected}
          panelUrl={panelUrl}
        />
      )}

      {serverToUpgrade && (
        <UpgradeModal 
          server={serverToUpgrade}
          onClose={() => setServerToUpgrade(null)}
          onSuccess={handleUpgradeSuccess}
        />
      )}

      {/* Delete Confirmation Modal */}
      {serverToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Server</h3>
              <p className="text-slate-500 mb-6">
                Are you sure you want to delete <strong className="text-slate-900">{serverToDelete.name}</strong>? This action cannot be undone and all data will be lost.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => setServerToDelete(null)}
                  disabled={isDeleting}
                  className="px-6 py-2.5 text-slate-700 font-medium hover:bg-slate-100 rounded-xl transition-colors w-full sm:w-auto order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="px-6 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto order-1 sm:order-2 disabled:opacity-70"
                >
                  {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  Delete Server
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
