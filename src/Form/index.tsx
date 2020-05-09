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

(Form as React.FC<FormProps<any>>).defaultProps = {
  layout: {
    row: {
      align: 'middle',
      gutter: [12, 18],
    },
  },
};

export const vertical: {
  row?: RowProps;
  label?: LabelProps;
} = {
  row: {
    align: 'middle',
    gutter: [6, 24],
  },
  label: {
    float: 'left',
    colProps: {
      span: 24,
    },
  },
};

export const horizontal: {
  row?: RowProps;
  label?: LabelProps;
} = {
  row: {
    align: 'middle',
    gutter: [6, 24],
  },
  label: {
    float: 'right',
    labelStyle: {
      minWidth: '40%',
      width: 'fit-content',
      paddingRight: 8,
    },
    colProps: {
      style: {
        display: 'flex',
        alignItems: 'center',
      },
      xs: { span: 24 },
      md: { span: 12 },
      lg: { span: 8 },
      xl: { span: 8 },
    },
  },
};

export const oneline: {
  row?: RowProps;
  label?: LabelProps;
} = {
  row: {
    align: 'middle',
    gutter: [6, 24],
  },
  label: {
    float: 'right',
    labelStyle: {
      minWidth: '40%',
      width: 'fit-content',
      paddingRight: 8,
    },
    childStyle: {
      maxWidth: 300,
    },
    colProps: {
      style: {
        display: 'flex',
        alignItems: 'center',
      },
      xs: { span: 24 },
    },
  },
};

export const inline: {
  row?: RowProps;
  label?: LabelProps;
} = {
  row: {
    align: 'middle',
    gutter: [6, 24],
  },

  label: {
    labelStyle: {
      paddingRight: 8,
    },
    float: 'right',
    colProps: {
      style: {
        display: 'flex',
        alignItems: 'center',
      },
    },
  },
};

Form.vertical = vertical;
Form.horizontal = horizontal;
Form.inline = inline;
Form.oneline = oneline;

export { Autowired, Item };
export * from './hooks';

export default Form;
