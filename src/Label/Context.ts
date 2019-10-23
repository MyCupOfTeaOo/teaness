import React from 'react';
import { LabelProps } from './typings';

export const LabelRowContext = React.createContext<{
  colProps?: LabelProps['colProps'];
  labelFloat?: LabelProps['float'];
}>({});
