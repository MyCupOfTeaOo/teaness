import { UploadProps as AntUploadProps } from 'antd/lib/upload';

import { UploadFile, UploadChangeParam } from 'antd/lib/upload/interface';
import { Dispatch, SetStateAction } from 'react';

export type CancellablePromise<T> = Promise<T> & {
  cancel(): void;
};

export type GetFileInfoType = (
  uid: string,
) => CancellablePromise<{
  name: string;
  url: string;
  size: number;
  type: string;
}>;

export type onUpload = (
  file: UploadFile,
  onUploadProgress: (percent: number) => void,
) => CancellablePromise<{
  uid: string;
  name: string;
  url: string;
  size: number;
  type: string;
}>;

export interface UploadProps extends Omit<AntUploadProps, 'onChange'> {
  value?: string;
  onChange?: (value: string | undefined) => void;
  children?: React.ReactNode;
  /**
   * 选择图片后触发
   */
  onSelect?: (info: UploadChangeParam) => void;
  /**
   * 获取信息失败后的回调
   */
  getInfoErrorback?: (uid: string, err: any) => void;
  /**
   * 获取信息的方法 一般会先从上下文获取,但是这个优先级更高
   */
  getFileInfo?: GetFileInfoType;
  /**
   * 加载信息时候展示的样式
   */
  loading?: React.ReactNode;
  /**
   * 文件最大size 单位KB
   */
  maxSize?: number;
  /**
   * 文件最大数量 单位个
   */
  max?: number;
}

export interface UploadRefType {
  uniqueId: string;
  fileList: AntUploadProps['fileList'];
  setFileList: Dispatch<SetStateAction<AntUploadProps['fileList'] | undefined>>;
  add?: (values: string[]) => void;
}

export interface UploadContextType {
  register: (ref: UploadRefType) => void;
  unregister: (ref: UploadRefType) => void;
  upload: () => CancellablePromise<boolean>;
}

export { UploadFile, UploadChangeParam };
