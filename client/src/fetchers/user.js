import { axiosWT } from './index';

const rootPath = '/user';

export const getAllUser = async () => {
  const response = await axiosWT.get(`${rootPath}`);
  return response.data;
};

export const getUserById = async (id) => {
  const response = await axiosWT.get(`${rootPath}/${id}`);
  return response.data.data;
};

export const updateUserById = async (payload) => {
  const response = await axiosWT.patch(`${rootPath}/${payload._id}`, payload);
  return response.data.data;
};

export const updatePasswordById = async (id, password) => {
  await axiosWT.patch(`${rootPath}/${id}/password`, { password });
};

export const updateStatusById = async (id) => {
  await axiosWT.patch(`${rootPath}/${id}/status`);
};

export const deleteUserById = async (id) => {
  await axiosWT.delete(`${rootPath}/${id}`);
};
