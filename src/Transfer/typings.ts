import React, { Dispatch, SetStateAction } from 'react';

export interface Item<T> {
  label: string;
  value: T;
  disabled?: boolean;
  data?: any;
}

export interface BaseTransferProps<T> {
  className?: string;
  style?: React.CSSProperties;
  itemStyle?: React.CSSProperties;
  itemClassName?: string;
  disabled?: boolean;
  /**
   * 左上角标题
   */
  title?: React.ReactNode;
  /**
   * 已选择的对象
   */
  selectList: Item<T>[];
  setSelectList: Dispatch<SetStateAction<Item<T>[]>>;
  renderItem: (item: Item<T>) => React.ReactNode;
}

export interface ClearTransferProps<T> extends BaseTransferProps<T> {}

export interface CheckBoxTransferProps<T> extends BaseTransferProps<T> {
  options: Item<T>[];
  hiddenCheckAll?: boolean;
}
export interface MultiLevelItem<T> extends Item<T> {
  children?: MultiLevelItem<T>[];
}

export interface NavProps<T> {
  data: MultiLevelItem<T>;
  isCurrent?: boolean;
  /**
   * 当 item 没有的时候既是 root 节点
   */
  onClick?: (item?: MultiLevelItem<T>) => void;
}

export interface NavBarProps<T> {
  nodes: MultiLevelItem<T>[];
  /**
   * 当 item 没有的时候既是 root 节点
   */
  onClick?: (item?: MultiLevelItem<T>) => void;
}

export interface MultiLevelTransferProps<T>
  extends Omit<BaseTransferProps<T>, 'renderItem'> {
  options: MultiLevelItem<T>[];
  selectList: MultiLevelItem<T>[];
  setSelectList: Dispatch<SetStateAction<MultiLevelItem<T>[]>>;
  renderItem: (
    multiLevelItem: MultiLevelItem<T>,
    /**
     * 设置导航的方法
     */
    setNodes: Dispatch<SetStateAction<MultiLevelItem<T>[]>>,
  ) => React.ReactNode;
  hiddenCheckAll?: boolean;
}
