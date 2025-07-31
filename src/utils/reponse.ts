// export const handleResponse = ({
//   success,
//   message,
//   data = null,
// }: {
//   success: boolean;
//   message: string | Error;
//   data?: any;
// }) => {
//   return {
//     success,
//     message: typeof message === 'string' ? message : message.message,
//     timestamp: new Date().toISOString(),
//     data,
//   };
// };

export const handleResponse = ({
  success,
  message,
  data,
}: {
  success: boolean;
  message: string | Error;
  data?: any;
}) => {
  return {
    success,
    message: typeof message === 'string' ? message : message.message,
    timestamp: new Date().toISOString(),
    ...(data !== undefined && data !== null && { data }),
  };
};
