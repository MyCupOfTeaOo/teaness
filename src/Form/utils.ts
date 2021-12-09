import { mapValues } from 'lodash-es';
import { reaction } from 'mobx';
import { FormStore, ComponentStore } from './store';
import {
  FormConfig,
  ComponentStoresType,
  FormStoreInstance,
  AutoValid,
  AutoHandle,
  ComponentStoreProps,
  GlobalOptions,
} from './typings';

export function getListenValues<T>(
  keys: (keyof T)[],
  formStore: FormStoreInstance<T>,
) {
  return () =>
    keys
      .filter(key => formStore.componentStores[key])
      .map(key => formStore.componentStores[key].source);
}

export function getValues<T>(formStore: FormStoreInstance<T>) {
  return mapValues(
    formStore.componentStores,
    componentStore => componentStore.source,
  ) as T;
}

export function crossValidFunc<T>(
  autoValid: AutoValid<T>,
  formStore: FormStoreInstance<T>,
  autoValidId: string,
) {
  return () => {
    const err = autoValid.effect(getValues(formStore), formStore);
    const componentStore = formStore.componentStores[autoValid.primaryKey];
    if (componentStore) {
      if (err) {
        componentStore.setCrossErr({
          [autoValidId]: {
            message: err,
            field: componentStore.key as string,
          },
        });
      } else {
        componentStore.delCrossErr([autoValidId]);
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
  autoValidId: string,
) {
  // 去重
  const listenKey = new Set(autoValid.listenKey);
  listenKey.add(autoValid.primaryKey);
  return reaction(getListenValues(Array.from(listenKey), formStore), () => {
    const err = autoValid.effect(getValues(formStore), formStore);
    const componentStore = formStore.componentStores[autoValid.primaryKey];
    if (componentStore) {
      if (err) {
        componentStore.setCrossErr({
          [autoValidId]: {
            message: err,
            field: componentStore.key as string,
          },
        });
      } else {
        componentStore.delCrossErr([autoValidId]);
      }
    }
  });
}

export function configToComponentStore<U, T>(props: ComponentStoreProps<U, T>) {
  return new ComponentStore(props);
}

export function parseFormConfigs<T = {}>(
  formConfigs: { [P in keyof T]: FormConfig<T[P]> },
  options?: GlobalOptions<T>,
): { formStore: FormStore<T> } {
  function getInstances(formStore: FormStoreInstance<T>) {
    const componentStores: Partial<ComponentStoresType<T>> = {};
    for (const key in formConfigs) {
      if (Reflect.has(formConfigs, key)) {
        componentStores[key] = configToComponentStore({
          key,
          formStore,
          errorOutputTrigger: options?.errorOutputTrigger,
          ...formConfigs[key],
        });
      }
    }
    return componentStores as ComponentStoresType<T>;
  }

  const formStore = new FormStore<T>({
    getInstances,
  });

  return {
    formStore,
  };
}

export function parseAddFormConfigs<T = {}>(
  formStore: FormStore<T>,
  formConfigs: { [P in keyof T]: FormConfig<T[P]> },
  options?: GlobalOptions<T>,
) {
  const componentStores: Partial<ComponentStoresType<T>> = {};
  for (const key in formConfigs) {
    if (Reflect.has(formConfigs, key)) {
      componentStores[key] = configToComponentStore({
        key,
        formStore,
        errorOutputTrigger: options?.errorOutputTrigger,
        ...formConfigs[key],
      });
      formStore.addComponentStore(componentStores[key] as any);
    }
  }

  return {
    componentStores,
  };
}

export function genFormId(id: string | string[], replaceId?: string) {
  if (replaceId) {
    return replaceId;
  }
  if (Array.isArray(id)) {
    return id[0];
  }
  return id;
}

export function searchRequired(
  id: string | string[],
  store?: FormStore<any>,
): boolean {
  if (Array.isArray(id)) {
    return id.some(i => {
      const rules = store?.componentStores[i]?.rules;
      if (Array.isArray(rules)) return rules.some(item => item.required);
      return false;
    });
  }
  const rules = store?.componentStores[id]?.rules;
  if (Array.isArray(rules)) return rules.some(item => item.required);
  return rules?.required || false;
}
