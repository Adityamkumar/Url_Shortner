import toast from 'react-hot-toast';
import axios from 'axios';

export const getErrorMessage = (status?: number, responseMessage?: string): string => {
  if (responseMessage?.trim()) return responseMessage.trim();
  switch (status) {
    case 400:
      return 'Invalid URL. Please enter a valid Url.';
    case 404:
      return 'Url not found.';
    case 429:
      return 'Too many requests. Please try again later.';
    case 500:
      return 'Something went wrong. Please try again.';
  }

  return 'Something went wrong. Please try again later.';
};

export const handleError = (error: unknown): string => {
  let message = 'Something went wrong. Please try again.';
  let status: number | undefined;

  if (axios.isAxiosError(error)) {
    status = error.response?.status;
    const responseData = error.response?.data as { message?: string } | undefined;
    message = getErrorMessage(status, responseData?.message);
  } else if (error instanceof Error) {
    message = error.message;
  }

  toast.error(message, {
    style: {
      background: '#1e293b',
      color: '#f8fafc',
      border: '1px solid #334155',
    },
    iconTheme: {
      primary: '#f87171',
      secondary: '#1e293b',
    },
    duration: 4000,
  });

  return message;
};
