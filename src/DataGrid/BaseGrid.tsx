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
import './index.scss';
import { Dots } from '../Spin/index';

const NoData = () => <Empty />;

export interface BaseGridProps extends AgGridReactProps {
  className?: string;
  style?: CSSProperties;
}

const BaseGridCom: React.ForwardRefRenderFunction<
  AgGridReact | null,
  BaseGridProps
> = ({ className, style, ...gridProps }, ref) => {
  const gridRef = useRef<AgGridReact>(null);
  useImperativeHandle(ref, () => gridRef.current, []);
  const gridClassName = useMemo(
    () => classNames('ag-theme-material', 'tea-grid', className),
    [className],
  );
  const gridStyle = useMemo(() => style, [style]);
  return (
    <div className={gridClassName} style={gridStyle}>
      <AgGridReact ref={gridRef} {...gridProps} />
    </div>
  );
};

const BaseGridRef = forwardRef(BaseGridCom);
BaseGridRef.defaultProps = {
  enableColResize: true,
  enableSorting: true,
  enableFilter: false,
  suppressDragLeaveHidesColumns: true,
  overlayNoRowsTemplate: '无数据',
  overlayLoadingTemplate: '加载中...',
  enableCellTextSelection: true,
  rowMultiSelectWithClick: true,
  loadingOverlayComponentFramework: Dots,
  noRowsOverlayComponentFramework: NoData,
  scrollbarWidth: 8,
  reactNext: true,
};

export default BaseGridRef;
