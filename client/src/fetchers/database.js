import { axiosWT } from './index';

const rootPath = '/database';

export const restoreDatabase = async (formData) => {
  await axiosWT.post(`${rootPath}`, formData, {
    headers: { 'Content-type': 'multipart-form-data' },
  });
};