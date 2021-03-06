import React from 'react';
import { FormStore } from '../store';

export interface FormContext<T> {
  store: FormStore<T>;
  formId?: string;
  showError: boolean;
}
export default React.createContext<Partial<FormContext<any>>>({});
