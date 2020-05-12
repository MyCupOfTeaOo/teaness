import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { Pagination, Modal } from 'antd';
import { AgGridReact } from 'ag-grid-react/lib/agGridReact';
import classNames from 'classnames';
import { ColDef, GridApi } from 'ag-grid-community';
import { stringify } from 'querystring';

import { isObject } from 'lodash-es';
import BaseGrid, { BaseGridProps } from './BaseGrid';
import locale from './locale';
import {
  Location,
  Sorter,
  RequestData,
  DataGridRef,
  ResponseData,
  RequestMethod,
} from './typings';
import DataGridRegister from './DataGridRegister';
import { useValue } from '../hooks';

export interface DataGridProps
  extends Omit<BaseGridProps, 'rowData' | 'suppressMultiSort' | 'className'> {
  /**
   * 请求地址,相对或绝对路径
   */
  fetchUrl: string;
  /**
   * 请求失败回调
   */
  fetchErrorCallback?: (resp: Error) => void;
  /**
   * 请求成功回调
   */
  fetchSuccessCallback?: (
    resp: ResponseData<{
      [key: string]: any;
    }>,
  ) => void;
  /**
   * 查询方法,默认使用 DataGridRegister 注册的全局请求方法
   */
  request?: RequestMethod;
  /**
   * 查询参数
   */
  queryData?: {
    current?: any;
  };
  /**
   * 默认单页显示条数
   */
  defaultPageSize?: number;
  /**
   * 默认页数
   */
  defaultPage?: number;
  /**
   * 单页显示条数候选项
   */
  pageSizeOptions?: string[];
  className?: string;
  gridClassName?: string;
  /**
   * 默认列参数,由于ag-grid server模式下的排序bug这个参数做了fix
   */
  defaultColDef?: ColDef;
  /**
   * 默认的排序列
   */
  defaultSorters?: Sorter[];
  /**
   * 启用浏览器记忆查询参数功能需要传递react-router的location
   */
  location?: Location;
  /**
   * 启用浏览器记忆查询参数功能需要传递一个gridid
   */
  historyId?: string;
  /**
   * 首次渲染是否请求,默认为true
   */
  firstLoad?: boolean;
}

export function getLocationGridInit<T>(
  key: string,
  historyId: string | undefined,
  location: Location | undefined,
  defaultValue: T,
): T {
  if (!historyId) return defaultValue;
  if (!location) return defaultValue;
  if (!location.query[historyId]) return defaultValue;
  const search = JSON.parse(location.query[historyId]);
  if (search[key] === undefined) return defaultValue;
  if (Array.isArray(search[key])) {
    return search[key];
  }
  if (isObject(search[key])) {
    return {
      ...defaultValue,
      ...search[key],
    };
  }
  return search[key];
}

export const showTotal = (item: number, range: [number, number]) =>
  (range[1] !== 0 ? `${range[0]}-${range[1]} 共 ${item} 条数据` : '暂无数据');

const DataGridCom: React.ForwardRefRenderFunction<
  DataGridRef,
  DataGridProps
> = (props, ref) => {
  const [count, setCount] = useState(0);
  // 解决 loading 与 nodata 同时显示bug
  const loadCount = useRef(0);
  const gridRef = useRef<AgGridReact>(null);
  const defaultColDef = useMemo(() => {
    return {
      comparator: () => 0,
      ...props.defaultColDef,
    };
  }, [props.defaultColDef]);
  const [rowData, setRowData] = useState<any[] | undefined>([]);

  const search = useValue<{
    page: number;
    pageSize: number;
    sorters?: Sorter[];
  }>(() => ({
    page: getLocationGridInit(
      'page',
      props.historyId,
      props.location,
      props.defaultPage || DataGridRegister.defaultPage,
    ),
    pageSize: getLocationGridInit(
      'pageSize',
      props.historyId,
      props.location,
      props.defaultPageSize || DataGridRegister.defaultPageSize,
    ),
    sorters: getLocationGridInit(
      'sorters',
      props.historyId,
      props.location,
      props.defaultSorters || DataGridRegister.defaultSorters,
    ),
  }));
  /* eslint-disable prefer-arrow-callback */
  const [total, setTotal] = useState(0);

  // 后续可以参看 select requestMethod 剔除
  // 只依赖 fetchurl
  const fetch = useCallback(
    function<T extends { [key: string]: any } = { [key: string]: any }>(
      searchProps: RequestData<T>,
    ) {
      if (gridRef.current) {
        if (gridRef.current.api) {
          gridRef.current.gridOptions.suppressNoRowsOverlay = true;
          gridRef.current.api.showLoadingOverlay();
          // 同步grid sort
          gridRef.current.api.setSortModel(searchProps.sorters);
        }
      }
      let noData = !(Array.isArray(rowData) && rowData.length > 0);

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

      loadCount.current += 1;
      const res = (props.request || DataGridRegister.request)(
        props.fetchUrl,
        searchProps,
      );
      res
        .then(data => {
          if (props.fetchSuccessCallback) props.fetchSuccessCallback(data);
          if (data.isCancel) {
            return undefined;
          } else {
            setTotal(data.total);
            setRowData(data.list || []);
            if (Array.isArray(data.list) && data.list.length > 0) {
              noData = false;
            }
          }
        })
        .catch((err: Error) => {
          console.error(err);
          if (props.fetchErrorCallback) props.fetchErrorCallback(err);
          else {
            Modal.error({
              title: '列表加载失败',
              content: err.message,
            });
          }
        })
        .finally(() => {
          loadCount.current -= 1;
          if (gridRef.current && !loadCount.current) {
            if (gridRef.current.api) {
              gridRef.current.api.hideOverlay();
              gridRef.current.gridOptions.suppressNoRowsOverlay = false;
              if (noData) {
                setTimeout(() => {
                  // fix 太快调用会导致 noRowsOverLay 与 loadingOverLay 同时显示bug
                  gridRef.current?.api?.showNoRowsOverlay();
                });
              }
            }
          }
        });
      return res.cancel;
    },
    [props.fetchUrl],
  );

  useEffect(() => {
    if (props.firstLoad || count > 0) {
      return fetch({
        ...search.current,
        queryData: props.queryData?.current,
      });
    }
  }, [count]);
  const handlePageChange = useCallback((page, pageSize) => {
    search.current = {
      ...search.current,
      page,
      pageSize,
    };

    // 查询
    setCount(prevCount => prevCount + 1);
  }, []);
  const handleSortChange = useCallback(({ api }: { api: GridApi }) => {
    const sortModal = api.getSortModel();
    if (search.current.sorters?.length === sortModal.length) {
      // 浅对比
      if (search.current.sorters.length === 0) {
        return;
      }
      // 深对比
      if (
        search.current.sorters.every(sorter =>
          sortModal.some(
            item => item.colId === sorter.colId && item.sort === sorter.sort,
          ),
        )
      ) {
        return;
      }
    }
    search.current = {
      ...search.current,
      sorters: sortModal,
    };
    // 查询
    setCount(prevCount => prevCount + 1);
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      gridRef: gridRef.current,
      fetch(data?: { page?: number; pageSize?: number; sorters?: Sorter[] }) {
        search.current = {
          ...search.current,
          ...data,
        };
        setCount(prevCount => prevCount + 1);
      },
      getSearch() {
        return search.current;
      },
      setSearch(v: { page: number; pageSize: number; sorters?: Sorter[] }) {
        search.current = v;
      },
      setRowData,
      getDefaultValue() {
        return {
          page: props.defaultPage || DataGridRegister.defaultPage,
          pageSize: props.defaultPageSize || DataGridRegister.defaultPageSize,
          sorters: props.defaultSorters || DataGridRegister.defaultSorters,
        };
      },
    }),
    [fetch],
  );

  const { className, ...rest } = props;
  return (
    <div className={classNames('tea-datagrid', className)}>
      <BaseGrid
        localeText={locale.zh}
        {...rest}
        defaultColDef={defaultColDef}
        ref={gridRef}
        className={props.gridClassName}
        rowData={rowData}
        onSortChanged={handleSortChange}
      />
      <div className="tea-grid-bottom">
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
          current={search.current.page}
          pageSize={search.current.pageSize}
        />
      </div>
    </div>
  );
};

const DataGrid = forwardRef(DataGridCom);

DataGrid.defaultProps = {
  pageSizeOptions: ['5', '10', '30', '50', '100'],
  firstLoad: true,
};

export default DataGrid;
