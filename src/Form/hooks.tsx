import React, { useMemo, useEffect, DependencyList } from 'react';
import { IReactionDisposer } from 'mobx';
import { useEffectExcludeFirst } from '../hooks';
import { FormConfigs, GlobalOptions } from './typings';
import {
  parseFormConfigs,
  configToComponentStore,
  runCrossValid,
  crossValidFunc,
  runHandle,
} from './utils';
import { ComponentStore, FormStore } from './store';
import Autowired, { AutowiredProps } from './Context/Autowired';
import Form, { FormProps } from '.';
import Item, { ItemProps } from './Item';

export function useStore<T>(
  /**
   * 表单配置
   */
  formConfigs: FormConfigs<T>,
  deps: DependencyList = [],
  /**
   * 可选配置,目前支持交联验证,交联handle
   */
  options?: GlobalOptions<T>,
): FormStore<T> {
  const { formStore } = useMemo(
    () => parseFormConfigs(formConfigs, options),
    [],
  );
  const memoOptions = useMemo(() => options, []);
  const autoValidIdMap = useMemo(() => {
    let index = 1;
    const temp: { [P in keyof T]?: string } = {};
    if (memoOptions && memoOptions.autoValid) {
      if (Array.isArray(memoOptions.autoValid)) {
        for (const autoValid of memoOptions.autoValid) {
          temp[autoValid.primaryKey] = `form-valid-${index}`;
          index += 1;
        }
      } else {
        temp[memoOptions.autoValid.primaryKey] = `form-valid-${index}`;
      }
    }
    return temp as {
      [P in keyof T]: string;
    };
  }, []);
  useEffectExcludeFirst(() => {
    for (const key in formStore.componentStores) {
      if (Reflect.has(formStore.componentStores, key)) {
        if (!formConfigs[key]) {
          // 依赖更新后处理 删除不需要的 subStore
          formStore.removeComponentStore(
            formStore.componentStores[key as keyof T],
          );
        } else {
          // 依赖更新后处理修改 subStore,幂等
          formStore.componentStores[key].setProps(formConfigs[key]);
        }
      }
    }
    // 依赖更新后处理 新增的 subStore
    for (const key in formConfigs) {
      if (Reflect.has(formConfigs, key)) {
        if (!formStore.componentStores[key]) {
          const componentStore = (configToComponentStore({
            key,
            formStore,
            ...formConfigs[key],
          }) as any) as ComponentStore<T[keyof T], T>;
          formStore.addComponentStore(componentStore);
        }
      }
    }
  }, deps);
  useEffect(() => {
    const unlisten: IReactionDisposer[] = [];
    // 处理 autoValid 注册
    if (memoOptions && memoOptions.autoValid) {
      if (Array.isArray(memoOptions.autoValid)) {
        for (const autoValid of memoOptions.autoValid) {
          const listen = runCrossValid(autoValid, formStore, autoValidIdMap);

          unlisten.push(listen);
        }
      } else {
        const listen = runCrossValid(
          memoOptions.autoValid,
          formStore,
          autoValidIdMap,
        );

        unlisten.push(listen);
      }
    }
    // 处理 autoHandle 注册

    if (memoOptions && memoOptions.autoHandle) {
      if (Array.isArray(memoOptions.autoHandle)) {
        for (const autoHandle of memoOptions.autoHandle) {
          const listen = runHandle(autoHandle, formStore);
          unlisten.push(listen);
        }
      } else {
        const listen = runHandle(memoOptions.autoHandle, formStore);
        unlisten.push(listen);
      }
    }

    return () => {
      for (const listen of unlisten) {
        listen();
      }
    };
  }, deps);
  useEffect(() => {
    // 处理 autoValid,创建store内的validFunc方便主动调用, 目前只支持一次渲染
    if (memoOptions && memoOptions.autoValid) {
      if (Array.isArray(memoOptions.autoValid)) {
        for (const autoValid of memoOptions.autoValid) {
          const target = formStore.crossValidFuncsDict[autoValid.primaryKey];
          if (Array.isArray(target)) {
            target.push(crossValidFunc(autoValid, formStore, autoValidIdMap));
          } else {
            formStore.crossValidFuncsDict[autoValid.primaryKey] = [
              crossValidFunc(autoValid, formStore, autoValidIdMap),
            ];
          }
        }
      } else {
        formStore.crossValidFuncsDict[memoOptions.autoValid.primaryKey] = [
          crossValidFunc(memoOptions.autoValid, formStore, autoValidIdMap),
        ];
      }
    }
  }, []);
  return formStore;
}

/**
 *  只是为了方便类型验证
 * @param store store
 */
export function useAutoWired<T = { [key: string]: any }>(store: FormStore<T>) {
  return useMemo(() => {
    const AutoWiredHelp = Autowired;
    return (props: AutowiredProps<T>) => (
      <AutoWiredHelp store={store} {...props} />
    );
  }, [store]);
}

/**
 * 只是为了方便类型验证
 * @param store store
 */
export function useForm<T = { [key: string]: any }>(store: FormStore<T>) {
  return useMemo(() => {
    const FormHelp = (
      props: Omit<FormProps<T>, 'store'> & { store?: FormStore<T> },
    ) => <Form store={store} {...props} />;
    const FormItemHelp = (props: ItemProps<T>) => <Item {...props} />;
    return {
      Form: FormHelp,
      Item: FormItemHelp,
    };
  }, [store]);
}
