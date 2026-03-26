import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Link2,
    Copy,
    ExternalLink,
    CheckCircle2,
    History,
    Trash2
} from 'lucide-react';
import { RecentLink } from '../hooks/useShortener';
import ConfirmationModal from './ConfirmationModal';

interface HistorySidebarProps {
    isOpen: boolean;
    onClose: () => void;
    links: RecentLink[];
    onClearHistory: () => void;
    onLinkClick: (shortId: string) => void;
}

export default function HistorySidebar({ isOpen, onClose, links, onClearHistory, onLinkClick }: HistorySidebarProps) {
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

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
                        transition={{
                            type: 'spring',
                            damping: 25,
                            stiffness: 200
                        }}
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
                        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 custom-scrollbar">
                            {links.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-4">
                                    <div className="p-5 rounded-full bg-slate-800/50">
                                        <History className="w-12 h-12 opacity-10" />
                                    </div>
                                    <p className="text-sm font-medium">No links created yet</p>
                                </div>
                            ) : (
                                links.map((link) => (
                                    <motion.div
                                        key={link.shortId}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50 hover:border-blue-500/30 hover:bg-slate-800/60 transition-all group overflow-hidden relative"
                                    >
                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-[11px] uppercase font-bold tracking-wider text-slate-500 mb-1 truncate flex items-center gap-1.5 leading-none">
                                                        <Link2 className="w-3 h-3" />
                                                        {link.originalUrl}
                                                    </p>
                                                    <h3 className="text-white font-bold truncate tracking-tight text-base mb-1">
                                                        {link.shortUrl?.replace(/^https?:\/\//, '') || 'Link not available'}
                                                    </h3>
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                                                            <span>👁️</span>
                                                            {link.visitCount === 1 ? "1 click" : `${link.visitCount || 0} clicks`}
                                                        </p>
                                                        {(link.visitCount || 0) > 10 && (
                                                            <span className="text-[11px] font-black text-orange-500/90 uppercase tracking-tight flex items-center gap-1 bg-orange-500/10 px-2 py-0.5 rounded-md border border-orange-500/20">
                                                                🔥 Popular
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Badge */}
                                                <div 
                                                    title={link.isCustom ? "Custom user-defined alias" : "System-generated shortened ID"}
                                                    className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest shrink-0 border
                                                    ${link.isCustom ? 'bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-[0_0_10px_-5px_rgba(168,85,247,0.4)]' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                                                    {link.isCustom ? 'CUSTOM' : 'AUTO'}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 pt-1">
                                                <a
                                                    href={link.shortUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={() => onLinkClick(link.shortId)}
                                                    className="flex-1 flex items-center justify-center gap-2 p-2 rounded-xl bg-slate-700/40 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer border border-transparent hover:border-slate-600"
                                                >
                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                    Visit
                                                </a>

                                                <button
                                                    onClick={() => link.shortUrl && handleCopy(link.shortUrl, link.shortId)}
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
                                    onClick={() => setIsConfirmOpen(true)}
                                    className="w-full flex items-center justify-center gap-2 p-4 text-xs font-bold text-red-500/80 hover:text-red-400 hover:bg-red-400/5 rounded-2xl transition-all cursor-pointer group border border-transparent hover:border-red-500/20 shadow-[0_8px_16px_-8px_rgba(239,68,68,0.2)]"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Clear History
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}

            <ConfirmationModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={onClearHistory}
                title="Clear Link History?"
                message="This action will permanently delete all your shortened links. You cannot undo this change."
                confirmText="Yes, Clear All"
                cancelText="No, Keep Them"
                type="danger"
            />
        </AnimatePresence>
    );
}

