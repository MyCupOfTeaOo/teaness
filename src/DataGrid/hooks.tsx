import { useRef, useMemo, useCallback } from 'react';
import { DataGridRef, Location } from './typings';
import { getLocationGridInit } from './DataGrid';

export function useDataGrid<T extends { [key: string]: any }>(
  options: {
    // 与historyId一起使用
    location?: Location;
    // grid 绑定的地址栏id,用来区分不同的grid地址栏数据,要与location一起传递
    historyId?: string;
    // 默认查询参数
    defaultQueryData?: Partial<T>;
  } = {},
) {
  const { location, historyId, defaultQueryData = {} } = options;
  const gridRef = useRef<DataGridRef>();
  const queryData = useMemo<Partial<T>>(() => {
    if (location && historyId) {
      return getLocationGridInit<Partial<T>>(
        'queryData',
        historyId,
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
