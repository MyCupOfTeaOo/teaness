import React, { useContext, CSSProperties } from 'react';
import { observer } from 'mobx-react';
import Label from '../Label';
import { LabelProps } from '../Label/typings';
import Autowired, { AutowiredProps } from './Context/Autowired';
import { genFormId, searchRequired } from './utils';
import FormContext from './Context/FormContext';

export interface ItemProps<
  T extends { [key: string]: any } = any,
  P extends Extract<keyof T, string> | Extract<keyof T, string>[] =
    | Extract<keyof T, string>
    | Extract<keyof T, string>[]
> extends AutowiredProps<T, P>, Omit<LabelProps, 'children' | 'id'> {
  errorClassName?: string;
  errorStyle?: CSSProperties;
}

const Item: React.FC<ItemProps> = props => {
  const {
    store,
    id,
    children,
    valueName,
    trigger,
    showError,
    errorClassName,
    errorStyle,
    ...rest
  } = props;
  const context = useContext(FormContext);
  return (
    <Label
      required={searchRequired(id, store || context.store)}
      id={genFormId(id)}
      {...rest}
    >
      <Autowired
        store={store}
        id={id}
        valueName={valueName}
        trigger={trigger}
        showError={showError}
        errorClassName={errorClassName}
        errorStyle={errorStyle}
      >
        {children}
      </Autowired>
    </Label>
  );
};

export default observer(Item);
