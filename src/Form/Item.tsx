import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
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
> extends AutowiredProps<T, P>, Omit<LabelProps, 'children' | 'id'> {}

const Item: React.FC<ItemProps> = props => {
  const {
    store,
    id,
    children,
    valueName,
    trigger,
    showError,
    showErrorProps,
    suppressErrorOnValiding,
    replaceId,
    ...rest
  } = props;
  const context = useContext(FormContext);
  return (
    <Label
      required={searchRequired(id, store || context.store)}
      id={genFormId(id, replaceId)}
      {...rest}
    >
      <Autowired
        replaceId={replaceId}
        suppressErrorOnValiding={suppressErrorOnValiding}
        store={store}
        id={id}
        valueName={valueName}
        trigger={trigger}
        showError={showError}
        showErrorProps={showErrorProps}
      >
        {children}
      </Autowired>
    </Label>
  );
};

export default observer(Item);
