import React, { useMemo, useEffect, DependencyList } from 'react';
import { IReactionDisposer } from 'mobx';
import { observer } from 'mobx-react';
import { useEffectExcludeFirst } from '../hooks';
import { FormConfigs, HookOptions } from './typings';
import {
  parseFormConfigs,
  configToComponentStore,
  runCrossValid,
  crossValidFunc,
  runHandle,
} from './utils';
import { ComponentStore, FormStore } from './store';
import { Autowired, AutowiredProps } from './Context/Autowired';

export function useStore<T>(
  /**
   * 表单配置
   */
  formConfigs: FormConfigs<T>,
  deps: DependencyList = [],
  /**
   * 可选配置,目前支持交联验证,交联handle
   */
  options?: HookOptions<T>,
): FormStore<T> {
  const { formStore } = useMemo(() => parseFormConfigs(formConfigs), []);
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
      if (
        Object.prototype.hasOwnProperty.call(formStore.componentStores, key)
      ) {
        if (!formConfigs[key]) {
          formStore.removeComponentStore(
            formStore.componentStores[key as keyof T],
          );
        } else {
          formStore.componentStores[key as keyof T].setParse(
            formConfigs[key].parse,
          );
          formStore.componentStores[key as keyof T].setFormat(
            formConfigs[key].format,
          );
          formStore.componentStores[key as keyof T].setDefaultValue(
            formConfigs[key].defaultValue,
          );
          formStore.componentStores[key as keyof T].setRules(
            formConfigs[key].rules,
          );
        }
      }
    }
    for (const key in formConfigs) {
      if (Object.prototype.hasOwnProperty.call(formConfigs, key)) {
        if (!formStore.componentStores[key]) {
          const componentStore = (configToComponentStore({
            key,
            formStore,
            defaultValue: formConfigs[key].defaultValue,
            rules: formConfigs[key].rules,
            parse: formConfigs[key].parse,
            format: formConfigs[key].format,
          }) as any) as ComponentStore<T[keyof T], T>;
          formStore.addComponentStore(componentStore);
        }
      }
    }
  }, deps);
  useEffect(() => {
    const unlisten: IReactionDisposer[] = [];
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

export function useAutoWired<T = { [key: string]: any }>(store: FormStore<T>) {
  return useMemo(() => {
    const ListenAutowired = observer(Autowired as React.FC<AutowiredProps<T>>);
    return (props: AutowiredProps<T>) => (
      <ListenAutowired store={store} {...props} />
    );
  }, [store]);
}
