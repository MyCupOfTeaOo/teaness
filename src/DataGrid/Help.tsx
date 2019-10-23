import React, { useMemo } from 'react';
import { Location } from './typings';
import { useDataGrid } from './hooks';
import { Sorter } from './DataGridRegister';

export const DataGridHelp: React.FC<{
  children: (props: any) => React.ReactNode;
  fetchUrl: string;
  historyId?: string;
  location?: Location;
  defaultPage?: number;
  defaultPageSize?: number;
  defaultSorters?: Sorter[];
}> = props => {
  const {
    fetchUrl,
    historyId,
    location,
    defaultPage,
    defaultPageSize,
    defaultSorters,
  } = props;
  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    reset,
    sorters,
    setSorters,
    DataGrid,
  } = useDataGrid({
    fetchUrl,
    historyId,
    location,
    defaultPage,
    defaultPageSize,
    defaultSorters,
  });
  const children = useMemo(
    () =>
      props.children({
        page,
        setPage,
        pageSize,
        setPageSize,
        reset,
        sorters,
        setSorters,
        DataGrid,
      }),
    [
      page,
      setPage,
      pageSize,
      setPageSize,
      reset,
      sorters,
      setSorters,
      DataGrid,
    ],
  );
  return <React.Fragment>{children}</React.Fragment>;
};
