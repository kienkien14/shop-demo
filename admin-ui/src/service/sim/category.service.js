import { handleRequest } from '../../utils/axios';

export const findCategoriesAPI = async (search) => {
  const config = {
    method: 'post',
    url: '/admin/category/search',
    headers: {
      'Content-Type': 'application/json',
    },
    data: search
  };
  return handleRequest(config);
};

export const getCategoryByIdAPI = async (id) => {
  const config = {
    method: "get",
    url: `/admin/category/${id}`,
  };
  return handleRequest(config);
};

export const createCategoryAPI = async (data) => {
  const config = {
    method: 'post',
    url: '/admin/category/',
    data
  };

  return handleRequest(config);
};

export const updateCategoryAPI = async (data) => {
  const config = {
    method: 'put',
    url: '/admin/category/',
    data
  };
  return handleRequest(config);
};

export const deleteCategoryAPI = async (id) => {
  const config = {
    url: `/admin/category/${id}`,
    method: 'DELETE'
  };
  return handleRequest(config);
};

export const deleteCategoriesAPI = async (ids) => {
  const config = {
    url: `category/all/${ids.toString()}`,
    method: 'DELETE'
  };
  return handleRequest(config);
};