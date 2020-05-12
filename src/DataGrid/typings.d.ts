import * as H from 'history';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react/lib/agGridReact';
import { Dispatch, SetStateAction } from 'react';
import { CancellablePromise } from '../typings';

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
  total: number;
}

export type RequestMethod<
  T extends { [key: string]: any } = { [key: string]: any }
> = (
  url: string,
  payload: RequestData<T>,
) => CancellablePromise<ResponseData<T>>;

export type Fetch<T> = CancellablePromise<ResponseData<T>>;

export type DataGridRef = {
  gridRef?: AgGridReact | null;
  fetch(searchProps?: {
    page?: number;
    pageSize?: number;
    sorters?: Sorter[];
  }): void;
  getSearch(): {
    page?: number;
    pageSize?: number;
    sorters?: Sorter[];
  };
  setSearch(search: {
    page: number;
    pageSize: number;
    sorters?: Sorter[];
  }): void;
  setRowData: Dispatch<SetStateAction<any[] | undefined>>;
  getDefaultValue(): {
    page: number;
    pageSize: number;
    sorters: Sorter[];
  };
};
