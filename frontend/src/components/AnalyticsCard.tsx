import { motion } from 'framer-motion';
import { BarChart2, MousePointerClick } from 'lucide-react';

interface AnalyticsCardProps {
  visitCount: number;
}

export default function AnalyticsCard({ visitCount }: AnalyticsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="mt-6 p-6 bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-700 flex items-center gap-6 shadow-lg relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-8 text-white/5 pointer-events-none">
        <BarChart2 className="w-24 h-24" />
      </div>
      
      <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center relative z-10 shrink-0">
        <MousePointerClick className="w-7 h-7" />
      </div>
      
      <div className="relative z-10">
        <p className="text-sm font-medium text-slate-400 mb-1 tracking-wide uppercase">
          Total Clicks
        </p>
        <div className="flex items-baseline gap-2">
          {visitCount === 0 ? (
            <span className="text-xl font-medium text-slate-300">
              No clicks yet
            </span>
          ) : (
            <>
              <span className="text-3xl font-bold text-white">
                {visitCount.toLocaleString()}
              </span>
              <span className="text-sm text-slate-500">visits</span>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
