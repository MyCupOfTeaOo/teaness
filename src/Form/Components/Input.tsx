import React from 'react';
import { Input as AntInput } from 'antd';
import './styles/Input.scss';
import { InputProps as AntInputProps } from 'antd/lib/input';

export interface InputProps extends AntInputProps {}

const Input: React.FC<InputProps> = props => {
  return <AntInput {...props} />;
};
export type InputType = React.FC<InputProps>;
Input.defaultProps = {
  placeholder: '请输入',
};
export default Input;
