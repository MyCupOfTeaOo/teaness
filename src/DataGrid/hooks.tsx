import { useRef, useMemo, useCallback } from 'react';
import { DataGridRef, Location } from './typings';
import { getLocationGridInit } from './DataGrid';

export function useDataGrid<T extends { [key: string]: any }>(
  options: {
    location?: Location;
    historyId?: string;
    defaultQueryData?: Partial<T>;
  } = {},
) {
  const { location, historyId, defaultQueryData = {} } = options;
  const gridRef = useRef<DataGridRef>();
  const queryData = useMemo<Partial<T>>(() => {
    if (location && historyId) {
      return getLocationGridInit<Partial<T>>(
        'queryData',
        'grid',
        location,
        defaultQueryData,
      );
    }
    return defaultQueryData;
  }, []);
  const queryDataRef = useRef<Partial<T>>(queryData);
  const setQueryData = useCallback((data: Partial<T>) => {
    queryDataRef.current = data;
  }, []);
  return {
    gridProps: {
      ref: gridRef,
      historyId,
      queryData: queryDataRef.current,
    },
    gridRef,
    queryDataRef,
    setQueryData,
  };
}
