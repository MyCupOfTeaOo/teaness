import React, { useContext } from 'react';
import lodash from 'lodash-es';
import { observer } from 'mobx-react';
import { FormStore } from '../store';
import { ErrorMessage } from '../typings';
import FormContext from './FormContext';
import { ShowError } from '../Components';
import { genFormId } from '../utils';

export type Params = {
  id: string;
  errors?: ErrorMessage[];
  [key: string]: any;
};

export type AutowiredFuncChild = (params: Params) => React.ReactNode;

export interface AutowiredProps<
  T extends { [key: string]: any } = any,
  P extends Extract<keyof T, string> | Extract<keyof T, string>[] =
    | Extract<keyof T, string>
    | Extract<keyof T, string>[]
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
   * 数据收集的时机  默认 onChange
   */
  trigger?: string;
  showError?: boolean;
}

const Autowired: React.FC<AutowiredProps> = props => {
  const {
    id,
    children,
    valueName = 'value',
    trigger = 'onChange',
    showError,
  } = props;
  const context = useContext(FormContext);
  const store = props.store || context.store;
  let p: Params;
  if (Array.isArray(id)) {
    p = {
      id: genFormId(id),
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
      id: genFormId(id),
      [valueName]: store?.componentStores[id]?.formatValue,
      [trigger]: store?.componentStores[id]?.onChange,
      errors: store?.componentStores[id]?.errors,
    };
  }
  let childnode;
  if (lodash.isFunction(children)) {
    childnode = <React.Fragment>{children(p)}</React.Fragment>;
  } else {
    childnode = React.Children.map(children, child => {
      return React.cloneElement(child as React.ReactElement, {
        ...p,
        onChange: (...args: any) => {
          p.onChange?.(...args);
          return (child as React.ReactElement)?.props?.onChange?.(...args);
        },
      });
    });
  }
  if (showError) {
    return <ShowError error={p.errors}>{childnode}</ShowError>;
  }
  return <React.Fragment>{childnode}</React.Fragment>;
};

Autowired.defaultProps = {
  trigger: 'onChange',
  valueName: 'value',
  showError: true,
};

export { Autowired };

export default observer(Autowired);
