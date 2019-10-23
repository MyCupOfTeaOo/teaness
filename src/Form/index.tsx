import React, { useMemo } from 'react';
import { FormConfigs, HookOptions } from './typings';
import { FormStore } from './store';
import { useForm } from './hooks';

export interface FormProps<T> {
  formConfigs: FormConfigs<T>;
  options: HookOptions<T>;
  children: (props: {
    formStore: FormStore<T>;
    components: { [P in keyof T]: any };
  }) => React.ReactNode;
}

const Form: React.FC<FormProps<any>> = props => {
  const { formStore, components } = useForm(props.formConfigs, props.options);
  const children = useMemo(() => props.children({ formStore, components }), [
    formStore,
    components,
  ]);
  return <React.Fragment>{children}</React.Fragment>;
};

export default Form;
