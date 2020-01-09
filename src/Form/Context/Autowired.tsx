import React from 'react';
import lodash from 'lodash-es';
import { observer } from 'mobx-react';
import { FormStore } from '../store';
import { ErrorMessage } from '../typings';

export type Params = {
  errors?: ErrorMessage[];
  [key: string]: any;
};

export type AutowiredFuncChild = (params: Params) => React.ReactNode;

export interface AutowiredProps<
  T extends { [key: string]: any } = { [key: string]: any },
  P extends keyof T | (keyof T)[] = keyof T | (keyof T)[]
> {
  store?: FormStore<T>;
  /**
   * 注入的字段 Key,可以是字符串 或 字符串数组
   */
  id: P;
  children?: React.ReactNode | AutowiredFuncChild;
  /**
   * 数据注入props的名称 默认 value
   */
  valueName?: string;
  /**
   * 数据手机的时机  默认 onChange
   */
  trigger?: string;
}

const Autowired: React.FC<AutowiredProps> = props => {
  const {
    id,
    store,
    children,
    valueName = 'value',
    trigger = 'onChange',
  } = props;
  let p: Params;
  if (Array.isArray(id)) {
    p = {
      [valueName]: id.map(key => store?.componentStores[key]?.formatValue),
      [trigger]: (value: any) =>
        id.forEach((key, index) => {
          store?.componentStores[key]?.onChange(value?.[index]);
        }),
      errors: id.reduce((e: ErrorMessage[] | undefined, key) => {
        const errors = store?.componentStores[key]?.errors;
        if (errors) {
          if (Array.isArray(e)) {
            e.push(...errors);
          } else {
            return errors;
          }
        }
        return e;
      }, undefined),
    };
  } else {
    p = {
      [valueName]: store?.componentStores[id]?.formatValue,
      [trigger]: store?.componentStores[id]?.onChange,
      errors: store?.componentStores[id]?.errors,
    };
  }
  if (lodash.isFunction(children)) {
    return <React.Fragment>{children(p)}</React.Fragment>;
  }
  return (
    <React.Fragment>
      {React.Children.map(children, child => {
        return React.cloneElement(child as React.ReactElement, {
          ...p,
          onChange: (...args: any) => {
            p.onChange?.(...args);
            return (child as React.ReactElement)?.props?.onChange?.(...args);
          },
        });
      })}
    </React.Fragment>
  );
};

Autowired.defaultProps = {
  trigger: 'onChange',
  valueName: 'value',
};

export { Autowired };

export default observer(Autowired);
