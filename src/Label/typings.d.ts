import React from 'react';
import { ColProps } from '../Grid/typings';

export type Float = 'left' | 'right' | 'center';

export interface FloatSize {
  xs?: Float;
  sm?: Float;
  md?: Float;
  lg?: Float;
  xl?: Float;
  xxl?: Float;
}

export interface LabelProps {
  /**
   * 标题,并且会附加到title属性上
   */
  text?: string;
  /**
   * 覆盖标题的渲染
   */
  renderText?: React.ReactNode;
  /**
   * 必填状态样式
   */
  required?: boolean;
  /**
   * 文字对齐方式
   */
  float?: FloatSize | Float;
  /**
   * 参考 grid col
   */
  colProps?: ColProps;
  /**
   * label classname
   */
  labelClassName?: string;
  /**
   * 文字样式
   */
  labelStyle?: React.CSSProperties;
  /**
   * 是否展示冒号,默认true
   */
  colon?: boolean;
  /**
   * 绑定的表单id
   */
  id?: string;
  childClassName?: string;
  childStyle?: React.CSSProperties;
  children?: React.ReactNode;
}
