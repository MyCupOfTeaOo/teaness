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
    row?: RowProps;
    label?: LabelProps;
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

export const vertical: {
  row?: RowProps;
  label?: LabelProps;
} = {
  row: {
    align: 'middle',
    gutter: [6, 0],
  },
  label: {
    float: 'left',
    colProps: {
      label: {
        span: 24,
        style: {
          padding: 0,
        },
      },
      children: {
        span: 24,
        style: {
          padding: 0,
          marginBottom: 24,
        },
      },
    },
  },
};

export const horizontal: {
  row?: RowProps;
  label?: LabelProps;
} = {
  row: {
    align: 'middle',
    gutter: [6, 0],
  },
  label: {
    float: {
      xs: 'right',
      md: 'right',
    },
    colProps: {
      label: {
        xs: { span: 7 },
        md: { span: 5 },
        lg: { span: 2 },
        xl: { span: 3 },
      },
      children: {
        xs: {
          span: 15,
        },
        md: { span: 7 },
        lg: { span: 6 },
        xl: { span: 5 },
      },
    },
  },
};

Form.vertical = vertical;
Form.horizontal = horizontal;

export { Autowired, Item };
export * from './hooks';

export default Form;
