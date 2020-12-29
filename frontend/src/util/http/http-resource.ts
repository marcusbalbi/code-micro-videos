import { AxiosInstance } from "axios";

export default class HttpResource {
  constructor(protected http: AxiosInstance, protected resource) {}

  list<T = any>() {
    return this.http.get<T>(this.resource);
  }

  get() {}

  create() {}

  update() {}

  delete() {}
}
