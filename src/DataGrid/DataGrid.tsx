import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { Alert, Pagination } from 'antd';
import classNames from 'classnames';
import { ColDef, SortModelItem } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react/lib/agGridReact';
import BaseGrid, { BaseGridProps } from './BaseGrid';
import { DataGridRef } from './typings';

export interface DataGridProps
  extends Omit<BaseGridProps, 'suppressMultiSort' | 'className'> {
  /**
   * 默认单页显示条数
   */
  pageSize?: number;
  /**
   * 默认页数
   */
  page?: number;
  total?: number;
  error?: Error;
  onPaginationChange?(page: number, pageSize?: number): void;
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
   * 支持分页
   * @default true
   */
  supportPagination?: boolean;
  /**
   * 排序模型
   */
  sorters?: SortModelItem[];
}

export const showTotal = (item: number, range: [number, number]) =>
  (range[1] !== 0 ? `${range[0]}-${range[1]} 共 ${item} 条数据` : '暂无数据');

const DataGridCom: React.ForwardRefRenderFunction<
  DataGridRef,
  DataGridProps
> = (props, ref) => {
  const {
    className,
    pageSize,
    page,
    total,
    error,
    onPaginationChange,
    pageSizeOptions,
    supportPagination,
    sorters,
    ...rest
  } = props;
  const gridRef = useRef<AgGridReact>(null);
  useImperativeHandle(ref, () => gridRef.current as AgGridReact, []);

  const defaultColDef = useMemo(() => {
    return {
      comparator: () => {
        return 0;
      },
      ...props.defaultColDef,
    };
  }, [props.defaultColDef]);
  useEffect(() => {
    if (!rest.rowData) {
      gridRef.current?.api?.showLoadingOverlay();
    } else if (!rest.rowData.length) {
      gridRef.current?.api?.showNoRowsOverlay();
    } else {
      gridRef.current?.api?.hideOverlay();
    }
    return () => {};
  }, [rest.rowData]);
  useEffect(() => {
    // 同步grid sort
    gridRef.current?.columnApi?.applyColumnState({
      state: sorters,
    });
  }, [sorters]);
  return (
    <div className={classNames('tea-datagrid', className)}>
      {error && (
        <Alert showIcon closable type="error" message={error.message} />
      )}
      <BaseGrid
        {...rest}
        defaultColDef={defaultColDef}
        ref={gridRef}
        className={props.gridClassName}
      />
      {supportPagination && (
        <div className="tea-grid-bottom">
          <Pagination
            className="tea-grid-pagination"
            onChange={onPaginationChange}
            pageSizeOptions={pageSizeOptions}
            total={total}
            size="small"
            showSizeChanger
            showQuickJumper
            showTotal={showTotal}
            current={page}
            pageSize={pageSize}
          />
        </div>
      )}
    </div>
  );
};

const DataGrid = forwardRef(DataGridCom);

DataGrid.defaultProps = {
  pageSizeOptions: ['5', '10', '30', '50', '100'],
  supportPagination: true,
};

export default DataGrid;
