import axios from 'axios';

const API_URL = '/api/canho';

export const getCanHoList = () => {
  return axios.get(API_URL);
};

export const createCanHo = (data) => {
  return axios.post(API_URL, data);
};

export const updateCanHo = (id, data) => {
  return axios.put(`${API_URL}/${id}`, data);
};

export const deleteCanHo = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};
