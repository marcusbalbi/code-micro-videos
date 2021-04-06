import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { keycloak } from "../auth";

export const httpVideo = axios.create({
  baseURL: process.env.REACT_APP_MICRO_VIDEO_API_URL,
});

const instances = [httpVideo];
httpVideo.interceptors.request.use(authInterceptors);

function authInterceptors(request: AxiosRequestConfig): AxiosRequestConfig | Promise<AxiosRequestConfig> {
  if (keycloak?.token) {
    request.headers["Authorization"] = `Bearer ${keycloak.token}`
    return request;
  }
  return new Promise((resolve, reject) => {
    keycloak.onAuthSuccess = () => {
      request.headers["Authorization"] = `Bearer ${keycloak.token}`;
      resolve(request)
    }
    keycloak.onAuthError = () => {
      reject(request)
    }
  })
}

function addToken(request: AxiosRequestConfig) {
  request.headers["Authorization"] = `Bearer ${keycloak.token}`;
}

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
