import axios from 'axios';
import { axiosWT } from '.';

const rootPath = '/attendance-book';

export const createPresent = async (payload) => {
  const response = await axios.post(`${rootPath}`, payload);
  return response.data.data;
};

export const getAllPresentByEvent = async (idEvent, queries = {}) => {
  const response = await axiosWT.get(`${rootPath}/${idEvent}`, { params: queries });
  return response.data;
};
