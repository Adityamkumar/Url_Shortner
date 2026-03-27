import {useState, useEffect} from 'react';
import {shortenUrl, ShortenResponse} from '../services/api';
import toast from 'react-hot-toast';
import {handleError} from '../utils/errorHandler';

export interface RecentLink {
    shortId: string;
    shortUrl: string;
    originalUrl: string;
    isCustom: boolean;
    visitCount: number;
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
                // Ensure isCustom exists, defaulting to false (AUTO) if missing
                const validLinks = parsed
                    .filter(link => link.originalUrl?.trim() && link.shortUrl?.trim())
                    .map(link => ({
                        ...link,
                        isCustom: link.isCustom ?? false,
                        visitCount: link.visitCount ?? 0
                    }));
                setRecentLinks(validLinks);
            } catch (e) {
                console.error('Failed to parse recent links from localStorage', e);
            }
        }
    }, []);

    const handleShorten = async (url : string, customAlias?: string) => {
        setLoading(true);
        setError(null);
        setResult(null);
        setOriginalUrl(url);

        try {
            const res = await shortenUrl(url, customAlias);
            const urlData = res.data.data;
            console.log(urlData)
            if (! urlData || ! urlData.shortUrl || ! urlData.shortId) {
                console.error("Invalid response structure:", res.data);
                throw new Error("Invalid response from server");
            }

            setResult(urlData);
            
            setRecentLinks(prev => {
                const newLink: RecentLink = {
                    shortId: urlData.shortId,
                    shortUrl: urlData.shortUrl,
                    originalUrl: url,
                    isCustom: urlData.isCustom,
                    visitCount: urlData.visitCount ?? 0
                };

                const filtered = prev.filter(l => l.shortId !== newLink.shortId);
                const updated = [newLink, ...filtered];
                
                const sliced = updated.slice(0, 10);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(sliced));
                return sliced;
            });

            toast.success('Short URL ready!', {
                style: {
                    background: '#1e293b',
                    color: '#f8fafc',
                    border: '1px solid #334155'
                }
            });
        } catch (err : unknown) {
            const message = handleError(err);
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const clearHistory = () => {
        setRecentLinks([]);
        localStorage.removeItem(STORAGE_KEY);
        toast.success('History cleared successfully');
    };

    const incrementVisitCount = (shortId: string) => {
        setRecentLinks(prev => {
            const updated = prev.map(link => 
                link.shortId === shortId 
                    ? { ...link, visitCount: (link.visitCount || 0) + 1 } 
                    : link
            );
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    };

    return {
        loading,
        error,
        result,
        originalUrl,
        recentLinks,
        handleShorten,
        clearHistory,
        incrementVisitCount
    };
}
