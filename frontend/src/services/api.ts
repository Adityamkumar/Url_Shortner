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
}

export const shortenUrl = async (originalUrl: string) => {
  return apiClient.post<ShortenResponse>('/shortId', { originalUrl });
};

