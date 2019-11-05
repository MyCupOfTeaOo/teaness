import request, { RequestMethod } from 'umi-request';

export interface Sorter {
  colId: string;
  sort: string;
}

enum respCode {
  success = 200,
  error = 400,
  exception = 500,
  cancel = 0,
}

type Enum<E> = Record<keyof E, number> & { [k: number]: string };
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
  respCode: Enum<{
    success: number;
    error: number;
    exception: number;
    cancel: number;
  }>;
  request: RequestMethod;
  router?: Router;
  defaultPage: number;
  defaultPageSize: number;
  defaultSorters: Sorter[];
} = {
  respCode,
  request,
  defaultPage: 1,
  defaultPageSize: 10,
  defaultSorters: [],
};

export default DataGridRegister;
