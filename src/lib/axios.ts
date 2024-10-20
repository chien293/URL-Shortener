import axios, {
    AxiosError,
    AxiosResponse,
    AxiosHeaders,
    InternalAxiosRequestConfig,
  } from "axios";
  
  export const BASE_URL = process.env.BASE_URL as string;
  
  const axiosAPI = axios.create({
    baseURL: BASE_URL,
  });
  
  
  axiosAPI.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );
  
  axiosAPI.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      return Promise.reject(error);
    }
  );
  
  export { axiosAPI };