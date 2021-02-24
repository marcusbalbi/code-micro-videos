import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export const httpVideo = axios.create({
  baseURL: process.env.REACT_APP_MICRO_VIDEO_API_URL,
});

const instances = [httpVideo];

export const addGlobalRequestInterceptor = (
  onFulfilled?: (
    value: AxiosRequestConfig
  ) => AxiosRequestConfig | Promise<AxiosRequestConfig>,
  onRejected?: (error: any) => any
) => {
  const ids: number[] = [];
  for (let instance of instances) {
    const id = instance.interceptors.request.use(onFulfilled, onRejected);
    ids.push(id);
  }
  return ids;
};
export const removeGlobalRequestInterceptor = (ids: number[]) => {
  ids.forEach((id, index) => {
    instances[index].interceptors.request.eject(id);
  });
};

export const addGlobalResponseInterceptor = (
  onFulfilled?: (
    value: AxiosResponse
  ) => AxiosResponse | Promise<AxiosResponse>,
  onRejected?: (error: any) => any
) => {
  const ids: number[] = [];
  for (let instance of instances) {
    const id = instance.interceptors.response.use(onFulfilled, onRejected);
    ids.push(id);
  }
  return ids;
};
export const removeGlobalResponseInterceptor = (ids: number[]) => {
  ids.forEach((id, index) => {
    instances[index].interceptors.response.eject(id);
  });
};
