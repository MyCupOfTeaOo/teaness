import React from 'react';
import { useStore, useAutoWired } from './hooks';
import { FormStore } from './store';
import Autowired from './Context/Autowired';

export interface FormProps<T> {
  children?: React.ReactNode;
  store: FormStore<T>;
}

function Form<T>(props: FormProps<T>) {
  return <form>{props.children}</form>;
}

export { useStore, Autowired, useAutoWired };

export default Form;
