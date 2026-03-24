
export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-slate-900/80 backdrop-blur-md border-b border-white/10 z-50 flex items-center justify-center">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <div className="w-16 h-16 flex items-center justify-center transition-transform hover:scale-110 duration-200">
            <img 
              src="/shortify_icon.png" 
              alt="Shortify Logo" 
              className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(34,211,238,0.6)]" 
            />
          </div>
          <span className="font-bold text-2xl tracking-tighter text-white/95">Shortify</span>
        </div>
        
        {/* Optional right side for future features */}
        <div className="flex gap-4">
          <button className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-200 cursor-pointer">
            Sign In
          </button>
        </div>
      </div>
    </nav>
  );
}
