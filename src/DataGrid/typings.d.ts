import * as H from 'history';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react/lib/agGridReact';

export type CancellablePromise<T> = Promise<T> & {
  cancel: (str?: string) => void;
};

export interface Sorter {
  colId: string;
  sort: string;
}

export type Location<S = any> = H.Location<S> & {
  query: { [key: string]: any };
};

export type ColumnDefs = (ColDef | ColGroupDef)[];

export type RequestData<
  T extends { [key: string]: any } = { [key: string]: any }
> = {
  pageSize: number;
  page: number;
  sorters?: Sorter[];
  queryData?: T;
};

export interface ResponseData<
  T extends { [key: string]: any } = { [key: string]: any }
> {
  isCancel?: boolean;
  list: T[];
  footer?: T[];
  total: number;
}

export type RequestMethod<
  T extends { [key: string]: any } = { [key: string]: any }
> = (
  url: string,
  payload: RequestData<T>,
  options?: {
    headers: any;
  },
) => CancellablePromise<ResponseData<T>>;

export type Fetch<T> = CancellablePromise<ResponseData<T>>;

export type DataGridRef = AgGridReact;
