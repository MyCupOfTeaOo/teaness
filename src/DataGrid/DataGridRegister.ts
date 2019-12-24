import { Sorter, RequestMethod, ResponseData } from './typings';
import { CancellablePromise } from '../typings';

export interface RouteData {
  pathname: string;
  query?: any;
  search?: string;
  state?: any;
}

export type Router = {
  push: (path: string | RouteData) => void;
  replace: (path: string | RouteData) => void;
  go: (count: number) => void;
  goBack: () => void;
};

export interface ReqResponse {
  msg: string;
  code: number;
  data?: any;
}

const DataGridRegister: {
  request: RequestMethod;
  router?: Router;
  defaultPage: number;
  defaultPageSize: number;
  defaultSorters: Sorter[];
} = {
  request: () => {
    const r = Promise.reject(new Error('未注册请求方法')) as CancellablePromise<
      ResponseData<{}>
    >;
    r.cancel = () => {};
    return r;
  },
  defaultPage: 1,
  defaultPageSize: 10,
  defaultSorters: [],
};

export default DataGridRegister;
