import React, { useMemo } from 'react';
import lodash from 'lodash';

export type Value =
  | string
  | boolean
  | number
  | undefined
  | null
  | React.ReactNode;

export interface ShowProps {
  /**
   * 预期值
   */
  expect?: Value | Value[] | ((actual?: Value) => boolean) | RegExp;
  /**
   * 实际值
   */
  actual?: Value;
  /**
   * 占位
   */
  position?: React.ReactNode;
}

const Show: React.FC<ShowProps> = props => {
  const { expect, actual, position } = props;
  const show = useMemo(() => {
    if (lodash.isFunction(expect)) {
      return expect(actual);
    }
    if (lodash.isRegExp(expect)) {
      return expect.test(actual as any);
    }
    if (Array.isArray(expect)) {
      return expect.some(item => item === actual);
    }
    return expect === actual;
  }, [expect, actual]);
  return <React.Fragment>{show ? props.children : position}</React.Fragment>;
};

export default Show;
