import React from 'react';
import lodash from 'lodash-es';
import { observer } from 'mobx-react';
import { FormStore } from '../store';
import { ErrorMessage } from '../typings';

export type Params = {
  value?: any;
  onChange?: (...arg: any) => void;
  errors?: ErrorMessage[];
};

export type AutowiredFuncChild = (params: Params) => React.ReactNode;

export interface AutowiredProps<
  T extends { [key: string]: any } = { [key: string]: any },
  P extends keyof T | (keyof T)[] = keyof T | (keyof T)[]
> {
  store?: FormStore<T>;
  id: P;
  children?: React.ReactNode | AutowiredFuncChild;
}

const Autowired: React.FC<AutowiredProps> = props => {
  const { id, store, children } = props;
  let p: Params;
  if (Array.isArray(id)) {
    p = {
      value: id.map(key => store?.componentStores[key]?.value),
      onChange: (...values) =>
        id.forEach((key, index) =>
          store?.componentStores[key]?.onChange(values?.[index]),
        ),
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
      value: store?.componentStores[id]?.value,
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
        return React.cloneElement(child as React.ReactElement, p);
      })}
    </React.Fragment>
  );
};

export { Autowired };

export default observer(Autowired);
