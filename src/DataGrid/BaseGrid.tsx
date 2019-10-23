import React, { CSSProperties, useMemo, LegacyRef } from 'react';
import { AgGridReact, AgGridReactProps } from 'ag-grid-react';
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
  gridRef?: LegacyRef<AgGridReact>;
}

const BaseGrid: React.FC<BaseGridProps> = ({
  className,
  style,
  gridRef,
  ...gridProps
}) => {
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

BaseGrid.defaultProps = {
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
};

export default BaseGrid;
