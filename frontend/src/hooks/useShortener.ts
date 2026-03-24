import { useState, useEffect } from 'react';
import axios from 'axios';
import { shortenUrl, getAnalytics, ShortenResponse } from '../services/api';
import toast from 'react-hot-toast';

export interface RecentLink {
  shortId: string;
  shortUrl: string;
  originalUrl: string;
}

const STORAGE_KEY = 'shortify_recent_links';

export function useShortener() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ShortenResponse['data'] | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>('');
  const [visitCount, setVisitCount] = useState<number | null>(null);
  const [recentLinks, setRecentLinks] = useState<RecentLink[]>([]);

  // Initialize from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setRecentLinks(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse recent links from localStorage', e);
      }
    }
  }, []);

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
      
      // Update recent links
      const newLink: RecentLink = {
        shortId: resp.data.shortId,
        shortUrl: resp.data.shortUrl,
        originalUrl: url
      };

      setRecentLinks(prev => {
        // Filter out if it already exists (move to top)
        const filtered = prev.filter(l => l.shortId !== newLink.shortId);
        const updated = [newLink, ...filtered].slice(0, 20);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
      
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
    recentLinks,
    handleShorten
  };
}
