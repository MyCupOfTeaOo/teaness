import { useMemo, useState, useEffect } from 'react';
import mapValues from 'lodash/mapValues';
import { IReactionDisposer } from 'mobx';
import { FormConfigs, HookOptions } from './typings';
import {
  parseFormConfigs,
  configToComponent,
  configToComponentStore,
  runCrossValid,
  crossValidFunc,
  runHandle,
} from './utils';
import { ComponentStore, FormStore } from './store';

export function useForm<
  T,
  C extends { [P in keyof T]: any } = { [P in keyof T]: any }
>(
  /**
   * 表单配置
   */
  formConfigs: FormConfigs<T>,
  /**
   * 可选配置,目前支持交联验证,交联handle
   */
  options?: HookOptions<T>,
) {
  const { formStore, components: initComponents } = useMemo(
    () => parseFormConfigs(formConfigs),
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
  const [components, setComponents] = useState(initComponents);
  useEffect(() => {
    for (const key in formStore.componentStores) {
      if (
        Object.prototype.hasOwnProperty.call(formStore.componentStores, key)
      ) {
        if (!formConfigs[key]) {
          formStore.removeComponentStore(
            formStore.componentStores[key as keyof T],
          );
        } else {
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
            component: formConfigs[key].component,
          }) as any) as ComponentStore<T[keyof T], T>;
          formStore.addComponentStore(componentStore);
        }
      }
    }
    setComponents(prevComponents => {
      return mapValues(formConfigs, (formConfig, key) => {
        if (prevComponents[key as keyof T]) {
          const targetStore = formStore.componentStores[key as keyof T];
          if (
            targetStore.props !== formConfig.props ||
            targetStore.component !== formConfig.component
          ) {
            targetStore.setComponent(formConfig.component);
            targetStore.setProps(formConfig.props);
            return configToComponent(
              formConfig,
              formStore.componentStores[key as keyof T],
            );
          } else {
            return prevComponents[key as keyof T];
          }
        }
        return configToComponent(
          formConfig,
          formStore.componentStores[key as keyof T],
        );
      });
    });
  }, [formConfigs]);
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
  }, [formConfigs]);
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
  return ({
    formStore,
    components,
  } as any) as {
    formStore: FormStore<T>;
    components: C;
  };
}
