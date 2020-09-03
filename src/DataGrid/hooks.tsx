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
    // 强制查询参数
    defaultForceQueryData?: Partial<T>;
  } = {},
) {
  const {
    location,
    historyId,
    defaultQueryData = {},
    defaultForceQueryData = {},
  } = options;
  const gridRef = useRef<DataGridRef>(null);
  const forceQueryDataRef = useRef<Partial<T>>(defaultForceQueryData);
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
    // 防止queryData使用其他类型
    if (forceQueryDataRef.current) {
      queryDataRef.current = {
        ...data,
        ...forceQueryDataRef.current,
      };
    } else {
      queryDataRef.current = data;
    }
  }, []);
  const setForceQueryData = useCallback((data: Partial<T>) => {
    forceQueryDataRef.current = data;
    queryDataRef.current = {
      ...queryDataRef.current,
      ...forceQueryDataRef.current,
    };
  }, []);
  return {
    gridProps: {
      ref: gridRef,
      historyId,
      queryDataRef,
      location,
    },
    gridRef,
    queryDataRef,
    setQueryData,
    forceQueryDataRef,
    setForceQueryData,
  };
}
