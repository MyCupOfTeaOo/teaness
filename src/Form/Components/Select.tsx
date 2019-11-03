import React, { useState, useMemo, useEffect } from 'react';
import { Select as AntSelect } from 'antd';
import {
  SelectProps as AntSelectProps,
  OptionProps,
  OptGroupProps,
} from 'antd/lib/select';
import classnames from 'classnames';
import './styles/select.scss';

export type CancellablePromise<T> = Promise<T> & {
  cancel(): void;
};

export interface SelectProps extends AntSelectProps {
  requestMethod?: () => CancellablePromise<{ label: string; value: any }[]>;
  errorCallback?: (error: any) => void;
  options?: { label: string; value: any }[];
}

const Select: React.FC<SelectProps> & {
  Option: React.ClassicComponentClass<OptionProps>;
  OptGroup: React.ClassicComponentClass<OptGroupProps>;
} = props => {
  const {
    onChange,
    options: defaultOptions,
    requestMethod,
    errorCallback,
    className,
    ...otherProps
  } = props;
  const [options, setOptions] = useState(defaultOptions);
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
};
export default Select;
