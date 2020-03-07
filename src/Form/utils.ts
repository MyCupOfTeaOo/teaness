import { mapValues } from 'lodash-es';
import { reaction } from 'mobx';
import { FormStore, ComponentStore } from './store';
import {
  FormConfig,
  ComponentStoresType,
  FormStoreInstance,
  Rules,
  AutoValid,
  AutoHandle,
  Parse,
  Format,
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
            field: componentStore.key as string,
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
            field: componentStore.key as string,
          },
        });
      } else {
        componentStore.delCrossErr([autoValidIdMap[componentStore.key]]);
      }
    }
  });
}

export function configToComponentStore<T, P extends keyof T>(props: {
  key: P;
  formStore: FormStoreInstance<T>;
  defaultValue?: T[P];
  rules?: Rules;
  parse?: Parse<T[P]>;
  format?: Format<T[P]>;
}) {
  const { key, formStore, defaultValue, rules, parse, format } = props;
  return new ComponentStore({
    key,
    formStore,
    defaultValue,
    rules,
    parse,
    format,
  });
}

export function parseFormConfigs<T = {}>(
  formConfigs: { [P in keyof T]: FormConfig<T[P]> },
): { formStore: FormStore<T> } {
  function getInstances(formStore: FormStoreInstance<T>) {
    const componentStores: Partial<ComponentStoresType<T>> = {};
    for (const key in formConfigs) {
      if (Object.prototype.hasOwnProperty.call(formConfigs, key)) {
        componentStores[key] = configToComponentStore({
          key,
          formStore,
          defaultValue: formConfigs[key].defaultValue,
          rules: formConfigs[key].rules,
          parse: formConfigs[key].parse,
          format: formConfigs[key].format,
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

export function genFormId(id: string | string[]) {
  if (Array.isArray(id)) {
    return id;
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
