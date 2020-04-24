import React, { useCallback, useMemo, useState } from 'react';
import lodash from 'lodash-es';
import { message, Modal } from 'antd';
import { UploadContext } from './context';
import { UploadRefType, UploadFile, UploadGroupProps } from './typings';
import Registry from './Registry';
import './styles.scss';
import { CancellablePromise } from '../../../typings';
import UploadModal from './UploadModal';

const UploadGroup: React.FC<UploadGroupProps> = props => {
  const { onError } = props;
  const registry = useMemo<Set<UploadRefType>>(() => new Set(), []);
  const memo = useMemo<{
    [key: string]: string[];
  }>(() => ({}), []);
  const [loadings, setLoadings] = useState<{
    [key: string]: UploadFile;
  }>({});
  const [visible, setVisible] = useState(false);
  const uploadingPromises = useMemo<Set<CancellablePromise<any>>>(
    () => new Set(),
    [],
  );

  const register = useCallback((ref: UploadRefType) => {
    registry.add(ref);
  }, []);
  const unregister = useCallback((ref: UploadRefType) => {
    registry.delete(ref);
  }, []);

  const upload = useCallback(() => {
    const onUpload = props.onUpload || Registry.onUpload;
    const registryArray = Array.from(registry);
    if (registryArray.length > 0) {
      if (!onUpload) {
        message.error('未找到上传方法');
        const p = Promise.resolve(false);
        (p as CancellablePromise<boolean>).cancel = () => {};
        return p as CancellablePromise<boolean>;
      }
      const depth = Array.from(registry).map(item => {
        if (item.fileList) {
          return item.fileList.map(file => {
            // 找到需要上传的 后面那个判断只是为了类型推导
            if (!file.status && file.percent === 0 && onUpload) {
              setVisible(true);
              setLoadings(prevLoadings => {
                return {
                  ...prevLoadings,
                  [file.uid]: {
                    ...file,
                    status: 'uploading',
                  },
                };
              });
              // 局部 upload 覆盖全局
              const itemUpload = item.onUpload || onUpload;
              const resp = itemUpload(file, percent => {
                setLoadings(prevLoadings => {
                  return {
                    ...prevLoadings,
                    [file.uid]: {
                      ...file,
                      status: percent < 100 ? 'uploading' : 'done',
                      percent,
                    },
                  };
                });
              });
              uploadingPromises.add(resp);

              resp
                .then(info => {
                  if (!memo[item.uniqueId]) {
                    memo[item.uniqueId] = [info.uid];
                  } else {
                    memo[item.uniqueId].push(info.uid);
                  }
                  uploadingPromises.delete(resp);
                })
                .catch(err => {
                  // 上传失败的
                  item.setFileList(prevFileList => {
                    if (prevFileList) {
                      const target = prevFileList.find(f => f.uid === file.uid);
                      if (target) target.status = 'error';
                      return [...prevFileList];
                    }
                    return prevFileList;
                  });
                  if (onError) onError(err);
                  else console.error(err);
                  uploadingPromises.delete(resp);
                  return Promise.reject(err);
                })
                .finally(() => {
                  setLoadings(prevLoadings => {
                    return lodash.omit(prevLoadings, file.uid);
                  });
                });
              return resp;
            }
            return null;
          });
        }
        return [];
      });
      const all = depth.reduce((prev, cur) => {
        if (cur) return prev.concat(cur);
        return prev;
      }, []);
      const p = Promise.all(all)
        .then(() => true)
        .catch(() => false)
        .then(res => {
          setVisible(false);
          if (!res) {
            Modal.error({
              title: '有文件上传失败',
              className: 'tea-upload-error-modal',
              content: (
                <ul className="tea-upload-error-list">
                  {Array.from(registry)
                    .reduce<UploadFile[]>((prev, cur) => {
                      if (cur.fileList) {
                        cur.fileList.forEach(item => {
                          if (item.status === 'error') {
                            prev.push(item);
                          }
                        });
                      }
                      return prev;
                    }, [])
                    .map(item => (
                      <li title={item.name}>{item.name}</li>
                    ))}
                </ul>
              ),
            });
          }
          return res;
        })
        .finally(() => {
          const waitSearch = Array.from(registry);
          Object.keys(memo).forEach(key => {
            const target = waitSearch.find(item => item.uniqueId === key);
            if (target && target.add) {
              target.add(memo[key]);
            }
            lodash.unset(memo, key);
          });
        });
      (p as CancellablePromise<boolean>).cancel = () => {
        all.forEach(item => {
          if (item) item.cancel();
        });
      };
      return p as CancellablePromise<boolean>;
    } else {
      const p = Promise.resolve(true);
      (p as CancellablePromise<boolean>).cancel = () => {};
      return p as CancellablePromise<boolean>;
    }
  }, []);
  const onCancel = useCallback(() => {
    setVisible(false);
    Array.from(uploadingPromises).forEach(item => {
      item.cancel();
    });
  }, []);
  return (
    <UploadContext.Provider value={{ register, unregister, upload }}>
      <UploadModal onCancel={onCancel} loadings={loadings} visible={visible} />
      {props.children}
    </UploadContext.Provider>
  );
};

export default UploadGroup;
