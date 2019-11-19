import React, { Dispatch, SetStateAction } from 'react';

export interface Item<T> {
  label: string;
  value: T;
  data?: any;
}

export interface ClearTransferProps<T> {
  className?: string;
  style?: React.CSSProperties;
  itemStyle?: React.CSSProperties;
  itemClassName?: string;
  /**
   * 左上角标题
   */
  title?: React.ReactNode;
  /**
   * 已选择的对象
   */
  selectList: Item<T>[];
  setSelectList: Dispatch<SetStateAction<Item<T>[]>>;
  renderList: (item: Item<T>) => React.ReactNode;
}
