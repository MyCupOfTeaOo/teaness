import { action, observable, flow, computed } from 'mobx';
import Scheme, { ErrorList, FieldErrorList } from 'async-validator';
import { omit, isEmpty } from 'lodash-es';
import { SyntheticEvent } from 'react';
import {
  FormStoreInstance,
  ComponentStoreInstance,
  ComponentStoreProps,
  SubmitType,
  ErrorsType,
  FormStoreProps,
  ComponentStoresType,
  ErrorType,
  Rules,
  ErrorMessage,
  Parse,
  Format,
  CheckResult,
} from './typings';

export class ComponentStore<U = any, T = {}>
  implements ComponentStoreInstance<U, T> {
  key: keyof T;

  formStore: FormStoreInstance<T>;

  defaultValue: U | undefined = undefined;

  @observable
  isChange = false;

  @observable
  prevValue: U | undefined = undefined;

  @observable
  value: U | undefined = undefined;

  @observable
  err: ErrorType;

  @observable
  validing = false;

  @observable
  crossErr: {
    [key: string]: ErrorMessage;
  } = {};

  @computed get errors(): ErrorType {
    const errors = (this.err || []).concat(Object.values(this.crossErr));
    if (isEmpty(errors)) return undefined;
    return errors;
  }

  @computed get formatValue(): U | undefined {
    if (this.format) {
      return this.format(this.value);
    }
    return this.value;
  }

  @computed get checkResult(): CheckResult {
    if (this.validing) return 'loading';
    if (this.errors) return 'error';
    if (this.isChange) return 'success';
    return 'default';
  }

  @observable
  rules?: Rules;

  scheme?: Scheme;

  parse?: Parse<U>;

  format?: Format<U>;

  constructor(props: ComponentStoreProps<U, T>) {
    const { key, formStore, defaultValue, rules, parse, format } = props;
    this.key = key;
    this.formStore = formStore;
    this.defaultValue = defaultValue;
    this.value = defaultValue;
    this.rules = rules;
    this.parse = parse;
    this.format = format;
    if (rules) this.scheme = new Scheme({ [key]: rules });
  }

  @action
  setValiding = (validing: boolean) => {
    this.validing = validing;
  };

  @action
  setCrossErr = (props: { [key: string]: ErrorMessage }) => {
    if (this.isChange) {
      this.crossErr = {
        ...this.crossErr,
        ...props,
      };
    }
  };

  @action
  delCrossErr = (keys: string[]) => {
    this.crossErr = omit(this.crossErr, ...keys);
  };

  @action
  onChange = (value: U | Event | SyntheticEvent | undefined) => {
    let realValue: U | undefined;
    if (this.parse) {
      realValue = this.parse(value);
    } else if (!isEmpty(value)) {
      if (value instanceof Event) {
        realValue = (value.target as { value?: U }).value;
      } else if ((value as SyntheticEvent).nativeEvent instanceof Event) {
        realValue = ((value as SyntheticEvent).target as { value?: U }).value;
      } else {
        realValue = value as U;
      }
    } else {
      realValue = value as U | undefined;
    }

    if (!this.isChange) {
      this.isChange = true;
      this.formStore.setChangeState(true);
    }
    this.prevValue = this.value;
    this.value = realValue;
    this.valid();
  };

  @action
  setDefaultValue = (value: U | undefined) => {
    if (!this.isChange) this.value = value;
    this.defaultValue = value;
  };

  setRules = (rules: Rules | undefined) => {
    this.rules = rules;
    if (rules) this.scheme = new Scheme({ [this.key]: rules });
    else this.scheme = undefined;
    if (this.isChange) {
      this.valid();
    }
  };

  setParse = (parse?: Parse<U>) => {
    this.parse = parse;
  };

  setFormat = (format?: Format<U>) => {
    this.format = format;
  };

  valid = flow<Promise<ErrorType>, any[]>(function*(
    this: ComponentStore<U, T>,
  ): any {
    if (!this.isChange) {
      this.isChange = true;
      this.formStore.setChangeState(true);
    }
    let err;
    if (this.scheme) {
      this.setValiding(true);
      const e:
        | {
            errors: ErrorList;
            fields: FieldErrorList;
          }
        | undefined = yield this.scheme
        .validate({ [this.key]: this.value })
        .catch(errs => errs);
      if (!this.isChange) {
        // fix reset bug(show err) when async validing
        return err;
      }
      if (e) {
        err = (e as {
          errors: ErrorList;
          fields: FieldErrorList;
        }).errors.map(item => ({ message: item.message, field: item.field }));
        this.err = err;
      } else {
        this.err = e;
      }
    }
    this.setValiding(false);
    return err;
  });

  @action
  reset = () => {
    this.isChange = false;
    this.prevValue = undefined;
    this.value = this.defaultValue;
    this.err = undefined;
    this.crossErr = {};
  };
}

export type submitReduceType<T> = [T, ErrorsType<T>];

export class FormStore<T> implements FormStoreInstance<T> {
  @observable
  componentStores: ComponentStoresType<T>;

  @observable
  disabled = false;

  @action
  setDisabled = (disabled: boolean) => {
    this.disabled = disabled;
  };

  @observable
  isChange = false;

  constructor(props: FormStoreProps<T>) {
    this.componentStores = props.getInstances(this);
  }

  crossValidFuncsDict: {
    [P in keyof T]?: (() => void)[];
  } = {};

  @action
  setChangeState = (isChange: boolean) => {
    this.isChange = isChange;
  };

  submit: SubmitType<T> = callback => {
    const values: Partial<T> = {};
    for (const key in this.componentStores) {
      if (Object.prototype.hasOwnProperty.call(this.componentStores, key)) {
        this.componentStores[key].valid();
        values[key] = this.componentStores[key].value;
      }
    }
    this.valid().then(errs => {
      callback({ values, errs });
    });
  };

  reset = () => {
    for (const key in this.componentStores) {
      if (Object.prototype.hasOwnProperty.call(this.componentStores, key)) {
        this.componentStores[key].reset();
      }
    }
    this.setChangeState(false);
  };

  @action
  addComponentStore = <U extends ComponentStoreInstance<T[keyof T], T>>(
    component: U,
  ) => {
    if (this.componentStores[component.key]) return false;
    else {
      this.componentStores[component.key] = component;
      return true;
    }
  };

  @action
  removeComponentStore = <U extends ComponentStoreInstance<T[keyof T], T>>(
    component: U,
  ) => {
    if (this.componentStores[component.key]) {
      delete this.componentStores[component.key];
      return true;
    } else {
      return false;
    }
  };

  getValue = <U extends T[keyof T]>(key: keyof T) => {
    if (this.componentStores[key]) return this.componentStores[key].value as U | undefined;
  };

  getValues = <U extends T = T>(keys?: (keyof T)[]) => {
    const values: Partial<T> = {};

    if (!Array.isArray(keys)) {
      for (const key in this.componentStores) {
        if (this.componentStores[key]) values[key] = this.componentStores[key].value;
      }
    } else {
      for (const key of keys) {
        if (this.componentStores[key]) values[key] = this.componentStores[key].value;
      }
    }
    return values as Partial<U>;
  };

  setValue = (key: keyof T, value?: T[keyof T]) => {
    if (this.componentStores[key]) this.componentStores[key].onChange(value);
  };

  setValues = (props: Partial<T>) => {
    for (const key in props) {
      if (Object.prototype.hasOwnProperty.call(props, key)) {
        if (this.componentStores[key]) this.componentStores[key].onChange(props[key]);
      }
    }
  };

  setAllValues = (props: Partial<T>) => {
    for (const key in this.componentStores) {
      if (Object.prototype.hasOwnProperty.call(this.componentStores, key)) {
        if (props[key]) this.componentStores[key].onChange(props[key]);
        else this.componentStores[key].onChange(undefined);
      }
    }
  };

  valid = async () => {
    const errs: Partial<ErrorsType<T>> = {};
    const promiseErrors = (Object.keys(
      this.componentStores,
    ) as (keyof T)[]).map(async key => {
      return [key, await this.componentStores[key].valid()];
    }) as Promise<[keyof T, ErrorType]>[];
    await Promise.all(promiseErrors);

    for (const key in this.componentStores) {
      if (Object.prototype.hasOwnProperty.call(this.componentStores, key)) {
        const componentStore = this.componentStores[key];
        const crossValidFuncs = this.crossValidFuncsDict[key];
        if (Array.isArray(crossValidFuncs)) {
          for (const crossValidFunc of crossValidFuncs) {
            crossValidFunc();
          }
        }
        const { errors } = componentStore;
        if (errors) errs[componentStore.key] = errors;
      }
    }
    if (isEmpty(errs)) return undefined;
    return errs;
  };

  validValue = async (key: keyof T) => {
    if (!this.componentStores[key]) return undefined;
    await this.componentStores[key].valid();
    const crossValidFuncs = this.crossValidFuncsDict[key];
    if (Array.isArray(crossValidFuncs)) {
      for (const crossValidFunc of crossValidFuncs) {
        crossValidFunc();
      }
    }
    return this.componentStores[key].errors;
  };

  validValues = async <U extends ErrorsType<T> = ErrorsType<T>>(
    keys: (keyof T)[],
  ) => {
    const errs: Partial<ErrorsType<T>> = {};
    const promiseErrors = keys
      .filter(key => this.componentStores[key])
      .map(async key => {
        return [key, await this.componentStores[key].valid()];
      }) as Promise<[keyof T, ErrorType]>[];
    await Promise.all(promiseErrors);
    for (const key of keys) {
      const crossValidFuncs = this.crossValidFuncsDict[key];
      if (Array.isArray(crossValidFuncs)) {
        for (const crossValidFunc of crossValidFuncs) {
          crossValidFunc();
        }
      }
      errs[key] = this.componentStores[key].errors;
    }

    return errs as Partial<U>;
  };
}
