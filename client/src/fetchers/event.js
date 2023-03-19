import { axiosWT } from './index';

const rootPath = '/event';

export const createEvent = async (payload) => {
  const response = await axiosWT.post(`${rootPath}`, payload);
  return response.data.data;
};

export const getAllEvent = async (queries) => {
  const response = await axiosWT.get(`${rootPath}`, { params: queries });
  return response.data;
};

export const updateEventById = async (payload) => {
  const response = await axiosWT.patch(`${rootPath}/${payload._id}`, payload);
  return response.data;
};

export const updateStatusById = async (id, type) => {
  const response = await axiosWT.patch(`${rootPath}/${id}/status`, { type });
  return response.data;
};

export const deleteEventById = async (id) => {
  await axiosWT.delete(`${rootPath}/${id}`);
};
