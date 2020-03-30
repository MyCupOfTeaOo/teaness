import { ColProps as AntColProps } from 'antd/es/col';
import { RowProps as AntRowProps } from 'antd/es/row';

export interface ColProps extends AntColProps {}
export interface RowProps extends AntRowProps {
  colProps?: ColProps;
}
