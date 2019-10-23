import request, { RequestMethod } from 'umi-request';

export interface Sorter {
  colId: string;
  sort: string;
}

export enum respCode {
  success = '0',
  error = '1',
  exception = '2',
  cancel = '3',
}

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
  code: string;
  data?: any;
}

const DataGridRegister: {
  respCode: any;
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
