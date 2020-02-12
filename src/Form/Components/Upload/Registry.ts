import { UploadFile, UploadFunc, GetFileInfoType } from './typings';

const Registry: {
  onDownLoad?: (file: UploadFile) => void;
  onPreview?: (file: UploadFile) => void;
  onUpload?: UploadFunc;
  getFileInfo?: GetFileInfoType;
} = {};

export default Registry;
