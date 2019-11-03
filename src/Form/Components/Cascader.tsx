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

export type CancellablePromise<T> = Promise<T> & {
  cancel(): void;
};

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
) => {
  if (options && value.length > i) {
    const curValue = value[i - 1];
    const targetOption = options.find(item => item.value === curValue);
    if (targetOption) {
      // 已经加载
      if (targetOption.children) {
        depthLoad(
          i + 1,
          value,
          unListions,
          requestMethod,
          setOptions,
          errorCallback,
          targetOption.children,
        );
      } else {
        // 还没有加载
        const p = requestMethod(curValue);
        unListions.add(p);
        p.then(resp => {
          targetOption.loading = false;
          targetOption.children = resp;
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
            targetOption.children = resp;
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

  const value = useMemo<string[] | undefined>(
    () =>
      (props.value
        ? props.value.split('-').reduce<string[]>((prevValues, curValue) => {
            if (prevValues.length > 0) {
              prevValues.push(
                `${prevValues[prevValues.length - 1]}-${curValue}`,
              );
            } else {
              prevValues.push(curValue);
            }
            return prevValues;
          }, [])
        : undefined),
    [props.value],
  );
  useEffect(() => {
    if (requestMethod) {
      const p = requestMethod();
      unListions.add(p);
      p.then(resp => setOptions(resp))
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
  }, [requestMethod]);

  useEffect(() => {
    if (!isChange && requestMethod) {
      if (options && Array.isArray(value) && value.length > 1) {
        depthLoad(
          1,
          value,
          unListions,
          requestMethod,
          setOptions,
          errorCallback,
          options,
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
      value={value}
      onChange={handle}
      options={options}
      loadData={loadData}
      {...otherProps}
    />
  );
};

export default Cascader;
