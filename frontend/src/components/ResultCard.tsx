import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, CheckCircle2, ExternalLink } from 'lucide-react';

interface ResultCardProps {
  shortUrl: string;
  originalUrl: string;
}

export default function ResultCard({ shortUrl, originalUrl }: ResultCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="mt-8 p-6 bg-slate-800/80 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1 w-full overflow-hidden">
          <p className="text-sm text-slate-400 mb-1 truncate" title={originalUrl}>
            {originalUrl}
          </p>
          <div className="flex items-center gap-3 mt-1">
            <span 
              className="text-xl font-semibold text-blue-400 cursor-help"
              title={shortUrl}
            >
              {shortUrl.replace(/^https?:\/\//, '')}
            </span>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row w-full md:w-auto gap-3 mt-4 md:mt-0">
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-xl transition-all active:scale-95 w-full md:w-auto justify-center font-medium cursor-pointer"
          >
            <ExternalLink className="w-5 h-5" />
            <span>Open</span>
          </a>

          <button
            onClick={handleCopy}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-5 py-3 rounded-xl transition-all active:scale-95 w-full md:w-auto justify-center font-medium cursor-pointer"
          >
          {copied ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-5 h-5" />
              <span>Copy</span>
            </>
          )}
        </button>
        </div>
      </div>
    </motion.div>
  );
}
