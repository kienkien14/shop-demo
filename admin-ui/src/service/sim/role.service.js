import { handleRequest } from '../../utils/axios';


export const findMediaRolesAPI = async (search) => {
  const config = {
    method: 'post',
    url: '/admin/role/search/',
    headers: {
      'Content-Type': 'application/json',
    },
    data: search,
  };

  return handleRequest(config);
};

export const getMediaRoleByIdAPI = async (id) => {
  const config = {
    method: "get",
    url: `/admin/user/${id}`,
  };
  return handleRequest(config);
};

export const createMediaRoleAPI = async (data) => {
  const config = {
    method: 'post',
    url: '/admin/role/',
    data
  };
  return handleRequest(config);
};

export const updateMediaRoleAPI = async (data) => {
  const config = {
    method: 'put',
    url: '/admin/role/',
    data
  };
  return handleRequest(config);
};

export const deleteMediaRoleAPI = async (id) => {
  const config = {
    method: 'delete',
    url: `/admin/role/${id}`,
  };
  return handleRequest(config);
};
