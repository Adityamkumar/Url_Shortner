import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface ShortenResponse {
  statusCode: number;
  data: {
    shortId: string;
    shortUrl: string;
  };
  message: string;
  success: boolean;
}

export const shortenUrl = async (originalUrl: string): Promise<ShortenResponse> => {
  const response = await apiClient.post<ShortenResponse>('/shortId', { originalUrl });
  return response.data;
};

export interface AnalyticsResponse {
  visitCount: number;
}

export const getAnalytics = async (shortId: string): Promise<AnalyticsResponse> => {
  const response = await apiClient.get<AnalyticsResponse>(`/analytics/${shortId}`);
  return response.data;
};
