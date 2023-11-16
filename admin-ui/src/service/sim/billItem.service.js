import { handleRequest } from '../../utils/axios';

export const findBillItemsAPI = async (data) => {
  const config = {
    method: 'post',
    url: '/admin/billItem/search/',
    data
  };
  return handleRequest(config);
};

export const getBillItemByIdAPI = async (id) => {
  const config = {
    method: 'get',
    url: `/admin/billItem/${id}`,
  };
  return handleRequest(config);
};

export const createBillItemAPI = async (data) => {
  const config = {
    method: 'post',
    url: '/admin/billItem/',
    data
  };
  return handleRequest(config);
};

export const updateBillItemAPI = async (data) => {
  const config = {
    method: 'put',
    url: '/admin/billItem/',
    data
  };
  return handleRequest(config);
};

export const deleteBillItemAPI = async (id) => {
  const config = {
    method: 'delete',
    url: `/admin/billItem/${id}`,
  };
  return handleRequest(config);
};

export const deleteBillItemsAPI = async (id) => {
  const config = {
    method: 'delete',
    url: `/admin/billItem/${id}`,
  };
  return handleRequest(config);
};
