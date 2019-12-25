import React from 'react';
import lodash from 'lodash-es';

export type Value =
  | string
  | boolean
  | number
  | undefined
  | null
  | React.ReactNode;

export interface CaseProps {
  /**
   * 预期值
   */
  expect?: Value | Value[] | RegExp | ((actual?: Value) => boolean);
}

export const Case: React.FC<CaseProps> = props => {
  return <React.Fragment>{props.children}</React.Fragment>;
};

export interface SwitchProps {
  /**
   * 实际值
   */
  actual?: Value;
  /**
   * 占位
   */
  position?: React.ReactNode;
  children?: React.ReactNode | React.ReactNode[];
}

const Switch: React.FC<SwitchProps> & {
  Case: typeof Case;
} = props => {
  const { actual, position } = props;

  const children = React.Children.map(
    props.children as any,
    (child: React.ReactElement<CaseProps>) => {
      if (!child?.props) {
        return child;
      }
      const { expect } = child.props;
      if (lodash.isFunction(expect)) {
        return expect(actual) ? child : position;
      }
      if (lodash.isRegExp(expect)) {
        return expect.test(actual as any) ? child : position;
      }
      if (Array.isArray(expect)) {
        return expect.some(item => item === actual) ? child : position;
      }
      return expect === actual ? child : position;
    },
  );
  return <React.Fragment>{children}</React.Fragment>;
};

Switch.Case = Case;

export default Switch;
