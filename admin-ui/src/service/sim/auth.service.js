import { handleRequest } from "../../utils/axios";

export const loginAPI = async (username, password) => {
  const urlencoded = new URLSearchParams();
  urlencoded.append("username", username);
  urlencoded.append("password", password);
  const config = {
    method: 'post',
    url: '/login',
    data: urlencoded
  };

  return handleRequest(config);
};

export const refreshTokenAPI = async (data) => {
  const config = {
    method: 'post',
    url: '/refresh-token',
    data
  };

  return handleRequest(config);
};

export const signUpAPI = async (data) => {
  const config = {
    method: 'post',
    url: '/signup',
    data
  };

  return handleRequest(config);
};

export const meAPI = async () => {
  const config = {
    method: 'get',
    url: '/me'
  };

  return handleRequest(config);
};