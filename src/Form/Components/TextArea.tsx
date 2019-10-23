import React from 'react';
import { Input as AntInput } from 'antd';
import { TextAreaProps as AntTextAreaProps } from 'antd/lib/input';

const AntTextArea = AntInput.TextArea;

export interface TextAreaProps extends AntTextAreaProps {}

const TextArea: React.FC<TextAreaProps> = props => {
  return <AntTextArea {...props} />;
};
export type TextAreaType = React.FC<TextAreaProps>;
TextArea.defaultProps = {
  placeholder: '请输入',
};
export default TextArea;
