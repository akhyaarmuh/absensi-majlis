import { axiosWT } from './index';

const rootPath = '/region';

export const createRegion = async (payload) => {
  const response = await axiosWT.post(`${rootPath}`, payload);
  return response.data.data;
};

export const getAllRegion = async (queries) => {
  const response = await axiosWT.get(`${rootPath}`, { params: queries });
  return response.data;
};

export const updateRegionById = async (payload) => {
  const response = await axiosWT.patch(`${rootPath}/${payload._id}`, payload);
  return response.data;
};

export const deleteRegionById = async (id) => {
  await axiosWT.delete(`${rootPath}/${id}`);
};
