import React, { memo, useCallback } from 'react';
import { mapValues } from 'lodash-es';
import { observer } from 'mobx-react';
import { reaction } from 'mobx';
import { FormStore, ComponentStore } from './store';
import {
  FormConfig,
  ComponentStoresType,
  FormStoreInstance,
  ComponentStoreInstance,
  Rules,
  ComponentType,
  AutoValid,
  AutoHandle,
} from './typings';

export function getListenValues<T>(
  keys: (keyof T)[],
  formStore: FormStoreInstance<T>,
) {
  return () =>
    keys
      .filter(key => formStore.componentStores[key])
      .map(key => formStore.componentStores[key].value);
}

export function getValues<T>(formStore: FormStoreInstance<T>) {
  return mapValues(
    formStore.componentStores,
    componentStore => componentStore.value,
  ) as T;
}

export function crossValidFunc<T>(
  autoValid: AutoValid<T>,
  formStore: FormStoreInstance<T>,
  autoValidIdMap: {
    [P in keyof T]: string;
  },
) {
  return () => {
    const err = autoValid.effect(getValues(formStore), formStore);
    const componentStore = formStore.componentStores[autoValid.primaryKey];
    if (componentStore) {
      if (err) {
        componentStore.setCrossErr({
          [autoValidIdMap[componentStore.key]]: {
            message: err,
          },
        });
      } else {
        componentStore.delCrossErr([autoValidIdMap[componentStore.key]]);
      }
    }
  };
}

export function runHandle<T>(
  autoHandle: AutoHandle<T>,
  formStore: FormStoreInstance<T>,
) {
  return reaction(getListenValues(autoHandle.listenKey, formStore), () => {
    autoHandle.effect(getValues(formStore), formStore);
  });
}

export function runCrossValid<T>(
  autoValid: AutoValid<T>,
  formStore: FormStoreInstance<T>,
  autoValidIdMap: {
    [P in keyof T]: string;
  },
) {
  const listenKey = new Set(autoValid.listenKey);
  listenKey.add(autoValid.primaryKey);
  return reaction(getListenValues(Array.from(listenKey), formStore), () => {
    const err = autoValid.effect(getValues(formStore), formStore);
    const componentStore = formStore.componentStores[autoValid.primaryKey];
    if (componentStore) {
      if (err) {
        componentStore.setCrossErr({
          [autoValidIdMap[componentStore.key]]: {
            message: err,
          },
        });
      } else {
        componentStore.delCrossErr([autoValidIdMap[componentStore.key]]);
      }
    }
  });
}

export function configToComponent<T, U extends T[keyof T]>(
  id: string,
  formConfig: FormConfig<U, T>,
  compoentStore: ComponentStoreInstance<U, T>,
) {
  return memo(
    observer(props => {
      const onChange = useCallback(
        (e: any) => {
          if (props.onChange) props.onChange(e);
          compoentStore.onChange(e);
        },
        [props.onChange],
      );
      return (
        <formConfig.component
          disabled={compoentStore.formStore.disabled}
          id={id}
          {...props}
          onChange={onChange}
          value={compoentStore.value}
          errors={compoentStore.errors}
        />
      );
    }),
  );
}

export function configToComponentStore<T, P extends keyof T>(props: {
  key: P;
  formStore: FormStoreInstance<T>;
  component: ComponentType<T[P]>;
  defaultValue?: T[P];
  rules?: Rules;
}) {
  const { key, formStore, defaultValue, rules, component } = props;
  return new ComponentStore({
    key,
    formStore,
    defaultValue,
    rules,
    component,
  });
}

export function parseFormConfigs<T = {}>(
  formConfigs: { [P in keyof T]: FormConfig<T[P], T> },
): { formStore: FormStore<T>; components: { [P in keyof T]: any } } {
  function getInstances(formStore: FormStoreInstance<T>) {
    const componentStores: Partial<ComponentStoresType<T>> = {};
    for (const key in formConfigs) {
      if (Object.prototype.hasOwnProperty.call(formConfigs, key)) {
        componentStores[key] = configToComponentStore({
          key,
          formStore,
          defaultValue: formConfigs[key].defaultValue,
          rules: formConfigs[key].rules,
          component: formConfigs[key].component,
        });
      }
    }
    return componentStores as ComponentStoresType<T>;
  }

  const formStore = new FormStore<T>({
    getInstances,
  });

  const components = mapValues(formConfigs, (formConfig, key) => {
    return configToComponent(
      key,
      formConfig,
      formStore.componentStores[key as keyof T],
    );
  });

  return {
    formStore,
    components,
  };
}
