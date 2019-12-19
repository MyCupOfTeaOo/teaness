import React from 'react';
import { ColProps, RowProps } from '../Grid/typings';

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
   * 标题
   */
  text?: string;
  /**
   * 覆盖标题的渲染
   */
  renderText?: React.ReactNode;
  className?: string;
  /**
   * 必填状态样式
   */
  required?: boolean;
  /**
   * 文字对齐方式
   */
  float?: FloatSize | Float;
  /**
   * 参考 label的colProps与 内容的 Colprops  grid col
   */
  colProps?: { label?: ColProps; children?: ColProps };
  children?: React.ReactNode;
  /**
   * 文字样式
   */
  labelStyle?: React.CSSProperties;
  /**
   * 内容样式
   */
  childrenStyle?: React.CSSProperties;
  id?: string;
}

export interface LabelRowProps extends RowProps {
  /**
   * 可以被 Label colProps 覆盖
   */
  colProps?: LabelProps['colProps'];
  /**
   * label文字对齐方式,可以被 Label float 覆盖
   */
  labelFloat?: FloatSize | Float;
}
