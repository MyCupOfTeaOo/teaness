import React from 'react';
import { UploadContextType, CancellablePromise } from './typings';

export const UploadContext = React.createContext<UploadContextType>({
  register: () => {},
  unregister: () => {},
  upload: () => {
    const p = new Promise(() => {});
    (p as CancellablePromise<boolean>).cancel = () => {};
    return p as CancellablePromise<boolean>;
  },
});
