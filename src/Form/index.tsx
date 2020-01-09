import React from 'react';
import { FormStore } from './store';
import Autowired from './Context/Autowired';
import FormContext from './Context/FormContext';
import { LabelRow } from '../Label';
import { LabelRowProps } from '../Label/typings';
import Item from './Item';

export interface FormProps<T> {
  children?: React.ReactNode;
  store: FormStore<T>;
  layout?: LabelRowProps;
}

function Form<T>(props: FormProps<T>) {
  return (
    <form>
      <LabelRow {...props.layout}>
        <FormContext.Provider
          value={{
            store: props.store,
          }}
        >
          {props.children}
        </FormContext.Provider>
      </LabelRow>
    </form>
  );
}

export { Autowired, Item };
export * from './hooks';

export default Form;
