import * as H from 'history';
import { ColDef, ColGroupDef } from 'ag-grid-community';

export type Location<S = any> = H.Location<S> & {
  query: { [key: string]: any };
};

export type columnDefs = (ColDef | ColGroupDef)[];
