import { useState } from 'react';
import Navbar from '../components/Navbar';
import URLForm from '../components/URLForm';
import ResultCard from '../components/ResultCard';
import HistorySidebar from '../components/HistorySidebar';
import { Network } from 'lucide-react';
import { motion } from 'framer-motion';
import { useShortener } from '../hooks/useShortener';

export default function Home() {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const { 
    loading, 
    error, 
    result, 
    originalUrl, 
    recentLinks, 
    handleShorten 
  } = useShortener();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 relative pb-16 overflow-x-hidden">
      <Navbar 
        onHistoryToggle={() => setIsHistoryOpen(!isHistoryOpen)} 
        historyCount={recentLinks.length} 
      />
      
      <HistorySidebar 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
        links={recentLinks} 
      />
      
      {/* Background aesthetic blobs */}
      <div className="absolute top-0 inset-x-0 h-[500px] overflow-hidden pointer-events-none -pe-z">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[100px]" />
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/10 blur-[120px]" />
      </div>

      <main className="pt-32 px-6 md:px-12 max-w-5xl mx-auto relative z-10 flex flex-col items-center">
        <URLForm 
          onShorten={handleShorten} 
          isLoading={loading} 
          error={error} 
        />

        <div className="w-full max-w-2xl mt-4 space-y-4">
          {result && (
            <>
             <ResultCard shortUrl={result.shortUrl} originalUrl={originalUrl} />
            </>
          )}

          {!result && !loading && !error && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.2 }}
              className="mt-16 flex flex-col items-center justify-center text-slate-500/50"
            >
              <Network className="w-24 h-24 mb-6 opacity-20" />
              <p className="max-w-md text-center text-slate-400">
                Enter your long link above to generate a short, ready-to-share URL. Perfect for social media, texts, and quick sharing.
              </p>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}


