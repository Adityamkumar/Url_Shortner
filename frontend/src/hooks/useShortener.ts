import { useState } from 'react';
import axios from 'axios';
import { shortenUrl, getAnalytics, ShortenResponse } from '../services/api';
import toast from 'react-hot-toast';

export function useShortener() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ShortenResponse['data'] | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>('');
  const [visitCount, setVisitCount] = useState<number | null>(null);

  const handleShorten = async (url: string) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setVisitCount(null);
    setOriginalUrl(url);

    try {
      const resp = await shortenUrl(url);
      setResult(resp.data);
      toast.success('URL shortened successfully!');
      
      const analytics = await getAnalytics(resp.data.shortId);
      setVisitCount(analytics.visitCount);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to shorten url. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    result,
    originalUrl,
    visitCount,
    handleShorten
  };
}
