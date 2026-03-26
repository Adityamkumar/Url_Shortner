import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, X, AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning';
}

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Delete All',
    cancelText = 'Cancel',
    type = 'danger'
}: ConfirmationModalProps) {
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
                        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] cursor-pointer"
                    />

                    {/* Modal Wrapper */}
                    <div className="fixed inset-0 flex items-center justify-center z-[110] p-4 pointer-events-none">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 30 }}
                            transition={{ 
                                type: 'spring', 
                                damping: 25, 
                                stiffness: 400,
                                mass: 0.8
                            }}
                            className="bg-slate-900 border border-white/10 w-full max-w-[380px] rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] overflow-hidden pointer-events-auto relative"
                        >
                            {/* Accent Glow */}
                            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 blur-[80px] -z-10 ${
                                type === 'danger' ? 'bg-red-500/30' : 'bg-orange-500/30'
                            }`} />

                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer group"
                            >
                                <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                            </button>

                            {/* Content */}
                            <div className="px-8 pt-10 pb-8 flex flex-col items-center">
                                {/* Icon Container */}
                                <div className={`mb-6 relative`}>
                                    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center border-2 border-dashed ${
                                        type === 'danger' ? 'bg-red-500/10 border-red-500/30' : 'bg-orange-500/10 border-orange-500/30'
                                    }`}>
                                        {type === 'danger' ? (
                                            <Trash2 className="w-10 h-10 text-red-500" />
                                        ) : (
                                            <AlertTriangle className="w-10 h-10 text-orange-500" />
                                        )}
                                    </div>
                                </div>

                                <h3 className="text-2xl font-black text-white mb-2 tracking-tight text-center">
                                    {title}
                                </h3>
                                <p className="text-slate-400 text-sm leading-relaxed text-center mb-8 px-2">
                                    {message}
                                </p>

                                {/* Buttons Container */}
                                <div className="flex flex-col w-full gap-3">
                                    <button
                                        onClick={() => {
                                            onConfirm();
                                            onClose();
                                        }}
                                        className={`w-full py-4 rounded-2xl font-bold text-sm transition-all shadow-xl active:scale-[0.98] cursor-pointer ${
                                            type === 'danger' 
                                            ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20' 
                                            : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20'
                                        }`}
                                    >
                                        {confirmText}
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="w-full py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-sm transition-all border border-transparent hover:border-white/10 cursor-pointer"
                                    >
                                        {cancelText}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
