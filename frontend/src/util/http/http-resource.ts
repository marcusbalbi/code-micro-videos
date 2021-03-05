import {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  CancelTokenSource,
} from "axios";
import axios from "axios";

import { serialize as objectToFormdata } from "object-to-formdata";
export default class HttpResource {
  private cancelList: CancelTokenSource | null = null;

  constructor(protected http: AxiosInstance, protected resource) {}

  list<T = any>(options?: { queryParams? }): Promise<AxiosResponse<T>> {
    if (this.cancelList) {
      this.cancelList.cancel(`list cancelled`);
    }
    this.cancelList = axios.CancelToken.source();
    const config: AxiosRequestConfig = {
      cancelToken: this.cancelList.token,
    };
    if (options && options.queryParams) {
      config.params = options.queryParams;
    }
    return this.http.get<T>(this.resource, config);
  }

  get<T = any>(id, queryParams?): Promise<AxiosResponse<T>> {
    const config: AxiosRequestConfig = {};
    if (queryParams) {
      config["params"] = queryParams;
    }
    return this.http.get<T>(`${this.resource}/${id}`, config);
  }

  create<T = any>(data): Promise<AxiosResponse<T>> {
    let sendData = this.makeSendData(data);
    return this.http.post<T>(this.resource, sendData);
  }

  update<T = any>(
    id,
    data,
    options?: { http?: { usePost: boolean }, config?: AxiosRequestConfig }
  ): Promise<AxiosResponse<T>> {
    let sendData = data;
    if (this.containsFile(data)) {
      sendData = this.getFormData(data);
    }
    const { http } = (options || {}) as any;
    return !http || !http.usePost
      ? this.http.put<T>(`${this.resource}/${id}`, sendData)
      : this.http.post<T>(`${this.resource}/${id}`, sendData);
  }

  delete<T = any>(id): Promise<AxiosResponse<T>> {
    return this.http.delete<T>(`${this.resource}/${id}`);
  }
  deleteCollection<T = any>(queryParams): Promise<AxiosResponse<T>> {
    const config: AxiosRequestConfig = {};
    if (queryParams) {
      config["params"] = queryParams;
    }
    return this.http.delete<T>(`${this.resource}`, config);
  }

  isCancelledRequest(error) {
    return axios.isCancel(error);
  }

  makeSendData(data) {
    return this.containsFile(data) ? this.getFormData(data) : data;
  }

  getFormData(data) {
    return objectToFormdata(data, { booleansAsIntegers: true });
  }

  containsFile(data): boolean {
    return Object.values(data).filter((el) => el instanceof File).length !== 0;
  }
}
