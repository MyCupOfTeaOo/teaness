import { UploadFile, onUpload, GetFileInfoType } from './typings';

const Registry: {
  onDownLoad?: (file: UploadFile) => void;
  onPreview?: (file: UploadFile) => void;
  upload?: onUpload;
  getFileInfo?: GetFileInfoType;
} = {};

export default Registry;
