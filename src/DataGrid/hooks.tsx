import React, { useState, useCallback, useMemo } from 'react';

import DataGrid, {
  getLocationGridInit,
  Sorter,
  DataGridProps,
} from './DataGrid';
import { Location } from './typings';

export interface HookDataGridProps
  extends Omit<
    DataGridProps,
    | 'page'
    | 'setPage'
    | 'pageSize'
    | 'setPageSize'
    | 'sorters'
    | 'setSorters'
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
  const [page, setPage] = useState(
    getLocationGridInit('page', defaultPage || 1, historyId, location),
  );
  const [pageSize, setPageSize] = useState(
    getLocationGridInit('pageSize', defaultPageSize, historyId, location),
  );
  const [sorters, setSorters] = useState<Sorter[]>(
    getLocationGridInit('sorters', defaultSorters, historyId, location),
  );

  const reset = useCallback(() => {
    setPage(defaultPage);
    setPageSize(defaultPageSize);
    setSorters(defaultSorters);
  }, []);
  const dataGrid = useMemo(
    () => (rest: HookDataGridProps) => {
      return (
        <DataGrid
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          sorters={sorters}
          setSorters={setSorters}
          historyId={historyId}
          location={location}
          fetchUrl={fetchUrl}
          reset={reset}
          {...rest}
        />
      );
    },
    [
      page,
      setPage,
      pageSize,
      setPageSize,
      sorters,
      setSorters,
      historyId,
      fetchUrl,
    ],
  );
  return {
    page,
    setPage,
    pageSize,
    setPageSize,
    reset,
    sorters,
    setSorters,
    DataGrid: dataGrid,
  };
}
