import React, { useMemo, useEffect, DependencyList } from 'react';
import { IReactionDisposer } from 'mobx';
import { useEffectExcludeFirst } from '../hooks';
import { FormConfigs, GlobalOptions, AutoValid } from './typings';
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
  const autoValidMaps = useMemo<{ key: string; primaryKey: keyof T }[]>(() => {
    if (options && options.autoValid) {
      if (Array.isArray(options.autoValid)) {
        return [...Array(options.autoValid.length)].map((_, i) => ({
          key: `${
            (options.autoValid as AutoValid<T, keyof T>[])[i].primaryKey
          }-${i}`,
          primaryKey: (options.autoValid as AutoValid<T, keyof T>[])[i]
            .primaryKey,
        }));
      } else {
        return [
          {
            key: `${options.autoValid.primaryKey}-0`,
            primaryKey: options.autoValid.primaryKey,
          },
        ];
      }
    }
    return [];
  }, deps);
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
    if (options && options.autoValid) {
      if (Array.isArray(options.autoValid)) {
        let i = 0;
        for (const autoValid of options.autoValid) {
          const listen = runCrossValid(
            autoValid,
            formStore,
            autoValidMaps[i].key,
          );

          unlisten.push(listen);
          i += 1;
        }
      } else {
        const listen = runCrossValid(
          options.autoValid,
          formStore,
          autoValidMaps[0].key,
        );

        unlisten.push(listen);
      }
    }
    // 处理 autoHandle 注册

    if (options && options.autoHandle) {
      if (Array.isArray(options.autoHandle)) {
        for (const autoHandle of options.autoHandle) {
          const listen = runHandle(autoHandle, formStore);
          unlisten.push(listen);
        }
      } else {
        const listen = runHandle(options.autoHandle, formStore);
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
    // 处理 autoValid,创建store内的validFunc方便主动调用
    if (options && options.autoValid) {
      if (Array.isArray(options.autoValid)) {
        let i = 0;
        for (const autoValid of options.autoValid) {
          const target = formStore.crossValidFuncsDict[autoValid.primaryKey];
          if (Array.isArray(target)) {
            target.push(
              crossValidFunc(autoValid, formStore, autoValidMaps[i].key),
            );
          } else {
            formStore.crossValidFuncsDict[autoValid.primaryKey] = [
              crossValidFunc(autoValid, formStore, autoValidMaps[i].key),
            ];
          }
          i += 1;
        }
      } else {
        formStore.crossValidFuncsDict[options.autoValid.primaryKey] = [
          crossValidFunc(options.autoValid, formStore, autoValidMaps[0].key),
        ];
      }
    }
    // 生命周期结束删除crossValid及其验证结果,但是不验证新的valid func
    return () => {
      formStore.crossValidFuncsDict = {};
      autoValidMaps.forEach(autoValidMap => {
        const componentStore =
          formStore.componentStores[autoValidMap.primaryKey];
        if (componentStore) {
          componentStore.delCrossErr([autoValidMap.key]);
        }
      });
    };
  }, deps);
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
    const FormItemHelp = (props: ItemProps<T>) => (
      <Item store={store} {...props} />
    );
    return {
      Form: FormHelp,
      Item: FormItemHelp,
    };
  }, [store]);
}
