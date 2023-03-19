import { axiosWT } from './index';

const rootPath = '/member';

export const createMember = async (payload) => {
  const response = await axiosWT.post(`${rootPath}`, payload);
  return response.data.data;
};

export const uploadImage = async (id, formData) => {
  await axiosWT.post(`${rootPath}/${id}/image`, formData, {
    headers: { 'Content-type': 'multipart-form-data' },
  });
};

export const getAllMember = async (queries) => {
  const response = await axiosWT.get(`${rootPath}`, { params: queries });
  return response.data;
};

export const updateMemberById = async (payload) => {
  const response = await axiosWT.patch(`${rootPath}/${payload._id}`, payload);
  return response.data;
};

export const updateStatusById = async (id) => {
  await axiosWT.patch(`${rootPath}/${id}/status`);
};

export const resetAbsentById = async (id) => {
  await axiosWT.patch(`${rootPath}/${id}/absent`);
};

export const deleteMemberById = async (id) => {
  await axiosWT.delete(`${rootPath}/${id}`);
};

export const deleteImageById = async (id) => {
  await axiosWT.delete(`${rootPath}/${id}/image`);
};
