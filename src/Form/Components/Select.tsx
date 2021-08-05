import React, { useMemo, useEffect } from 'react';
import { Select as AntSelect } from 'antd';
import { SelectProps as AntSelectProps } from 'antd/es/select';
import classnames from 'classnames';
import './styles/select.scss';
import { useEffectState } from '../../hooks/index';
import { CancellablePromise } from '../../typings';

export interface SelectProps extends AntSelectProps<any> {
  requestMethod?: () => CancellablePromise<{ label: string; value: any }[]>;
  errorCallback?: (error: any) => void;
  /**
   * options 不能与 requestMethod 同时使用
   */
  options?: { label: string; value: any }[];
}

const Select: React.FC<SelectProps> & {
  Option: import('rc-select/lib/Option').OptionFC;
  OptGroup: import('rc-select/lib/OptGroup').OptionGroupFC;
} = props => {
  const {
    onChange,
    options: defaultOptions,
    requestMethod,
    errorCallback,
    className,
    value,
    ...otherProps
  } = props;
  const [options, setOptions] = useEffectState(defaultOptions, [
    defaultOptions,
  ]);
  const children = useMemo(
    () =>
      props.children ||
      (Array.isArray(options)
        ? options.map(item => (
            <AntSelect.Option key={item.value} value={item.value}>
              {item.label}
            </AntSelect.Option>
          ))
        : undefined),
    [props.children, options],
  );
  useEffect(() => {
    let req: CancellablePromise<{ label: string; value: any }[]>;
    if (requestMethod) {
      req = requestMethod();
      req
        .then(items => setOptions(items))
        .catch(error => {
          if (errorCallback) {
            errorCallback(error);
          } else console.error(error);
        });
    } else {
      setOptions(defaultOptions);
    }
    return () => {
      if (req) {
        req.cancel();
      }
    };
  }, [requestMethod]);
  return (
    <AntSelect
      className={classnames('tea-select', className)}
      {...otherProps}
      value={value ?? undefined}
      onChange={onChange}
    >
      {children}
    </AntSelect>
  );
};

export type SelectType = React.FC<SelectProps>;

Select.Option = AntSelect.Option;
Select.OptGroup = AntSelect.OptGroup;
Select.defaultProps = {
  options: [],
  placeholder: '请选择',
  showSearch: true,
  allowClear: true,
  filterOption: (input, option) =>
    (option?.props.children as string)
      .toLowerCase()
      .indexOf(input.toLowerCase()) >= 0,
};
export default Select;
