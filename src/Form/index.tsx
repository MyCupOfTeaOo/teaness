import React from 'react';
import { useStore } from './hooks';
import { FormStore } from './store';

export interface FormProps<T> {
  children?: React.ReactNode;
  store: FormStore<T>;
}

function Form<T>(props: FormProps<T>) {
  return <form>{props.children}</form>;
}

export { useStore };

export default Form;
