import React, {
  memo,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { Pagination, Button } from 'antd';
import { AgGridReact } from 'ag-grid-react/lib/agGridReact';
import classNames from 'classnames';
import { ColDef, GridApi } from 'ag-grid-community';
import { stringify } from 'querystring';

import BaseGrid, { BaseGridProps } from './BaseGrid';
import Modal from '../Modal';
import locale from './locale';
import { Location } from './typings';
import DataGridRegister, {
  ReqResponse,
  Sorter,
  respCode,
} from './DataGridRegister';

export interface DataGridProps
  extends Omit<
    BaseGridProps,
    'rowData' | 'suppressMultiSort' | 'enableServerSideSorting' | 'className'
  > {
  /**
   * 请求地址,相对或绝对路径
   */
  fetchUrl: string;
  fetchErrorCallback?: (resp: ReqResponse | any) => void;
  queryData: any;
  defaultPageSize?: number;
  defaultPage?: number;
  pageSizeOptions?: string[];
  className?: string;
  gridClassName?: string;
  defaultColDef?: ColDef;
  defaultSorters?: Sorter[];
  location?: Location;
  historyId?: string;
  page?: number;
  setPage?: React.Dispatch<React.SetStateAction<number>>;
  pageSize?: number;
  setPageSize?: React.Dispatch<React.SetStateAction<number>>;
  sorters?: Sorter[];
  setSorters?: React.Dispatch<React.SetStateAction<Sorter[]>>;
  reset?: () => void;
  /**
   * 第一次不请求
   */
  silence?: boolean;
}

export function getLocationGridInit<T>(
  key: string,
  defaultValue: T,
  historyId: string | undefined,
  location: Location | undefined,
): T {
  if (!historyId) return defaultValue;
  if (!location) return defaultValue;
  if (!location.query[historyId]) return defaultValue;
  const search = JSON.parse(location.query[historyId]);
  if (search[key] === undefined) return defaultValue;
  return search[key];
}

export const showTotal = (item: number, range: [number, number]) =>
  (range[1] !== 0 ? `${range[0]}-${range[1]} 共 ${item} 条数据` : '暂无数据');

const DataGrid: React.FC<DataGridProps> = (props, ref) => {
  const gridRef = useRef<AgGridReact>(null);
  const defaultColDef = useMemo(() => {
    return {
      comparator: () => 0,
      ...props.defaultColDef,
    };
  }, [props.defaultColDef]);
  const [rowData, setRowData] = useState<any[] | undefined>(undefined);
  const [page, setPage] = useState(
    getLocationGridInit(
      'page',
      props.defaultPage || 1,
      props.historyId,
      props.location,
    ),
  );

  const [pageSize, setPageSize] = useState(
    getLocationGridInit(
      'pageSize',
      props.defaultPageSize || 10,
      props.historyId,
      props.location,
    ),
  );

  const [total, setTotal] = useState(0);
  const [sorters, setSorters] = useState<Sorter[]>(
    getLocationGridInit(
      'sorters',
      props.defaultSorters || [],
      props.historyId,
      props.location,
    ),
  );
  const current = useMemo(() => props.page || page, [props.page, page]);
  const size = useMemo(() => props.pageSize || pageSize, [
    props.pageSize,
    pageSize,
  ]);
  const theSorters = useMemo(() => props.sorters || sorters, [
    props.sorters,
    sorters,
  ]);

  const fetch = useCallback(
    (searchProps: {
      queryData: any;
      page: number;
      pageSize: number;
      sorters: Sorter[];
    }) => {
      if (gridRef.current) {
        if (gridRef.current.api) {
          gridRef.current.api.showLoadingOverlay();
          gridRef.current.api.setSortModel(searchProps.sorters);
        }
      }
      let noData = !(Array.isArray(rowData) && rowData.length > 0);
      const sorterMap = searchProps.sorters[0]
        ? {
            columnOrder: searchProps.sorters[0].sort,
            columnProp: searchProps.sorters[0].colId,
          }
        : {};
      if (props.location && props.historyId) {
        const search = {
          ...props.location.query,
          [props.historyId]: JSON.stringify({
            pageSize: searchProps.pageSize,
            page: searchProps.page,
            sorters: searchProps.sorters,
            queryData: searchProps.queryData,
          }),
        };
        if (DataGridRegister.router) {
          DataGridRegister.router.replace({
            pathname: props.location.pathname,
            state: props.location.state,
            search: stringify(search),
          });
        }
      }
      const {
        token: cancelToken,
        cancel,
      } = DataGridRegister.request.CancelToken.source();
      DataGridRegister.request
        .post<ReqResponse>(props.fetchUrl, {
          cancelToken,
          data: {
            ...searchProps.queryData,
            ...sorterMap,
            len: searchProps.pageSize,
            page: searchProps.page,
          },
        })
        .then(resp => {
          if (resp.code === respCode.success) {
            if (resp.data) {
              setTotal(resp.data.totalitem);
              setRowData(resp.data.list || []);
              if (Array.isArray(resp.data.list) && resp.data.list.length > 0) {
                noData = false;
              }
            }
          } else if (resp.code === respCode.cancel) {
            return undefined;
          } else if (props.fetchErrorCallback) props.fetchErrorCallback(resp);
          else {
            Modal.error({
              title: '列表加载失败',
              content: resp.msg,
            });
          }
        })
        .catch(err => {
          console.error(err);
          if (props.fetchErrorCallback) props.fetchErrorCallback(err);
          else {
            Modal.error({
              title: '列表加载失败',
              content: '服务器异常',
            });
          }
        })
        .finally(() => {
          if (gridRef.current) {
            if (gridRef.current.api) {
              gridRef.current.api.hideOverlay();
              if (noData) gridRef.current.api.showNoRowsOverlay();
            }
          }
        });
      return () => cancel('取消列表请求');
    },
    [props.fetchUrl],
  );

  useEffect(() => {
    if (!props.silence) {
      fetch({
        page: current,
        pageSize: size,
        sorters: theSorters,
        queryData: props.queryData,
      });
    }
  }, []);
  const handlePageChange = useCallback((curPage, curSize) => {
    if (props.setPage) props.setPage(curPage);
    else setPage(curPage);
    if (props.setPageSize) props.setPageSize(curSize);
    else setPageSize(curSize);
  }, []);
  const handleSortChange = useCallback(({ api }: { api: GridApi }) => {
    if (props.setSorters) {
      props.setSorters(prevSorters => {
        const sortModal = api.getSortModel();
        if (prevSorters.length === sortModal.length) {
          if (prevSorters.length === 0) return prevSorters;
          if (
            prevSorters[0].colId === sortModal[0].colId &&
            prevSorters[0].sort === sortModal[0].sort
          ) return prevSorters;
        }
        return sortModal;
      });
    } else {
      setSorters(prevSorters => {
        const sortModal = api.getSortModel();
        if (prevSorters.length === sortModal.length) {
          if (prevSorters.length === 0) return prevSorters;
          if (
            prevSorters[0].colId === sortModal[0].colId &&
            prevSorters[0].sort === sortModal[0].sort
          ) return prevSorters;
        }
        return sortModal;
      });
    }
  }, []);
  const reset = useCallback(() => {
    if (props.reset) {
      props.reset();
      return;
    }
    if (props.setPage) props.setPage(props.defaultPage || DataGridRegister.defaultPage);
    else setPage(props.defaultPage || DataGridRegister.defaultPage);
    if (props.setPageSize) {
      props.setPageSize(
        props.defaultPageSize || DataGridRegister.defaultPageSize,
      );
    } else setPageSize(props.defaultPageSize || DataGridRegister.defaultPageSize);
    if (props.setSorters) props.setSorters(props.defaultSorters || DataGridRegister.defaultSorters);
    else setSorters(props.defaultSorters || DataGridRegister.defaultSorters);
  }, [props.setPage, props.setPageSize, props.setSorters, props.reset]);
  useImperativeHandle(
    ref,
    () => ({
      gridRef,
      fetch,
      reset,
      setPage: props.setPage || setPage,
      setPageSize: props.setPageSize || setPageSize,
      setSorters: props.setSorters || setSorters,
      setRowData,
    }),
    [],
  );
  return (
    <div className={classNames('tea-datagrid', props.className)}>
      <BaseGrid
        localeText={locale.zh}
        {...props}
        defaultColDef={defaultColDef}
        ref={gridRef}
        className={props.gridClassName}
        rowData={rowData}
        suppressMultiSort
        enableServerSideSorting
        onSortChanged={handleSortChange}
      />
      <div className="tea-grid-bottom">
        <Button icon="sync" size="small" onClick={reset} type="dashed">
          重置
        </Button>
        <Pagination
          className="tea-grid-pagination"
          onChange={handlePageChange}
          onShowSizeChange={handlePageChange}
          pageSizeOptions={props.pageSizeOptions}
          total={total}
          size="small"
          showSizeChanger
          showQuickJumper
          showTotal={showTotal}
          current={current}
          pageSize={size}
        />
      </div>
    </div>
  );
};

const DataGridRef = forwardRef(DataGrid);
DataGridRef.defaultProps = {
  pageSizeOptions: ['5', '10', '30', '50', '100'],
  defaultPageSize: DataGridRegister.defaultPageSize,
  defaultPage: DataGridRegister.defaultPage,
  defaultSorters: DataGridRegister.defaultSorters,
  silence: false,
};

export default memo(DataGridRef);
