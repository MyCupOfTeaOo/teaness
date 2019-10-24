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
  // page?: number;
  // setPage?: React.Dispatch<React.SetStateAction<number>>;
  // pageSize?: number;
  // setPageSize?: React.Dispatch<React.SetStateAction<number>>;
  // sorters?: Sorter[];
  // setSorters?: React.Dispatch<React.SetStateAction<Sorter[]>>;
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
  const [count, setCount] = useState(0);

  const gridRef = useRef<AgGridReact>(null);
  const defaultColDef = useMemo(() => {
    return {
      comparator: () => 0,
      ...props.defaultColDef,
    };
  }, [props.defaultColDef]);
  const [rowData, setRowData] = useState<any[] | undefined>(undefined);

  const [search, setSearch] = useState<{
    page: number;
    pageSize: number;
    sorters: Sorter[];
  }>(() => ({
    page: getLocationGridInit(
      'page',
      props.defaultPage || DataGridRegister.defaultPage,
      props.historyId,
      props.location,
    ),
    pageSize: getLocationGridInit(
      'pageSize',
      props.defaultPageSize || DataGridRegister.defaultPageSize,
      props.historyId,
      props.location,
    ),
    sorters: getLocationGridInit(
      'sorters',
      props.defaultSorters || DataGridRegister.defaultSorters,
      props.historyId,
      props.location,
    ),
  }));

  const [total, setTotal] = useState(0);

  // 后续可以参看 select requestMethod 剔除
  // 只依赖 fetchurl
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
          // 同步grid sort
          gridRef.current.api.setSortModel(searchProps.sorters);
        }
      }
      let noData = !(Array.isArray(rowData) && rowData.length > 0);

      // 业务接口转换
      const sorterMap = searchProps.sorters[0]
        ? {
            columnOrder: searchProps.sorters[0].sort,
            columnProp: searchProps.sorters[0].colId,
          }
        : {};

      if (props.location && props.historyId && DataGridRegister.router) {
        // 同步到url,记得注册router
        const routerSearch = {
          ...props.location.query,
          [props.historyId]: JSON.stringify(searchProps),
        };
        DataGridRegister.router.replace({
          pathname: props.location.pathname,
          state: props.location.state,
          search: stringify(routerSearch),
        });
      }
      // 创建取消的token
      const {
        token: cancelToken,
        cancel,
      } = DataGridRegister.request.CancelToken.source();

      DataGridRegister.request
        .post<ReqResponse>(props.fetchUrl, {
          cancelToken,
          // 业务数据转换
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
    if (!props.silence || count > 0) {
      return fetch({
        ...search,
        queryData: props.queryData,
      });
    }
  }, [count]);
  const handlePageChange = useCallback((page, pageSize) => {
    setSearch(item => ({
      ...item,
      page,
      pageSize,
    }));

    // 查询
    setCount(prevCount => prevCount + 1);
  }, []);
  const handleSortChange = useCallback(({ api }: { api: GridApi }) => {
    let isChange = false;

    setSearch(item => {
      const sortModal = api.getSortModel();
      if (item.sorters.length === sortModal.length) {
        if (item.sorters.length === 0) return item;
        if (
          item.sorters[0].colId === sortModal[0].colId &&
          item.sorters[0].sort === sortModal[0].sort
        ) return item;
      }
      isChange = true;
      return {
        ...item,
        sorters: sortModal,
      };
    });
    // 查询
    if (isChange) setCount(prevCount => prevCount + 1);
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      gridRef,
      fetch: (data: {
        queryData: any;
        page: number;
        pageSize: number;
        sorters: Sorter[];
      }) => {
        setSearch(item => ({
          ...item,
          ...data,
        }));
        setCount(prevCount => prevCount + 1);
      },
      getSearch: () => {
        let temp = search;
        setSearch(prevSearch => {
          temp = prevSearch;
          return prevSearch;
        });
        return temp;
      },
      setSearch,
      setRowData,
      getDefaultValue: () => ({
        page: props.defaultPage || DataGridRegister.defaultPage,
        pageSize: props.defaultPageSize || DataGridRegister.defaultPageSize,
        sorters: props.defaultSorters || DataGridRegister.defaultSorters,
      }),
    }),
    [fetch],
  );

  const reset = useCallback(toFetch => {
    setSearch(item => ({
      ...item,
      page: props.defaultPage || DataGridRegister.defaultPage,
      pageSize: props.defaultPageSize || DataGridRegister.defaultPageSize,
      sorters: props.defaultSorters || DataGridRegister.defaultSorters,
    }));
    if (toFetch) setCount(prevCount => prevCount + 1);
  }, []);

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
        <Button
          icon="sync"
          size="small"
          onClick={() => reset(true)}
          type="dashed"
        >
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
          current={search.page}
          pageSize={search.pageSize}
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

export type SetState<T> = (state: T | ((prevState: T) => T)) => void;

export type DataGridRef = {
  gridRef: AgGridReact;
  fetch: (searchProps: {
    queryData?: any;
    page?: number;
    pageSize?: number;
    sorters?: Sorter[];
  }) => void;
  getSearch: () => {
    page?: number;
    pageSize?: number;
    sorters?: Sorter[];
  };
  setSearch: SetState<{
    page?: number;
    pageSize?: number;
    sorters?: Sorter[];
  }>;
  setRowData: (rowData: any[] | ((prevRowData: any[]) => any[])) => void;
  getDefaultValue: () => {
    page: number;
    pageSize: number;
    sorters: Sorter[];
  };
};

export default memo(DataGridRef);
