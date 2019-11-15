import React, {
  useState,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import { Upload as AntUpload, Button, message } from 'antd';
import lodash from 'lodash-es';
import { Circle } from '../../../Spin';
import { UploadContext } from './context';
import {
  UploadProps,
  UploadFile,
  UploadChangeParam,
  UploadRefType,
} from './typings';
import Registry from './Registry';
import { bind } from './decorator';

const Upload: React.FC<UploadProps> & { create: typeof bind } = props => {
  const {
    value,
    onChange,
    onSelect,
    getInfoErrorback,
    getFileInfo: g,
    children,
    loading,
    maxSize,
    max,
    ...rest
  } = props;
  const context = useContext(UploadContext);
  const memo = useMemo(
    () => ({
      unmount: false,
      uniqueId: lodash.uniqueId('upload'),
    }),
    [],
  );
  const [loadings, setLoadings] = useState<{ [key: string]: boolean }>({});
  const isLoading = useMemo(() => Object.keys(loadings).length > 0, [loadings]);
  const getFileInfo = useMemo(() => g || Registry.getFileInfo, [g]);
  const [fileList, setFileList] = useState<UploadFile[]>();
  const handle = useCallback(
    (info: UploadChangeParam) => {
      const target = info.fileList.find(item => item.uid === info.file.uid);
      setFileList(prevFileList => {
        // 已上传删除的可能会这样
        if (!target) {
          if (onChange && value && info.file.status === 'removed') {
            const fl = value.split(',');
            const r = fl.filter(item => item !== info.file.uid).join(',');
            onChange(lodash.isEmpty(r) ? undefined : r);
          }
          if (prevFileList) return prevFileList.filter(item => item.uid !== info.file.uid);
          else return undefined;
        }

        // 删除
        if (target.status === 'removed') {
          if (onChange && value) {
            const fl = value.split(',');
            const r = fl.filter(item => item !== info.file.uid).join(',');
            onChange(lodash.isEmpty(r) ? undefined : r);
          }
          if (prevFileList) return prevFileList.filter(item => item.uid !== target.uid);
          else return undefined;
        }

        if (maxSize) {
          if (target.size / 1024 > maxSize) {
            message.error(`文件最大只能上传${maxSize}KB`);
            return prevFileList;
          }
        }
        // 增加
        if (prevFileList) {
          if (max && prevFileList.length === max) {
            // 多文件时可能会超过max

            // 需要判断这一个是不是value的
            const first = prevFileList[0];
            if (value && onChange) {
              const fl = value.split(',');
              const r = fl.filter(item => item !== first.uid).join(',');
              onChange(lodash.isEmpty(r) ? undefined : r);
            }

            return prevFileList.slice(1).concat([target]);
          }
          return prevFileList.concat([target]);
        } else {
          return [target];
        }
      });
      if (onSelect) onSelect(info);
    },
    [onChange, value],
  );

  useEffect(() => {
    let unmount = false;
    const oldFileList: UploadFile[] = [];
    if (value && getFileInfo) {
      const uids = value.split(',');
      const all = uids.map(uid => {
        if (fileList) {
          const target = fileList.find(file => file.uid === uid);
          if (target) {
            oldFileList.push(target);
            const t = Promise.resolve({
              size: target.size,
              name: target.name,
              type: target.type,
              url: target.url,
            }) as Promise<{
              size: number;
              name: string;
              type: string;
              url: string;
            }> & {
              cancel: () => void;
            };
            t.cancel = () => {};
            return t;
          }
        }
        setLoadings(prev => ({
          ...prev,
          [uid]: true,
        }));
        return getFileInfo(uid);
      });
      // 清空
      setFileList(oldFileList);
      all.forEach((resp, index) => {
        const uid = uids[index];
        resp
          .then(item => {
            if (unmount) return;
            setFileList(prevFileList => {
              if (Array.isArray(prevFileList)) {
                return prevFileList.concat([
                  {
                    uid,
                    size: item.size,
                    name: item.name,
                    url: item.url,
                    type: item.type,
                    status: 'done',
                  },
                ]);
              } else {
                return [
                  {
                    uid,
                    size: item.size,
                    name: item.name,
                    url: item.url,
                    type: item.type,
                    status: 'done',
                  },
                ];
              }
            });
          })
          .catch(err => {
            if (unmount) return;
            setFileList(prevFileList => {
              if (Array.isArray(prevFileList)) {
                return prevFileList.concat([
                  {
                    uid,
                    name: '文件信息加载失败',
                    size: 0,
                    status: 'error',
                    type: 'null',
                  },
                ]);
              } else {
                return [
                  {
                    uid,
                    name: '文件信息加载失败',
                    size: 0,
                    status: 'error',
                    type: 'null',
                  },
                ];
              }
            });
            if (getInfoErrorback) getInfoErrorback(uid, err);
            else console.error('文件信息加载失败', err);
          })
          .finally(() => {
            if (!memo.unmount) setLoadings(prev => lodash.omit(prev, uid));
          });
      });
      return () => {
        unmount = true;
        all.forEach(item => item.cancel());
      };
    }
  }, [value]);
  useEffect(() => {
    return () => {
      memo.unmount = true;
    };
  }, []);
  useEffect(() => {
    const temp: UploadRefType = {
      uniqueId: memo.uniqueId,
      fileList,
      setFileList,
      add: (values: string[]) => {
        if (props.onChange && values.length > 0) {
          if (value) {
            props.onChange(`${value},${values.join(',')}`);
          } else {
            props.onChange(values.join(','));
          }
        }
      },
    };
    if (context.register) {
      context.register(temp);
      return () => {
        if (context.unregister) {
          context.unregister(temp);
        }
      };
    }
  }, [context, fileList, setFileList, value]);
  const beforeUpload = useCallback(() => false, []);
  const child = useMemo(() => {
    if (isLoading) return loading;
    if (!max) {
      return (
        children || (
          <Button icon="upload" disabled={props.disabled}>
            上传
          </Button>
        )
      );
    }
    if (!fileList) {
      return (
        children || (
          <Button icon="upload" disabled={props.disabled}>
            上传
          </Button>
        )
      );
    }
    if (fileList.length < max) {
      return (
        children || (
          <Button icon="upload" disabled={props.disabled}>
            上传
          </Button>
        )
      );
    }
    return undefined;
  }, [children, fileList, isLoading, loading, props.disabled]);
  return (
    <AntUpload
      onPreview={Registry.onPreview}
      onDownload={Registry.onDownLoad}
      beforeUpload={beforeUpload}
      fileList={fileList}
      onChange={handle}
      {...rest}
    >
      {child}
    </AntUpload>
  );
};

Upload.defaultProps = {
  loading: (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Circle style={{ width: 24 }} />
      文件信息加载中...
    </div>
  ),
};

Upload.create = bind;

export { UploadContext, Registry };
export default Upload;
