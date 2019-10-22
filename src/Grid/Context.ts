import React from 'react';
import { ColProps } from './typings';

export const RowContext = React.createContext<{ colProps?: ColProps }>({});
