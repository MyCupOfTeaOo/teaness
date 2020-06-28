import React from 'react';
import { RowProps } from '../Grid/typings';
import { FormStore } from './store';
import Autowired from './Context/Autowired';
import FormContext from './Context/FormContext';
import Item from './Item';
import { LabelProps } from '../Label/typings';
import Layout, {
  vertical,
  horizontal,
  oneline,
  login,
  inline,
  maskLayout,
} from './Components/Utils/Layout';

export interface FormProps<T>
  extends React.DetailedHTMLProps<
    React.FormHTMLAttributes<HTMLFormElement>,
    HTMLFormElement
  > {
  children?: React.ReactNode;
  store: FormStore<T>;
  layout?: {
    row?: RowProps;
    label?: LabelProps;
  };
  showError?: boolean;
}

function Form<T>(props: FormProps<T>) {
  const { layout, store, children, showError, ...rest } = props;
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
      }}
      {...rest}
    >
      <Layout layout={layout}>
        <FormContext.Provider
          value={{
            store,
            showError,
          }}
        >
          {children}
        </FormContext.Provider>
      </Layout>
    </form>
  );
}

(Form as React.FC<FormProps<any>>).defaultProps = {
  layout: {
    row: {
      align: 'middle',
      gutter: [12, 18],
      style: {
        marginBottom: -9,
      },
    },
  },
};

Form.vertical = vertical;
Form.horizontal = horizontal;
Form.inline = inline;
Form.oneline = oneline;
Form.login = login;

export { Autowired, Item, Layout, maskLayout };
export * from './hooks';

export default Form;
