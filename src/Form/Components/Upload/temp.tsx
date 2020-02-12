import React, {
  useContext,
  useMemo,
  useCallback,
  useEffect,
  SetStateAction,
} from 'react';
import lodash from 'lodash-es';
import { Upload as AntUpload, Button, message } from 'antd';
import { UploadListType } from 'antd/lib/upload/interface';
import {
  UploadProps,
  UploadState,
  UploadFile,
  UploadChangeParam,
  UploadRefType,
} from './typings';
import { UploadContext } from './context';
import Registry from './Registry';

export default class Upload extends React.Component<UploadProps, UploadState> {
  state: Readonly<UploadState> = {
    loadings: 0,
    fileList: undefined,
  };

  static handlePreview(file: UploadFile, listType?: UploadListType): void {
    switch (listType) {
      case 'picture':
      case 'picture-card':
        if (Registry.onPreview) Registry.onPreview(file);
        break;
      default:
        if (Registry.onDownLoad) Registry.onDownLoad(file);
        else if (file.url) window.open(file.url);
    }
  }

  get loading() {
    return this.state.loadings > 0;
  }

  // upload = (
  //   callback: (file: UploadFile & { res?: CancellablePromise<any> }) => void,
  // ) => {
  //   const uploadFunc = this.props.onUpload || Registry.upload;
  //   if (!uploadFunc) {
  //     message.error('未找到上传方法');
  //     const p = Promise.resolve(false);
  //     (p as CancellablePromise<boolean>).cancel = () => {};
  //     return p as CancellablePromise<boolean>;
  //   }
  //   this.state.fileList?.forEach(file => {
  //     if (!file.status && file.percent === 0 && uploadFunc) {
  //       callback({
  //         ...file,
  //         status: 'uploading',
  //         percent: 0,
  //       });
  //       const res = uploadFunc(file, percent => {
  //         callback({
  //           ...file,
  //           status: percent < 100 ? 'uploading' : 'done',
  //           percent,
  //           res,
  //         });
  //       });
  //       res.then(info => {
  //         callback({
  //           ...file,
  //           uid: info.uid,
  //           status: 'success',
  //           percent: 100,
  //           res,
  //         });
  //       });
  //     }
  //   });
  // };

  setFileList = (dispatch: SetStateAction<UploadState['fileList']>) => {
    if (lodash.isFunction(dispatch)) {
      this.setState(({ fileList }) => ({
        fileList: dispatch(fileList),
      }));
    } else {
      this.setState({
        fileList: dispatch,
      });
    }
  };

  setLoadings = (dispatch: SetStateAction<UploadState['loadings']>) => {
    if (lodash.isFunction(dispatch)) {
      this.setState(({ loadings }) => ({
        loadings: dispatch(loadings),
      }));
    } else {
      this.setState({
        loadings: dispatch,
      });
    }
  };

  renderUpload: React.FC<UploadProps> = props => {
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
      onUpload,
      ...rest
    } = props;
    const { fileList, loadings } = this.state;
    const context = useContext(UploadContext);
    const memo = useMemo(
      () => ({
        unmount: false,
        uniqueId: lodash.uniqueId('upload'),
      }),
      [],
    );

    const getFileInfo = useMemo(() => g || Registry.getFileInfo, [g]);
    const handle = useCallback(
      (info: UploadChangeParam) => {
        const target = info.fileList.find(item => item.uid === info.file.uid);
        this.setFileList(prevFileList => {
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
          this.setLoadings(prev => prev + 1);
          return getFileInfo(uid);
        });
        // 清空
        this.setFileList(oldFileList);
        all.forEach((resp, index) => {
          const uid = uids[index];
          resp
            .then(item => {
              if (unmount) return;
              this.setFileList(prevFileList => {
                if (Array.isArray(prevFileList)) {
                  if (prevFileList.every(prevFile => prevFile.uid !== uid)) {
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
                    return prevFileList;
                  }
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
              this.setFileList(prevFileList => {
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
              if (!memo.unmount) this.setLoadings(prev => prev - 1);
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
        setFileList: this.setFileList,
        add: (values: string[]) => {
          if (props.onChange && values.length > 0) {
            if (value) {
              props.onChange(`${value},${values.join(',')}`);
            } else {
              props.onChange(values.join(','));
            }
          }
        },
        onUpload,
      };
      if (context.register) {
        context.register(temp);
        return () => {
          if (context.unregister) {
            context.unregister(temp);
          }
        };
      }
    }, [context, fileList, this.setFileList, value]);
    const beforeUpload = useCallback(() => false, []);
    const child = useMemo(() => {
      if (this.loading) return loading;
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
    }, [children, fileList, loadings, loading, props.disabled]);
    const onPreview = useCallback(
      file => Upload.handlePreview(file, props.listType),
      [props.listType],
    );
    return (
      <AntUpload
        onPreview={onPreview}
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

  render() {
    return <this.renderUpload {...this.props} />;
  }
}
