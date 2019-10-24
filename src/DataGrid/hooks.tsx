import React, { useMemo, useRef } from 'react';

import DataGrid, { getLocationGridInit, DataGridProps } from './DataGrid';
import { Location } from './typings';
import { Sorter } from './DataGridRegister';

export interface HookDataGridProps
  extends Omit<
    DataGridProps,
    | 'defaultPageSize'
    | 'defaultPage'
    | 'defaultSorters'
    | 'historyId'
    | 'location'
    | 'fetchUrl'
  > {}

export function useDataGrid(props: {
  fetchUrl: string;
  historyId?: string;
  location?: Location;
  defaultPage?: number;
  defaultPageSize?: number;
  defaultSorters?: Sorter[];
}) {
  const {
    historyId,
    location,
    fetchUrl,
    defaultPage = 1,
    defaultPageSize = 10,
    defaultSorters = [],
  } = props;
  const gridRef = useRef();
  const page = useMemo(
    () => getLocationGridInit('page', defaultPage || 1, historyId, location),
    [],
  );
  const pageSize = useMemo(
    () => getLocationGridInit('pageSize', defaultPageSize, historyId, location),
    [],
  );
  const sorters = useMemo(
    () => getLocationGridInit('sorters', defaultSorters, historyId, location),
    [],
  );

  const dataGrid = useMemo(
    () => (rest: HookDataGridProps) => {
      return (
        <DataGrid
          ref={gridRef}
          historyId={historyId}
          location={location}
          fetchUrl={fetchUrl}
          defaultPage={page}
          defaultPageSize={pageSize}
          defaultSorters={sorters}
          {...rest}
        />
      );
    },
    [],
  );
  return {
    gridRef,
    DataGrid: dataGrid,
  };
}
