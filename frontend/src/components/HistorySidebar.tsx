import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Link2, Copy, ExternalLink, CheckCircle2, History, Trash2 } from 'lucide-react';
import { RecentLink } from '../hooks/useShortener';

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  links: RecentLink[];
}

export default function HistorySidebar({ isOpen, onClose, links }: HistorySidebarProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-full max-w-[320px] bg-slate-900 border-r border-white/10 z-[70] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-white/10 bg-slate-800/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <History className="w-5 h-5 text-blue-400" />
                </div>
                <h2 className="text-lg font-bold text-white tracking-tight">History</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Links List */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3 custom-scrollbar">
              {links.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-3">
                  <div className="p-4 rounded-full bg-slate-800/50">
                    <History className="w-10 h-10 opacity-20" />
                  </div>
                  <p className="text-sm">No history found</p>
                </div>
              ) : (
                links.map((link) => (
                  <motion.div
                    key={link.shortId}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50 hover:border-blue-500/30 hover:bg-slate-800/60 transition-all group"
                  >
                    <div className="flex flex-col gap-3">
                      <div className="min-w-0">
                        <p className="text-xs text-slate-500 mb-1 truncate flex items-center gap-1.5 leading-none">
                          <Link2 className="w-3 h-3" />
                          {link.originalUrl}
                        </p>
                        <h3 className="text-blue-400 font-bold truncate tracking-tight text-sm">
                          {link.shortUrl.replace(/^https?:\/\//, '')}
                        </h3>
                      </div>
                      
                      <div className="flex items-center gap-2 pt-1">
                        <a
                          href={link.shortUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 p-2 rounded-xl bg-slate-700/50 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer border border-transparent hover:border-slate-600"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Visit
                        </a>
                        
                        <button
                          onClick={() => handleCopy(link.shortUrl, link.shortId)}
                          className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-xl border font-semibold transition-all cursor-pointer text-xs
                            ${copiedId === link.shortId 
                              ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                              : 'bg-blue-600/10 border-blue-600/20 text-blue-400 hover:bg-blue-600/20'
                            }`}
                        >
                          {copiedId === link.shortId ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              Copy
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {links.length > 0 && (
              <div className="p-4 border-t border-white/10 bg-slate-800/10">
                <button
                  onClick={() => {
                    localStorage.removeItem('shortify_recent_links');
                    window.location.reload(); // Quick way to clear state
                  }}
                  className="w-full flex items-center justify-center gap-2 p-3 text-xs font-bold text-red-400/70 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all cursor-pointer group"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear History
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
