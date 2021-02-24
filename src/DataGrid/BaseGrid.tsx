import React, {
  CSSProperties,
  useMemo,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { AgGridReactProps } from 'ag-grid-react';
import { AgGridReact } from 'ag-grid-react/lib/agGridReact';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import classNames from 'classnames';
import { Empty } from 'antd';
import { ColDef } from 'ag-grid-community';
import locale from './locale';
import './index.scss';
import { Dots } from '../Spin/index';

const NoData = () => <Empty />;

export interface BaseGridProps extends AgGridReactProps {
  className?: string;
  style?: CSSProperties;
  footerGrid?: AgGridReactProps & {
    className?: string;
    style?: CSSProperties;
  };
}

const BaseGridCom: React.ForwardRefRenderFunction<
  AgGridReact,
  BaseGridProps
> = (
  { className, style, defaultColDef, gridOptions, footerGrid, ...gridProps },
  ref,
) => {
  const gridRef = useRef<AgGridReact>(null);
  const getGridOptions = useMemo(() => {
    const topOptions = { ...gridOptions, alignedGrids: [] as any };
    const bottomOptions = { ...gridOptions, alignedGrids: [] as any };
    topOptions.alignedGrids.push(bottomOptions);
    bottomOptions.alignedGrids.push(topOptions);
    return {
      topOptions,
      bottomOptions,
    };
  }, [gridOptions]);
  const mergeDefaultColDef = useMemo<AgGridReactProps['defaultColDef']>(() => {
    return Object.assign<
      {},
      AgGridReactProps['defaultColDef'],
      AgGridReactProps['defaultColDef']
    >({}, defaultColDef, {
      sortable: true,
      resizable: true,
    });
  }, [defaultColDef]);
  useImperativeHandle(ref, () => gridRef.current as AgGridReact, []);
  const gridClassName = useMemo(
    () => classNames('ag-theme-material', 'tea-grid', className),
    [className],
  );
  const footerGridClassName = useMemo(
    () =>
      classNames('ag-theme-material', 'tea-footer-grid', footerGrid?.className),
    [footerGrid?.className],
  );
  const gridStyle = useMemo(() => style, [style]);
  const footerDefaultColumnDefs = useMemo(() => {
    return gridProps.columnDefs?.map((item: ColDef) => {
      return {
        headerName: item.headerName,
        field: item.field,
      };
    });
  }, [gridProps.columnDefs]);
  return (
    <div className={gridClassName} style={gridStyle}>
      <div className="tea-body-grid">
        <AgGridReact
          ref={gridRef}
          localeText={locale.zh}
          defaultColDef={mergeDefaultColDef}
          {...gridProps}
          suppressHorizontalScroll={!!footerGrid?.rowData?.length}
          gridOptions={getGridOptions.topOptions}
        />
      </div>
      {footerGrid?.rowData?.length ? (
        <div className={footerGridClassName} style={footerGrid.style}>
          <AgGridReact
            localeText={locale.zh}
            columnDefs={footerDefaultColumnDefs}
            headerHeight="0"
            overlayNoRowsTemplate=" "
            domLayout="autoHeight"
            scrollbarWidth={gridProps.scrollbarWidth}
            rowHeight={gridProps.rowHeight}
            {...footerGrid}
            gridOptions={getGridOptions.bottomOptions}
          />
        </div>
      ) : null}
    </div>
  );
};

const BaseGridRef = forwardRef(BaseGridCom);
BaseGridRef.defaultProps = {
  enableFilter: false,
  suppressDragLeaveHidesColumns: true,
  overlayNoRowsTemplate: '无数据',
  overlayLoadingTemplate: '加载中...',
  enableCellTextSelection: true,
  rowMultiSelectWithClick: true,
  loadingOverlayComponentFramework: Dots,
  noRowsOverlayComponentFramework: NoData,
  scrollbarWidth: 8,
};

export default BaseGridRef;
