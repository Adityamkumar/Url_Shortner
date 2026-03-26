import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, Loader2, AtSign, AlertCircle } from 'lucide-react';

interface URLFormProps {
  onShorten: (url: string, alias: string) => void;
  isLoading: boolean;
  error: string | null;
}

export default function URLForm({ onShorten, isLoading, error }: URLFormProps) {
  const [url, setUrl] = useState('');
  const [alias, setAlias] = useState('');
  const [aliasError, setAliasError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const validateAlias = (val: string) => {
    if (val.length > 20) return "Alias must be 20 characters or less";
    if (val && !/^[a-zA-Z0-9\-_]+$/.test(val)) return "Only letters, numbers, - and _ allowed";
    return null;
  };

  const handleAliasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setAlias(val);
    setAliasError(validateAlias(val));
  };

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    const validationError = validateAlias(alias);
    if (validationError) {
      setAliasError(validationError);
      return;
    }
    if (url.trim()) {
      onShorten(url, alias);
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
        <p className="text-slate-400 text-lg font-light">
          A fast and minimal tool to compress long, ugly links into manageable ones.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 z-10 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-400 transition-colors">
            <Link className="w-5 h-5" />
          </div>
          
          <input
            ref={inputRef}
            type="url"
            required
            placeholder="Paste your long URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full bg-slate-800/40 backdrop-blur-md border border-slate-700/50 text-white rounded-2xl py-4 pl-12 pr-32 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 hover:border-slate-600 transition-all shadow-xl shadow-black/20"
            disabled={isLoading}
          />
          
          <motion.button
            whileHover={url.trim() && !isLoading && !aliasError ? { scale: 1.02 } : {}}
            whileTap={url.trim() && !isLoading && !aliasError ? { scale: 0.98 } : {}}
            type="submit"
            disabled={isLoading || !url.trim() || !!aliasError}
            className={`absolute right-2 top-2 bottom-2 px-6 rounded-xl font-medium transition-all flex items-center justify-center min-w-[100px] 
              ${url.trim() && !isLoading && !aliasError
                ? 'bg-blue-600 hover:bg-blue-500 text-white cursor-pointer shadow-lg shadow-blue-500/20' 
                : 'bg-slate-700/40 text-slate-500 cursor-not-allowed border border-slate-700/50'
              }`}
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Shorten'}
          </motion.button>
        </div>

        <div className="flex flex-col gap-2">
            <div className="relative group">
                <div className="absolute inset-y-0 left-4 z-10 flex items-center pointer-events-none text-slate-400 group-focus-within:text-cyan-400 transition-colors">
                    <AtSign className="w-4 h-4" />
                </div>
                <input
                    type="text"
                    placeholder="Custom alias (optional)"
                    value={alias}
                    onChange={handleAliasChange}
                    className={`w-full bg-slate-800/30 backdrop-blur-sm border text-sm text-white rounded-xl py-3 pl-11 pr-4 focus:outline-none transition-all
                        ${aliasError ? 'border-red-500/50 focus:ring-2 focus:ring-red-500/30' : 'border-slate-700/50 focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50 hover:border-slate-600'}
                    `}
                    disabled={isLoading}
                />
            </div>
            
            <AnimatePresence mode="wait">
                {aliasError && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center gap-2 px-2 text-red-400 text-xs font-medium"
                    >
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{aliasError}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </form>

      <div className="min-h-[24px] mt-4 px-4">
        {error && !aliasError && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="text-red-400 text-sm flex items-center gap-2 justify-center"
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}

