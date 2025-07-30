// utils/responseHandler.ts

export function handleResponse({
  success = true,
  message = '',
  data = null,
}: {
  success?: boolean;
  message?: string;
  data?: any;
}) {
  return {
    success,
    message,
    timestamp: new Date().toISOString(),
    data,
  };
}
