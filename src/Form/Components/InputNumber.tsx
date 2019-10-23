import React, { useCallback } from 'react';
import { Input as AntInput } from 'antd';
import { InputProps as AntInputProps } from 'antd/lib/input';
import './styles/InputNumber.scss';

export interface InputNumberProps
  extends Omit<AntInputProps, 'type' | 'onChange'> {
  onChange?: (value: number | undefined) => void;
}

export const InputNumber: React.FC<InputNumberProps> = props => {
  const { onChange, value, ...otherProps } = props;
  const handle = useCallback(
    e => {
      if (onChange) {
        if (e.target.value) onChange(parseInt(e.target.value, 10));
        else onChange(undefined);
      }
    },
    [onChange],
  );
  return (
    <AntInput onChange={onChange && handle} value={value} {...otherProps} />
  );
};

export type InputNumberType = React.FC<InputNumberProps>;
InputNumber.defaultProps = {
  placeholder: '请输入',
};
export default InputNumber;
