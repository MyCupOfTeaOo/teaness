import React from 'react';
import { Row } from '../Grid';
import { RowProps } from '../Grid/typings';
import { FormStore } from './store';
import Autowired from './Context/Autowired';
import FormContext from './Context/FormContext';
import Item from './Item';
import { LabelProps } from '../Label/typings';
import { LabelContext } from '../Label/Context';

export interface FormProps<T>
  extends React.DetailedHTMLProps<
    React.FormHTMLAttributes<HTMLFormElement>,
    HTMLFormElement
  > {
  children?: React.ReactNode;
  store: FormStore<T>;
  layout?: {
    row: RowProps;
    label: LabelProps;
  };
  showError?: boolean;
}

function Form<T>(props: FormProps<T>) {
  const { layout, store, children, showError, ...rest } = props;
  return (
    <form {...rest}>
      <LabelContext.Provider value={layout?.label}>
        <Row {...layout?.row}>
          <FormContext.Provider
            value={{
              store,
              showError,
            }}
          >
            {children}
          </FormContext.Provider>
        </Row>
      </LabelContext.Provider>
    </form>
  );
}

export { Autowired, Item };
export * from './hooks';

export default Form;
