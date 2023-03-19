import { axiosWT } from '.';

const rootPath = '/present-book';

export const createPresent = async (payload) => {
  const response = await axiosWT.post(`${rootPath}`, payload);
  return response.data.data;
};