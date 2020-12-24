import { action, observable, flow, computed } from 'mobx';
import Schema, { ErrorList, FieldErrorList } from 'async-validator';
import { omit, isEmpty } from 'lodash-es';
import { SyntheticEvent } from 'react';
import {
  FormStoreInstance,
  ComponentStoreInterface,
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
  InputStatus,
} from './typings';

export class ComponentStore<U = any, T = {}>
  implements ComponentStoreInterface<U, T> {
  key: keyof T;

  formStore: FormStoreInstance<T>;

  defaultValue: U | undefined = undefined;

  @observable
  isChange = false;

  @observable
  prevValue: U | undefined = undefined;

  @observable
  source: U | undefined = undefined;

  @observable
  err: ErrorType;

  @observable
  errorOutputTrigger: InputStatus = 'default';

  @observable
  inputStatus: InputStatus = 'default';

  @observable
  validing = false;

  @observable
  crossErr: {
    [key: string]: ErrorMessage;
  } = {};

  @computed get errors(): ErrorType {
    switch (this.errorOutputTrigger) {
      case 'focus':
      case 'blur': {
        if (this.inputStatus !== this.errorOutputTrigger) return undefined;
        break;
      }
      default:
    }
    const errors = (this.err || []).concat(Object.values(this.crossErr));
    if (isEmpty(errors)) return undefined;
    return errors;
  }

  @computed get value(): U | undefined {
    if (this.format) {
      return this.format(this.source);
    }
    return this.source;
  }

  @computed get checkResult(): CheckResult {
    if (this.validing) return 'loading';
    if (this.errors) return 'error';
    if (this.isChange) return 'success';
    return 'default';
  }

  @observable
  rules?: Rules;

  @observable
  format?: Format<U>;

  schema?: Schema;

  parse?: Parse<U>;

  constructor(props: ComponentStoreProps<U, T>) {
    const { key, formStore, ...rest } = props;
    this.key = key;
    this.formStore = formStore;
    this.setProps(rest);
  }

  setProps = (props: Omit<ComponentStoreProps<U, T>, 'key' | 'formStore'>) => {
    const {
      defaultValue,
      rules,
      parse,
      format,
      errorOutputTrigger = 'default',
    } = props;
    this.setDefaultValue(defaultValue);
    this.setRules(rules);
    this.setParse(parse);
    this.setFormat(format);
    this.setErrorOutputTrigger(errorOutputTrigger);
  };

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
  onChange = (value: U | Event | SyntheticEvent | undefined, ...args: any) => {
    let parseValue: U | undefined;
    if (this.parse) {
      parseValue = this.parse(value, ...args);
    } else if (!isEmpty(value)) {
      if (value instanceof Event) {
        parseValue = (value.target as { value?: U }).value;
      } else if ((value as SyntheticEvent).nativeEvent instanceof Event) {
        parseValue = ((value as SyntheticEvent).target as { value?: U }).value;
      } else {
        parseValue = value as U;
      }
    } else {
      parseValue = value as U | undefined;
    }

    if (!this.isChange) {
      this.isChange = true;
      this.formStore.setChangeState(true);
    }

    this.prevValue = this.source;
    this.source = parseValue;
    // 在值改变后在调用 方便实现自动保存等功能
    this.formStore.onChange?.(this.key, parseValue, value, args, this);

    this.valid();
  };

  @action
  setDefaultValue = (value: U | undefined) => {
    if (!this.isChange) this.source = value;
    this.defaultValue = value;
  };

  @action
  reset = () => {
    this.isChange = false;
    this.prevValue = undefined;
    this.source = this.defaultValue;
    this.err = undefined;
    this.crossErr = {};
  };

  @action
  setInputStatus = (inputStatus: InputStatus) => {
    this.inputStatus = inputStatus;
  };

  @action
  setErrorOutputTrigger = (errorOutputTrigger: InputStatus) => {
    this.errorOutputTrigger = errorOutputTrigger;
  };

  valid = flow<Promise<ErrorType>, any[]>(function*(
    this: ComponentStore<U, T>,
  ): any {
    if (!this.isChange) {
      this.isChange = true;
      this.formStore.setChangeState(true);
    }
    let err;
    if (this.schema) {
      this.setValiding(true);
      const e:
        | undefined
        | {
            errors: ErrorList;
            fields: FieldErrorList;
          } = yield this.schema
        .validate({ [this.key]: this.source })
        .catch(errs => errs);
      if (!this.isChange) {
        // fix reset bug(show err) when async validing
        return err;
      }
      if (e) {
        err = e.errors.map(item => ({
          message: item.message,
          field: item.field,
        }));
        this.err = err;
      } else {
        this.err = undefined;
      }
    }
    this.setValiding(false);
    return err;
  });

  setRules = (rules: Rules | undefined) => {
    this.rules = rules;
    if (rules) this.schema = new Schema({ [this.key]: rules });
    else this.schema = undefined;
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

  onChange?(
    key: keyof T,
    value: any,
    original: any,
    originalOtherArgs: any,
    subStore: ComponentStoreInterface<any, T>,
  ): void;

  validFirst = false;

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
      if (Reflect.has(this.componentStores, key)) {
        // this.componentStores[key].valid();
        values[key] = this.componentStores[key].source;
      }
    }
    this.valid().then(errs => {
      callback({ values, errs });
    });
  };

  reset = () => {
    for (const key in this.componentStores) {
      if (Reflect.has(this.componentStores, key)) {
        this.componentStores[key].reset();
      }
    }
    this.setChangeState(false);
  };

  @action
  addComponentStore = <U extends ComponentStoreInterface<T[keyof T], T>>(
    component: U,
  ) => {
    if (this.componentStores[component.key]) return false;
    else {
      this.componentStores[component.key] = component;
      return true;
    }
  };

  @action
  removeComponentStore = <U extends ComponentStoreInterface<T[keyof T], T>>(
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
    if (this.componentStores[key]) return this.componentStores[key].source as U | undefined;
  };

  getValues = <U extends T = T>(keys?: (keyof T)[]) => {
    const values: Partial<T> = {};

    if (!Array.isArray(keys)) {
      for (const key in this.componentStores) {
        if (this.componentStores[key]) values[key] = this.componentStores[key].source;
      }
    } else {
      for (const key of keys) {
        if (this.componentStores[key]) values[key] = this.componentStores[key].source;
      }
    }
    return values as Partial<U>;
  };

  setValue = (key: keyof T, value?: T[keyof T]) => {
    if (this.componentStores[key]) this.componentStores[key].onChange(value);
  };

  setValues = (props: Partial<T>) => {
    for (const key in props) {
      if (Reflect.has(props, key)) {
        if (this.componentStores[key]) this.componentStores[key].onChange(props[key]);
      }
    }
  };

  setAllValues = (props: Partial<T>) => {
    for (const key in this.componentStores) {
      if (Reflect.has(this.componentStores, key)) {
        if (props[key]) this.componentStores[key].onChange(props[key]);
        else this.componentStores[key].onChange(undefined);
      }
    }
  };

  valid = async () => {
    const errs: Partial<ErrorsType<T>> = {};
    if (this.validFirst) {
      for (const key in this.componentStores) {
        if (Reflect.has(this.componentStores, key)) {
          const componentStore = this.componentStores[key];
          // eslint-disable-next-line
          const errors = await componentStore.valid();
          if (errors) {
            errs[componentStore.key] = componentStore.errors;
            return errs;
          }
          const crossValidFuncs = this.crossValidFuncsDict[key];
          if (Array.isArray(crossValidFuncs)) {
            for (const crossValidFunc of crossValidFuncs) {
              crossValidFunc();
              if (componentStore.errors) {
                errs[componentStore.key] = componentStore.errors;
                return errs;
              }
            }
          }
        }
      }
    } else {
      const promiseErrors = (Object.keys(
        this.componentStores,
      ) as (keyof T)[]).map(async key => {
        return [key, await this.componentStores[key].valid()];
      }) as Promise<[keyof T, ErrorType]>[];
      await Promise.all(promiseErrors);

      for (const key in this.componentStores) {
        if (Reflect.has(this.componentStores, key)) {
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
