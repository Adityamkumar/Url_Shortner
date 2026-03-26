import toast from 'react-hot-toast';
import axios from 'axios';

export const getErrorMessage = (status?: number, responseMessage?: string): string => {
  if (status === 409) return 'Alias already taken, try another one';
  if (status === 429) return 'Too many requests, try again later';
  if (status === 400 && responseMessage) return responseMessage;
  
  return 'Something went wrong';
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
