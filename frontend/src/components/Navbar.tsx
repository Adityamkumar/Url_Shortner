import { History } from 'lucide-react';

interface NavbarProps {
  onHistoryToggle: () => void;
  historyCount: number;
}

export default function Navbar({ onHistoryToggle, historyCount }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-slate-900/80 backdrop-blur-md border-b border-white/10 z-50">
      <div className="w-full max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        {/* Left Section: history + logo */}
        <div className="flex items-center">
          <button
            onClick={onHistoryToggle}
            className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/50 hover:bg-slate-800 text-slate-400 hover:text-white transition-all active:scale-95 cursor-pointer relative group mr-8"
            title="Link History"
          >
            <History className="w-5 h-5" />
            {historyCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white border-2 border-slate-900 ring-1 ring-blue-500/20">
                {historyCount}
              </span>
            )}
          </button>
          
          <div className="flex items-center gap-1 transition-transform hover:scale-105 duration-200 cursor-pointer">
            <div className="w-14 h-14 flex items-center justify-center">
              <img 
                src="/shortify_icon.png" 
                alt="Shortify Logo" 
                className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(34,211,238,0.6)]" 
              />
            </div>
            <span className="font-bold text-2xl tracking-tighter text-white/95">Shortify</span>
          </div>
        </div>
        
        {/* Right Side: Account actions */}
        <div className="flex items-center gap-4">
          <button className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-200 cursor-pointer">
            Sign In
          </button>
        </div>
      </div>
    </nav>
  );
}

