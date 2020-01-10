import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  Dispatch,
  SetStateAction,
} from 'react';
import { Cascader as AntCascader } from 'antd';
import classnames from 'classnames';
import {
  CascaderProps as AntCascaderProps,
  CascaderOptionType,
} from 'antd/lib/cascader';
import './styles/cascader.scss';
import { CancellablePromise } from '../../typings';

export interface CascaderProps
  extends Omit<AntCascaderProps, 'options' | 'value' | 'onChange'> {
  requestMethod?: (
    fatherCode?: string,
  ) => CancellablePromise<CascaderOptionType[]>;
  /** 可选项数据源 */
  options?: CascaderOptionType[];
  value?: string;
  errorCallback?: (error: any, target?: CascaderOptionType[] | string) => void;
  onChange?: (
    value: string | undefined,
    selectedOptions?: CascaderOptionType[],
  ) => void;
  separator?: string;
  /**
   * 根节点
   */
  root?: string;
  /**
   * 加载最大深度
   */
  maxDept?: number;
  /**
   * 严格模式下 value实际深度超过maxDept,不会加载
   */
  strict?: boolean;
}

const depthLoad = (
  i: number,
  value: string[],
  unListions: Set<CancellablePromise<CascaderOptionType[]>>,
  requestMethod: (
    fatherCode?: string,
  ) => CancellablePromise<CascaderOptionType[]>,
  setOptions: Dispatch<SetStateAction<CascaderOptionType[] | undefined>>,
  errorCallback: any,
  options?: CascaderOptionType[],
  maxDept?: number,
  strict?: boolean,
) => {
  if (options && value.length > i) {
    const curValue = value[i - 1];
    const targetOption = options.find(item => item.value === curValue);
    if (targetOption) {
      // 已经加载
      if (targetOption.children) {
        if (
          maxDept === undefined ||
          !strict ||
          maxDept >= targetOption.depth + 2
        ) {
          depthLoad(
            i + 1,
            value,
            unListions,
            requestMethod,
            setOptions,
            errorCallback,
            targetOption.children,
            maxDept,
            strict,
          );
        }
      } else {
        // 还没有加载
        const p = requestMethod(curValue);
        unListions.add(p);
        p.then(resp => {
          targetOption.loading = false;
          if (!maxDept || maxDept > targetOption.depth + 1) {
            targetOption.children = resp.map(item => ({
              ...item,
              depth: targetOption.depth + 1,
            }));
          } else {
            targetOption.children = resp.map(item => ({
              ...item,
              isLeaf: true,
              depth: targetOption.depth + 1,
            }));
          }
          setOptions(prevOptions => {
            if (prevOptions) return [...prevOptions];
          });
        })
          .catch(error => {
            if (errorCallback) {
              errorCallback(error, curValue);
            } else console.error(error);
          })
          .finally(() => {
            unListions.delete(p);
          });
      }
    }
  }
};

const Cascader: React.FC<CascaderProps> = props => {
  const {
    onChange,
    options: defaultOptions,
    requestMethod,
    errorCallback,
    value: source,
    className,
    separator = '-',
    root,
    maxDept,
    strict,
    ...otherProps
  } = props;
  const unListions = useMemo<Set<CancellablePromise<CascaderOptionType[]>>>(
    () => new Set(),
    [],
  );
  const [options, setOptions] = useState(defaultOptions);
  const [isChange, setIsChange] = useState(false);
  const loadData = useCallback(
    (selectedOptions?: CascaderOptionType[]) => {
      if (selectedOptions) {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
        if (requestMethod) {
          const p = requestMethod(targetOption.value);
          unListions.add(p);
          p.then(resp => {
            targetOption.loading = false;
            if (!maxDept || maxDept > targetOption.depth + 1) {
              targetOption.children = resp.map(item => ({
                ...item,
                depth: targetOption.depth + 1,
              }));
            } else {
              targetOption.children = resp.map(item => ({
                ...item,
                isLeaf: true,
                depth: targetOption.depth + 1,
              }));
            }

            setOptions(prevOptions => {
              if (prevOptions) return [...prevOptions];
            });
          })
            .catch(error => {
              if (errorCallback) {
                errorCallback(error, selectedOptions);
              } else console.error(error);
            })
            .finally(() => {
              unListions.delete(p);
            });
        }
      }
    },
    [requestMethod],
  );

  const value = useMemo<string[] | undefined>(() => {
    const values = props.value
      ? props.value
          .split(separator)
          .reduce<string[]>((prevValues, curValue) => {
            if (prevValues.length > 0) {
              prevValues.push(
                `${prevValues[prevValues.length - 1]}${separator}${curValue}`,
              );
            } else {
              prevValues.push(curValue);
            }
            return prevValues;
          }, [])
      : undefined;
    // 有根节点时剔出前面的value
    values?.splice(0, root?.split(separator).length);
    return values;
  }, [props.value, root]);
  useEffect(() => {
    if (requestMethod) {
      const p = requestMethod(root);
      unListions.add(p);
      p.then(resp => {
        if (maxDept === 0) {
          setOptions(
            resp.map(item => ({
              ...item,
              isLeaf: true,
              depth: 0,
            })),
          );
        } else {
          setOptions(
            resp.map(item => ({
              ...item,
              depth: 0,
            })),
          );
        }
      })
        .catch(error => {
          if (errorCallback) {
            errorCallback(error);
          } else console.error(error);
        })
        .finally(() => {
          unListions.delete(p);
        });
    }
    return () => {
      Array.from(unListions).forEach(cp => {
        cp.cancel();
      });
    };
  }, [requestMethod, root]);

  useEffect(() => {
    if (!isChange && requestMethod) {
      if (
        options &&
        Array.isArray(value) &&
        value.length > 1 &&
        (!strict || maxDept !== 0)
      ) {
        depthLoad(
          1,
          value,
          unListions,
          requestMethod,
          setOptions,
          errorCallback,
          options,
          maxDept,
          strict,
        );
      }
    }
  }, [options, value]);

  const handle = useCallback(
    (v: string[], selectedOptions?: CascaderOptionType[]) => {
      setIsChange(true);
      if (onChange) {
        if (v.length > 0) {
          onChange(v[v.length - 1], selectedOptions);
        } else {
          onChange(undefined, selectedOptions);
        }
      }
    },
    [onChange],
  );

  return (
    <AntCascader
      className={classnames('tea-cascader', className)}
      value={value ?? undefined}
      onChange={handle}
      options={options}
      loadData={loadData}
      {...otherProps}
    />
  );
};

Cascader.defaultProps = {
  separator: '-',
};

export default Cascader;
