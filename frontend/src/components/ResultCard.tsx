import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, CheckCircle2, ExternalLink, Sparkles, Link as LinkIcon } from 'lucide-react';
import toast from 'react-hot-toast';

interface ResultCardProps {
  shortId: string;
  shortUrl: string;
  originalUrl: string;
  isCustom: boolean;
  visitCount: number;
  onVisit: (id: string) => void;
}

export default function ResultCard({ shortId, shortUrl, originalUrl, isCustom, visitCount, onVisit }: ResultCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    toast.success('Copied to clipboard!', {
        id: 'copy-toast',
        style: {
            background: '#1e293b',
            color: '#f8fafc',
            border: '1px solid #334155'
        }
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mt-8 p-8 bg-slate-800/40 backdrop-blur-xl rounded-3xl border border-white/10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
        <Sparkles className="w-6 h-6 text-blue-400" />
      </div>

      <div className="flex flex-col gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest">
            <LinkIcon className="w-3 h-3" />
            <span>Original Link</span>
          </div>
          <p className="text-sm text-slate-400 truncate max-w-md font-light" title={originalUrl}>
            {originalUrl}
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-blue-400/80 text-xs font-bold uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                <span>Short Link Ready</span>
            </div>

            <div 
                title={isCustom ? "Custom user-defined alias" : "System-generated shortened ID"}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest cursor-help transition-all hover:scale-105 border
                ${isCustom ? 'bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-[0_0_15px_-5px_rgba(168,85,247,0.5)]' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                {isCustom ? 'CUSTOM ALIAS' : 'AUTO GENERATED'}
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
            <div className="flex-1 bg-slate-900/50 rounded-2xl p-4 border border-white/5 group-hover:border-blue-500/20 transition-colors">
              <span className="text-xl md:text-2xl font-bold text-white break-all tracking-tight">
                {shortUrl?.replace(/^https?:\/\//, '') || 'Link not available'}
              </span>
              <div className="mt-2 flex items-center gap-2">
                <p className="text-sm text-slate-500 font-medium flex items-center gap-1.5 bg-slate-800/50 px-3 py-1.5 rounded-xl border border-white/5">
                  <span>👁️</span>
                  {visitCount === 1 ? "1 click" : `${visitCount || 0} clicks`}
                </p>
                {visitCount > 10 && (
                  <span className="text-[10px] font-black text-orange-500/90 uppercase tracking-tight flex items-center gap-1 bg-orange-500/10 px-2.5 py-1.5 rounded-xl border border-orange-500/20">
                    🔥 Popular
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onVisit(shortId)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-blue-600/20 font-bold text-sm cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open</span>
              </a>

              <button
                onClick={handleCopy}
                className={`flex items-center gap-2 px-6 py-4 rounded-2xl transition-all active:scale-95 font-bold text-sm cursor-pointer border
                  ${copied 
                    ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                    : 'bg-slate-700/50 hover:bg-slate-700 text-white border-transparent'
                  }`}
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.div
                      key="copied"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Copied</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="copy"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="flex items-center gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

