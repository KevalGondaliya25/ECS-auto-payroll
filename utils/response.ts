export const Response = (
  status: boolean,
  message: string,
  data: any,
  current?: number,
  pageSize?: number,
  total?: number
) => {
  return {
    status,
    message,
    data,
    current,
    pageSize,
    total,
  };
};
