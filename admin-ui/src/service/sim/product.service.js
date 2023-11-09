import { handleRequest } from '../../utils/axios';

export const findProductsAPI = async (data) => {
  const config = {
    method: 'post',
    url: '/admin/product/search/',
    data
  };
  return handleRequest(config);
};

export const getProductByIdAPI = async (id) => {
  const config = {
    method: 'get',
    url: `/admin/product/${id}`,
  };
  return handleRequest(config);
};

export const createProductAPI = async (data) => {
  const config = {
    method: 'post',
    url: '/admin/product/',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data
  };
  return handleRequest(config);
};

export const updateProductAPI = async (data) => {
  const config = {
    method: 'put',
    url: '/admin/product/',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data
  };
  return handleRequest(config);
};

export const deleteProductAPI = async (id) => {
  const config = {
    method: 'delete',
    url: `/admin/product/${id}`,
  };
  return handleRequest(config);
};

export const deleteProductsAPI = async (id) => {
  const config = {
    method: 'delete',
    url: `/admin/product/${id}`,
  };
  return handleRequest(config);
};
