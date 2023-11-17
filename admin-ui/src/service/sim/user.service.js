import { handleRequest } from '../../utils/axios';


export const searchMediaUserAPI = async (search) => {
  const config = {
    method: 'post',
    url: '/admin/user/search/',
    headers: {
      'Content-Type': 'application/json',
    },
    data: search,
  };

  return handleRequest(config);
};

export const getMediaUserByIdAPI = async (id) => {
  const config = {
    method: "get",
    url: `/admin/user/${id}`,
  };
  return handleRequest(config);
};

export const createMediaUserAPI = async (data) => {
  const config = {
    method: 'post',
    url: '/admin/user/',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data
  };
  return handleRequest(config);
};

export const updateMediaUserAPI = async (data) => {
  const config = {
    method: 'put',
    url: '/admin/user/',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data
  };
  return handleRequest(config);
};

export const deleteMediaUserAPI = async (id) => {
  const config = {
    method: 'delete',
    url: `/admin/user/${id}`,
  };
  return handleRequest(config);
};

export const updateMediaUserPasswordAPI = async (data) => {
  const config = {
    method: 'put',
    url: '/admin/user/password',
    data
  };
  return handleRequest(config);
};

export const resetMediaUserPasswordAPI = async (data) => {
  const config = {
    url: '/forgot-pass',
    method: 'PUT',
    data,
  };

  return handleRequest(config);
};

export const updateMediaUserInfoAPI = async (data) => {
  const config = {
    url: '/user/update',
    method: 'PUT',
    data,
  };

  return handleRequest(config);
};

export const deleteMediaUsersAPI = async (ids) => {
  const config = {
    url: `/user/all/${ids.toString()}`,
    method: 'DELETE',
  };
  return handleRequest(config);
};