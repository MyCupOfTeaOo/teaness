import React from 'react';
import { FormStore } from './store';
import Autowired from './Context/Autowired';
import FormContext from './Context/FormContext';
import { LabelRow } from '../Label';
import { LabelRowProps } from '../Label/typings';
import Item from './Item';

export interface FormProps<T>
  extends React.DetailedHTMLProps<
    React.FormHTMLAttributes<HTMLFormElement>,
    HTMLFormElement
  > {
  children?: React.ReactNode;
  store: FormStore<T>;
  layout?: LabelRowProps;
  showError?: boolean;
}

function Form<T>(props: FormProps<T>) {
  const { layout, store, children, showError, ...rest } = props;
  return (
    <form {...rest}>
      <LabelRow {...layout}>
        <FormContext.Provider
          value={{
            store,
            showError,
          }}
        >
          {children}
        </FormContext.Provider>
      </LabelRow>
    </form>
  );
}

export { Autowired, Item };
export * from './hooks';

export default Form;
