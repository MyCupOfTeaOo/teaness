import React from 'react';
import { Button, Popover } from 'antd';
import numeral from 'numeral';
import { ButtonType } from 'antd/lib/button';
import { isObject } from 'lodash-es';
import Show, { Decision } from '../Show';
import { FileRenderProps } from './typings';

function statusToType(status?: string): ButtonType | 'danger' | undefined {
  switch (status) {
    case 'error':
      return 'danger';
    case 'success':
    case 'done':
      return 'primary';
    default:
      return undefined;
  }
}

const FileRender: React.FC<FileRenderProps> = ({
  disabled,
  onDelete,
  file,
  onDownLoad,
  onPreview,
  showUploadList,
}) => {
  return (
    <div>
      <Popover
        trigger="hover"
        title={
          <div className="tea-filerender">
            <span>文件信息</span>
            <Button.Group>
              <Show
                actual={
                  showUploadList &&
                  isObject(showUploadList) &&
                  showUploadList.showPreviewIcon
                }
                expect
              >
                <Button
                  size="small"
                  type="primary"
                  ghost
                  onClick={() => {
                    onPreview?.(file);
                  }}
                >
                  预览
                </Button>
              </Show>
              <Show
                actual={
                  showUploadList &&
                  isObject(showUploadList) &&
                  showUploadList.showDownloadIcon
                }
                expect
              >
                <Button
                  type="primary"
                  size="small"
                  onClick={() => {
                    onDownLoad?.(file);
                  }}
                >
                  下载
                </Button>
              </Show>
              <Show
                actual={
                  !disabled &&
                  showUploadList &&
                  isObject(showUploadList) &&
                  showUploadList.showRemoveIcon
                }
                expect
              >
                <Button
                  type="primary"
                  danger
                  size="small"
                  onClick={() => {
                    // eslint-disable-next-line
                    file.status = 'removed';
                    onDelete();
                  }}
                >
                  删除
                </Button>
              </Show>
            </Button.Group>
          </div>
        }
        content={
          <ul className="tea-filerender-info">
            <li>
              <strong>文件名:&nbsp;</strong> {file.name}
            </li>
            <li>
              <strong>文件类型:&nbsp;</strong> {file.type}
            </li>
            <li>
              <strong>文件大小:&nbsp;</strong>
              {numeral(file.size / 1024 / 1024).format('0.00')}M
            </li>
            <li>
              <strong>状态:&nbsp;</strong>
              <Decision actual={file.status}>
                <Decision.Case expect="done">
                  <span className="tea-success">已上传</span>
                </Decision.Case>
                <Decision.Case expect="success">
                  <span className="tea-success">上传成功</span>
                </Decision.Case>
                <Decision.Case expect="error">
                  <span className="tea-danger">上传失败</span>
                </Decision.Case>
                <Decision.Case expect="uploading">
                  <span className="tea-normal">正在上传</span>
                </Decision.Case>
                <Decision.Case expect="removed">
                  <span className="tea-danger">已删除</span>
                </Decision.Case>
                <Decision.Case>
                  <span className="tea-warning">待上传</span>
                </Decision.Case>
              </Decision>
            </li>
          </ul>
        }
      >
        <Button
          disabled={disabled}
          type={
            statusToType(file.status) === 'danger'
              ? 'primary'
              : (statusToType(file.status) as ButtonType)
          }
          danger={statusToType(file.status) === 'danger'}
          onClick={() => {
            if (file.status !== 'error') {
              if (showUploadList) {
                if (isObject(showUploadList)) {
                  if (showUploadList.showPreviewIcon) {
                    onPreview?.(file);
                  } else {
                    onDownLoad?.(file);
                  }
                } else {
                  onPreview?.(file);
                }
              }
            }
          }}
        >
          <Decision actual={file.status}>
            <Decision.Case expect="error">重新上传</Decision.Case>
            <Decision.Case expect={v => v && v !== 'error'}>
              查看附件
            </Decision.Case>
            <Decision.Case>附件待上传</Decision.Case>
          </Decision>
        </Button>
      </Popover>
    </div>
  );
};

export default FileRender;
