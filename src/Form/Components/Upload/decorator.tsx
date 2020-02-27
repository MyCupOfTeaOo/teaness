import React from 'react';
import { UploadGroupProps } from './typings';
import UploadGroup from './UploadGroup';

export const bind = (options?: UploadGroupProps) => {
  return function<T>(WrappedComponent: React.ComponentType<T>) {
    return (props: T) => {
      return (
        <UploadGroup {...options}>
          <WrappedComponent {...props} />
        </UploadGroup>
      );
    };
  };
};
