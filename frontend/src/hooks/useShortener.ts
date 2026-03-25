import {useState, useEffect} from 'react';
import {shortenUrl, ShortenResponse} from '../services/api';
import toast from 'react-hot-toast';
import {handleError} from '../utils/errorHandler';

export interface RecentLink {
    shortId: string;
    shortUrl: string;
    originalUrl: string;
}

const STORAGE_KEY = 'shortify_recent_links';

export function useShortener() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState < string | null > (null);
    const [result, setResult] = useState < ShortenResponse['data'] | null > (null);
    const [originalUrl, setOriginalUrl] = useState < string > ('');
    const [recentLinks, setRecentLinks] = useState < RecentLink[] > ([]);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed: RecentLink[] = JSON.parse(stored);
                const validLinks = parsed.filter(link => link.originalUrl ?. trim() && link.shortUrl ?. trim());
                setRecentLinks(validLinks);
            } catch (e) {
                console.error('Failed to parse recent links from localStorage', e);
            }
        }
    }, []);

    const handleShorten = async (url : string) => {
        setLoading(true);
        setError(null);
        setResult(null);
        setOriginalUrl(url);

        try {
            const res = await shortenUrl(url);

            // Accessing with the exact data.data pattern requested
            const urlData = res.data.data;

            // Ensure data is valid before updating
            if (! urlData || ! urlData.shortUrl || ! urlData.shortId) {
                console.error("Invalid response structure:", res.data);
                throw new Error("Invalid response from server");
            }

            setResult(urlData);

            toast.success('URL shortened successfully!', {
                style: {
                    background: '#1e293b',
                    color: '#f8fafc',
                    border: '1px solid #334155'
                },
                iconTheme: {
                    primary: '#3b82f6',
                    secondary: '#1e293b'
                }
            });

            // Update recent links with deduplication
            setRecentLinks(prev => {
                const exists = prev.some(link => link.originalUrl ?. toLowerCase() === url.toLowerCase());

                if (exists) {
                    return prev;
                }

                const newLink: RecentLink = {
                    shortId: urlData.shortId,
                    shortUrl: urlData.shortUrl,
                    originalUrl: url
                };

                const updated = [
                    newLink,
                    ...prev
                ].slice(0, 20);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
                return updated;
            });
        } catch (err : unknown) {
            const message = handleError(err);
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        result,
        originalUrl,
        recentLinks,
        handleShorten
    };
}
