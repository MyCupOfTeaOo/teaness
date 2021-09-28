import { UploadProps as AntUploadProps } from 'antd/lib/upload';
import {
  UploadFile,
  UploadChangeParam,
  ShowUploadListInterface,
  UploadListType,
} from 'antd/lib/upload/interface';
import { CancellablePromise } from '../typings';

export interface ProgressStatus {
  uid: string;
  name: string;
  status: 'success' | 'error' | 'updating';
  percent: number;
}

export interface FileRenderProps {
  id?: string;
  file: UploadFile;
  disabled?: boolean;
  onDelete(): void;
  onDownload?(file: UploadFile): void;
  onPreview?(file: UploadFile): void;
  showUploadList?: boolean | ShowUploadListInterface;
  listType?: UploadListType | 'file-info';
}

export interface UploadProps
  extends Omit<AntUploadProps, 'onChange' | 'fileList' | 'listType'> {
  children?: React.ReactNode;
  value?: string;
  listType?: UploadListType | 'file-info';
  onChange?: (value: string | undefined) => void;
  /**
   * 上传方法,覆盖默认的
   * @param file 待上传文件
   * @param onUploadProgress 上传进度回调
   */
  onUpload?(
    file: UploadFile,
    onUploadProgress: (percent: number) => void,
  ): CancellablePromise<{
    uid: string;
    name: string;
    url: string;
    size: number;
    type: string;
  }>;
  /**
   * 获取文件信息的方法,覆盖默认的
   * @param uid 文件id
   */
  getFile?(
    uid: string,
  ): CancellablePromise<{
    name: string;
    url: string;
    size: number;
    type: string;
  }>;
  /**
   * 获取预览文件的方法,覆盖默认的
   * @param file 文件
   */
  onPreview?(file: UploadFile): void;
  /**
   * 下载文件的方法,覆盖默认的
   * @param file 文件
   */
  onDownload?(file: UploadFile): void;
  /**
   * 选择文件后触发
   * @param info 上传change信息
   */
  onSelect?(info: UploadChangeParam): void;
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
  /**
   *
   */
  FileRender?: React.ComponentType<FileRenderProps>;
}
