import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import AntUpload, { UploadChangeParam } from 'antd/lib/upload';
import MaskModal from '@material-ui/core/Modal';
import { UploadFile } from 'antd/lib/upload/interface';
import { message, Modal } from 'antd';
import { Circle } from '../Spin';
import { useValue, useMound } from '../hooks';
import { UploadProps, ProgressStatus } from './typings';
import UploadProgress from './UploadProgress';
import MyFileRender from './FileRender';
import './styles.scss';

const Upload: React.FC<UploadProps> = props => {
  const {
    value,
    onChange,
    onSelect,
    getFile,
    loading,
    maxSize,
    max,
    onUpload,
    children,
    listType,
    FileRender = listType === 'file-info' ? MyFileRender : undefined,
    showUploadList,
    ...rest
  } = props;
  // 所有的cancel
  const cancelsRef = useRef(new Set<() => void>());
  const getFilesRef = useRef<{ [key: string]:() => void }>({});
  const progresses = useValue<ProgressStatus[]>([]);
  const mound = useMound();
  const loadingValue = useValue(false);
  const beforeUpload = useCallback(() => false, []);
  const fileListValue = useValue<UploadFile[]>();
  const checkRegexp = useMemo(() => {
    if (props.accept) {
      return new RegExp(
        props.accept.replace(/\*|^\.|(?<=,)./g, '.*').replace(/,/g, '|'),
        'i',
      );
    }
  }, [props.accept]);
  const myChange = useCallback(
    (info: UploadChangeParam) => {
      const file = {
        name: info.file.name,
        size: info.file.size,
        uid: info.file.uid,
        url: info.file.url,
        type: info.file.type,
        status: info.file.status,
      };
      switch (file.status) {
        case 'removed': {
          fileListValue.setValue(
            fileListValue.value?.filter(item => item.uid !== file.uid),
          );
          const newValue = fileListValue.value
            ?.filter(
              item => item.status === 'success' || item.status === 'done',
            )
            .map(item => item.uid)
            .join(',');
          if (!newValue) {
            onChange?.(undefined);
          } else {
            onChange?.(newValue);
          }

          break;
        }
        default: {
          // 文件大小验证
          if (maxSize && file.size / 1024 > maxSize) {
            message.error(
              <span>
                文件最大只能上传<strong className="danger">{maxSize}</strong>KB
              </span>,
            );
            return;
          }
          // 文件类型验证
          if (
            checkRegexp &&
            !(
              checkRegexp.test(info.file.type) ||
              checkRegexp.test(info.file.name)
            )
          ) {
            message.error('文件类型错误');
            return;
          }
          // 新增文件
          if (fileListValue.value) {
            // 文件截取
            if (max && fileListValue.value.length >= max) {
              fileListValue.value.push(file);
              fileListValue.value.splice(0, fileListValue.value.length - max);
              fileListValue.setValue([...fileListValue.value]);
            } else {
              fileListValue.setValue(fileListValue.value.concat([file]));
            }
          } else {
            fileListValue.setValue([file]);
          }
          // 上传去
          if (onUpload) {
            const uploadProgress: ProgressStatus = {
              uid: file.uid,
              name: file.name,
              status: 'updating',
              percent: 0,
            };
            progresses.value.push(uploadProgress);
            progresses.setValue([...progresses.value]);
            const req = onUpload(info.file, progress => {
              if (mound.current && uploadProgress.status === 'updating') {
                Object.assign(uploadProgress, {
                  ...uploadProgress,
                  percent: progress,
                });
                progresses.setValue([...progresses.value]);
              }
            });
            cancelsRef.current.add(req.cancel);
            req
              .then(res => {
                if (mound.current) {
                  Object.assign(uploadProgress, {
                    ...uploadProgress,
                    status: 'success',
                  });
                  progresses.setValue([...progresses.value]);
                  Object.assign(file, {
                    ...res,
                    status: 'success',
                  });
                  fileListValue.setValue(
                    fileListValue.value ? [...fileListValue.value] : undefined,
                  );
                  onChange?.(
                    fileListValue.value
                      ?.filter(
                        item =>
                          item.status === 'done' || item.status === 'success',
                      )
                      .map(item => item.uid)
                      .join(','),
                  );
                }
              })
              .catch(err => {
                console.error(err);
                if (mound.current) {
                  Object.assign(uploadProgress, {
                    ...uploadProgress,
                    status: 'error',
                  });
                  progresses.setValue([...progresses.value]);
                  Object.assign(file, {
                    status: 'error',
                  });
                  fileListValue.setValue(
                    fileListValue.value ? [...fileListValue.value] : undefined,
                  );
                }
              })
              .finally(() => {
                // 判断是否全部结束
                if (
                  progresses.value.every(item => item.status !== 'updating')
                ) {
                  progresses.setValue([]);
                }
                // 删除当前cancel
                cancelsRef.current.delete(req.cancel);
              });
          } else {
            Modal.error({
              title: '未找到上传方法',
            });
          }
        }
      }
      if (onSelect) onSelect(info);
    },
    [onChange, checkRegexp, maxSize, max, onUpload],
  );

  // value 变更
  useEffect(() => {
    if (value) {
      if (!getFile) {
        Modal.error({
          title: '找不到获取文件信息的方法',
        });
      } else {
        const uids = value.split(',');
        // 需要删除的文件
        fileListValue.value?.filter(file => uids.some(uid => file.uid === uid));

        // 需要停止加载的文件
        Object.keys(getFilesRef.current).forEach(key => {
          if (!uids.some(uid => uid === key)) {
            // 删除该key统一交由getFile回调处理
            getFilesRef.current[key]();
          }
        });
        // 找到需要加载信息的文件
        uids
          .filter(
            uid =>
              // 正在加载
              !getFilesRef.current[uid] &&
              // 已存在
              !fileListValue.value?.some(file => file.uid === uid),
          )
          .forEach(uid => {
            if (!loadingValue.value) {
              loadingValue.setValue(true);
            }
            const req = getFile(uid);
            cancelsRef.current.add(req.cancel);
            getFilesRef.current[uid] = req.cancel;
            req
              .then(res => {
                fileListValue.setValue(
                  (fileListValue.value || []).concat([
                    {
                      ...res,
                      uid,
                      status: 'done',
                    },
                  ]),
                );
              })
              .catch(() => {})
              .finally(() => {
                cancelsRef.current.delete(req.cancel);
                if (getFilesRef.current[uid]) delete getFilesRef.current[uid];
                if (mound.current && !Object.keys(getFilesRef.current).length) {
                  loadingValue.setValue(false);
                }
              });
          });
      }
    } else {
      // 需要停止加载的文件,删除全部交给 getFIle与onUpload回调处理
      cancelsRef.current.forEach(cancel => cancel());

      fileListValue.setValue(undefined);
    }
  }, [value]);

  // cancel
  useEffect(() => {
    return () => {
      cancelsRef.current.forEach(cancel => cancel());
    };
  }, []);

  if (loadingValue.value) {
    return <>{loading}</>;
  }
  return (
    <>
      <AntUpload
        beforeUpload={beforeUpload}
        onChange={myChange}
        data-id={rest.id}
        fileList={fileListValue.value}
        listType={listType === 'file-info' ? undefined : listType}
        {...rest}
        showUploadList={FileRender ? false : showUploadList}
      >
        {!max || max > (fileListValue.value?.length || 0) ? children : null}
      </AntUpload>
      {FileRender &&
        fileListValue.value?.map(file => (
          <FileRender
            id={props.id}
            file={file}
            key={file.uid}
            disabled={rest.disabled}
            onDelete={() => {
              // eslint-disable-next-line
              file.status = 'removed';
              myChange({
                file,
                fileList: fileListValue.value || [],
              });
            }}
            onPreview={rest.onPreview}
            onDownLoad={rest.onDownLoad}
            showUploadList={showUploadList}
          />
        ))}
      <MaskModal
        open={progresses.value.length > 0}
        className="tea-progress-mask"
      >
        <UploadProgress progresses={progresses.value} />
      </MaskModal>
    </>
  );
};

Upload.defaultProps = {
  loading: (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Circle style={{ width: 24 }} />
      文件信息加载中...
    </div>
  ),
  showUploadList: {
    showRemoveIcon: true,
    showPreviewIcon: true,
    showDownloadIcon: true,
  },
};

export { UploadProgress, MyFileRender as FileRender };

export default Upload;
