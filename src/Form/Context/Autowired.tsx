import React, { useContext } from 'react';
import lodash from 'lodash-es';
import { observer } from 'mobx-react';
import { FormStore } from '../store';
import { ErrorMessage, CheckResult } from '../typings';
import FormContext from './FormContext';
import { ShowError, ShowErrorProps } from '../Components';
import { genFormId } from '../utils';

export type Params = {
  /**
   * string | string[]
   */
  id: any;
  errors?: ErrorMessage[];
  disabled?: boolean;
  checkresult: CheckResult | CheckResult[];
  [key: string]: any;
};

export type AutowiredFuncChild = (params: Params) => React.ReactNode;

export interface AutowiredProps<
  T extends { [key: string]: any } = any,
  P extends Extract<keyof T, string> | Extract<keyof T, string>[] =
    | Extract<keyof T, string>
    | Extract<keyof T, string>[]
> {
  store?: FormStore<T>;
  /**
   * 注入的字段 Key,可以是字符串 或 字符串数组
   */
  id: P;
  children?: React.ReactNode | AutowiredFuncChild;
  /**
   * 数据注入props的名称 默认 value
   */
  valueName?: string;
  /**
   * 数据收集的时机  默认 onChange
   */
  trigger?: string;

  /**
   *
   */
  suppressErrorOnValiding?: boolean;
  /**
   * 是否展示错误信息
   */
  showError?: boolean;
  /**
   * 错误信息组件props
   */
  showErrorProps?: ShowErrorProps;
}

const Autowired: React.FC<AutowiredProps> = props => {
  const {
    id,
    children,
    valueName = 'value',
    trigger = 'onChange',
    suppressErrorOnValiding = false,
    showErrorProps,
  } = props;
  const context = useContext(FormContext);
  const store = props.store || context.store;
  const showError = props.showError ?? context.showError ?? true;
  let p: Params;
  if (Array.isArray(id)) {
    p = {
      checkresult: id.map(
        key => store?.componentStores[key]?.checkResult || 'default',
      ),
      id: genFormId(id),
      [valueName]: id.map(key => store?.componentStores[key]?.source),
      [trigger]: (value: any) =>
        id.forEach((key, index) => {
          store?.componentStores[key]?.onChange(value?.[index]);
        }),
      disabled: store?.disabled,
      errors: id.reduce((e: ErrorMessage[] | undefined, key) => {
        const errors = store?.componentStores[key]?.errors;
        if (
          errors &&
          (suppressErrorOnValiding
            ? store?.componentStores[key]?.checkResult !== 'loading'
            : true)
        ) {
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
      checkresult: store?.componentStores[id]?.checkResult || 'default',
      id: genFormId(id),
      [valueName]: store?.componentStores[id]?.source,
      [trigger]: store?.componentStores[id]?.onChange,
      errors:
        suppressErrorOnValiding &&
        store?.componentStores[id]?.checkResult === 'loading'
          ? undefined
          : store?.componentStores[id]?.errors,
      disabled: store?.disabled,
    };
  }
  let childnode;
  if (lodash.isFunction(children)) {
    childnode = <React.Fragment>{children(p)}</React.Fragment>;
  } else {
    childnode = React.cloneElement(children as React.ReactElement, {
      ...p,
      disabled: (children as React.ReactElement)?.props?.disabled ?? p.disabled,
      [trigger]: (...args: any) => {
        p[trigger]?.(...args);
        return (children as React.ReactElement)?.props?.[trigger]?.(...args);
      },
    });
  }

  if (showError) {
    return (
      <ShowError error={p.errors} {...showErrorProps}>
        {childnode}
      </ShowError>
    );
  }
  return <React.Fragment>{childnode}</React.Fragment>;
};

Autowired.defaultProps = {
  trigger: 'onChange',
  valueName: 'value',
};

export default observer(Autowired);
