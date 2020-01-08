import React from 'react';
import lodash from 'lodash-es';
import { observer } from 'mobx-react';
import { FormStore } from '../store';
import { ErrorMessage } from '../typings';

export type Params = {
  onChange?: (...arg: any) => void;
  errors?: ErrorMessage[];
  [key: string]: any;
};

export type AutowiredFuncChild = (params: Params) => React.ReactNode;

export interface AutowiredProps<
  T extends { [key: string]: any } = { [key: string]: any },
  P extends keyof T | (keyof T)[] = keyof T | (keyof T)[]
> {
  store?: FormStore<T>;
  id: P;
  children?: React.ReactNode | AutowiredFuncChild;
  valueName?: string;
}

const Autowired: React.FC<AutowiredProps> = props => {
  const { id, store, children, valueName = 'value' } = props;
  let p: Params;
  if (Array.isArray(id)) {
    p = {
      [valueName]: id.map(key => store?.componentStores[key]?.formatValue),
      onChange: value =>
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
      onChange: store?.componentStores[id]?.onChange,
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

export { Autowired };

export default observer(Autowired);
