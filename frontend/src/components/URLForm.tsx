import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, Loader2 } from 'lucide-react';

interface URLFormProps {
  onShorten: (url: string) => void;
  isLoading: boolean;
  error: string | null;
}

export default function URLForm({ onShorten, isLoading, error }: URLFormProps) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onShorten(url);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-4 tracking-tight">
          Shorten Your URLs
        </h1>
        <p className="text-slate-400 text-lg">
          A fast and minimal tool to compress long, ugly links into manageable ones.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute inset-y-0 left-4 z-10 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-400 transition-colors">
          <Link className="w-5 h-5" />
        </div>
        
        <input
          type="url"
          required
          placeholder="Paste your long URL here..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 text-white rounded-2xl py-4 pl-12 pr-32 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 hover:border-slate-600 transition-all shadow-xl shadow-black/20"
          disabled={isLoading}
        />
        
        <motion.button
          whileHover={url.trim() && !isLoading ? { scale: 1.02 } : {}}
          whileTap={url.trim() && !isLoading ? { scale: 0.98 } : {}}
          type="submit"
          disabled={isLoading || !url.trim()}
          className={`absolute right-2 top-2 bottom-2 px-6 rounded-xl font-medium transition-all flex items-center justify-center min-w-[100px] 
            ${url.trim() && !isLoading 
              ? 'bg-blue-600 hover:bg-blue-500 text-white cursor-pointer shadow-lg shadow-blue-500/20' 
              : 'bg-slate-700/40 text-slate-500 cursor-not-allowed border border-slate-700/50'
            }`}
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Shorten'}
        </motion.button>
      </form>

      <div className="min-h-[24px] mt-3 px-4">
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="text-red-400 text-sm"
          >
            {error}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
