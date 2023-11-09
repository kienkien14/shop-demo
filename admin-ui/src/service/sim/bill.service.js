import { handleRequest } from '../../utils/axios';

export const findBillsAPI = async (data) => {
  const config = {
    method: 'post',
    url: '/admin/bill/search/',
    data
  };
  return handleRequest(config);
};

export const getBillByIdAPI = async (id) => {
  const config = {
    method: 'get',
    url: `/admin/bill/${id}`,
  };
  return handleRequest(config);
};

export const createBillAPI = async (data) => {
  const config = {
    method: 'post',
    url: '/admin/bill/',
    data
  };
  return handleRequest(config);
};

export const updateBillAPI = async (data) => {
  const config = {
    method: 'put',
    url: '/admin/bill/',
    data
  };
  return handleRequest(config);
};

export const deleteBillAPI = async (id) => {
  const config = {
    method: 'delete',
    url: `/admin/bill/${id}`,
  };
  return handleRequest(config);
};

export const deleteBillsAPI = async (id) => {
  const config = {
    method: 'delete',
    url: `/admin/bill/${id}`,
  };
  return handleRequest(config);
};
