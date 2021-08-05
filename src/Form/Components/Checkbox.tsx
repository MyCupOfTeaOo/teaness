import React, { useCallback } from 'react';
import { Checkbox as AntCheckbox } from 'antd';
import {
  CheckboxProps as AntCheckboxProps,
  CheckboxGroupProps,
} from 'antd/es/checkbox';

export interface CheckboxProps
  extends Omit<AntCheckboxProps, 'value' | 'onChange'> {
  value?: boolean;
  onChange?: (value: boolean) => void;
}

export { CheckboxGroupProps };

const Checkbox: React.FC<CheckboxProps> & {
  Group: typeof AntCheckbox.Group;
} = props => {
  const { value, onChange, ...rest } = props;
  const onHandle = useCallback(
    e => {
      if (props.onChange) props.onChange(e.target.checked);
    },
    [props.onChange],
  );
  return <AntCheckbox checked={value} onChange={onHandle} {...rest} />;
};

Checkbox.Group = AntCheckbox.Group;

export default Checkbox;
