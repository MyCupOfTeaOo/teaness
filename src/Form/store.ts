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
  SubStore,
  OnChangeContext,
} from './typings';

export class ComponentStore<U = any, T = {}>
  implements ComponentStoreInterface<U, T> {
  key: keyof T;

  formStore: FormStoreInstance<T>;

  defaultValue: U | undefined = undefined;

  onChangeContext: OnChangeContext = {};

  @observable
  isChange = false;

  @observable
  prevValue: U | undefined = undefined;

  @observable
  source: U | undefined = undefined;

  @observable
  subStore?: SubStore<U> = undefined;

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
  setSubStore = (store?: SubStore<U>) => {
    if (Array.isArray(store)) {
      store.forEach(item => {
        // eslint-disable-next-line
        item.fatherStore = this as any;
      });
    } else if (store) {
      // eslint-disable-next-line
      store.fatherStore = this as any;
    }
    this.subStore = store;
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

  setOnChangeContext = (context?: OnChangeContext) => {
    this.onChangeContext = context || {};
  };

  clearOnChangeContext = () => {
    this.onChangeContext = {};
  };

  @action
  onChange = (value: U | Event | SyntheticEvent | undefined, ...args: any) => {
    let parseValue: U | undefined;
    if (this.parse && !this.onChangeContext.noParse) {
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
    this.formStore.onChange?.(this.key, parseValue, value, args, this as any);
    this.valid();
    this.clearOnChangeContext();
  };

  @action
  setDefaultValue = (value: U | undefined) => {
    if (!this.isChange) this.source = value;
    this.defaultValue = value;
  };

  @action
  reset = () => {
    // 没有变更不需要reset
    if (this.isChange) {
      this.isChange = false;
      this.prevValue = undefined;
      this.source = this.defaultValue;
      this.err = undefined;
      this.crossErr = {};
    }
  };

  @action
  setInputStatus = (inputStatus: InputStatus) => {
    this.inputStatus = inputStatus;
  };

  @action
  setErrorOutputTrigger = (errorOutputTrigger: InputStatus) => {
    this.errorOutputTrigger = errorOutputTrigger;
  };

  valid = flow<ErrorType, any[]>(function*(
    this: ComponentStore<U, T>,
    rootId?: string,
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
          field: `${rootId || ''}${rootId ? '.' : ''}${item.field}`,
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

  @observable
  isChange = false;

  validFirst = false;

  @action
  setDisabled = (disabled: boolean) => {
    this.disabled = disabled;
  };

  onChange?(
    key: keyof T,
    value: any,
    original: any,
    originalOtherArgs: any,
    subStore: ComponentStoreInterface<any, T>,
  ): void;

  constructor(props: FormStoreProps<T>) {
    this.componentStores = props.getInstances(this);
  }

  crossValidFuncsDict: {
    [P in keyof T]?: (() => void)[];
  } = {};

  @computed get errors(): ErrorType {
    const errs = Object.keys(this.componentStores).reduce((list, key) => {
      const errors = this.componentStores[key as keyof T]?.errors;
      if (!errors) {
        return list;
      }
      return list.concat(errors);
    }, [] as ErrorMessage[]);

    if (isEmpty(errs)) return undefined;
    return errs;
  }

  @action
  setChangeState = (isChange: boolean) => {
    this.isChange = isChange;
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

  submit: SubmitType<T> = callback => {
    const values = this.getValues();
    this.valid().then(errs => {
      callback({
        values: values as T | Partial<T>,
        errs: errs as ErrorsType<T>,
      });
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

  // @TODO subStore 只是临时方案
  getValue = <U extends T[keyof T]>(key: keyof T) => {
    if (this.componentStores[key]) {
      const { subStore } = this.componentStores[key];
      if (subStore) {
        if (Array.isArray(subStore)) {
          return ((subStore as FormStore<any>[]).map(store => {
            return store.getValues() as any;
          }) as any) as U | undefined;
        } else {
          return ((subStore as unknown) as FormStore<U>).getValues() as
            | U
            | undefined;
        }
      }
      return this.componentStores[key].source as U | undefined;
    }
  };

  getValues = <U extends T = T>(keys?: (keyof T)[]) => {
    const values: Partial<T> = {};

    if (!Array.isArray(keys)) {
      Object.keys(this.componentStores).forEach(key => {
        values[key as keyof T] = this.getValue(key as keyof T);
      });
    } else {
      for (const key of keys) {
        values[key] = this.getValue(key);
      }
    }
    return values as Partial<U>;
  };

  setValue = (
    key: keyof T,
    value?: T[keyof T],
    onChangeContext?: OnChangeContext,
  ) => {
    const instance = this.componentStores[key];
    if (instance) {
      instance.setOnChangeContext(
        onChangeContext || {
          noParse: true,
        },
      );
      instance.onChange(value);
    }
  };

  setValues = (props: Partial<T>, onChangeContext?: OnChangeContext) => {
    Object.keys(props).forEach(key => {
      this.setValue(key as keyof T, props[key as keyof T], onChangeContext);
    });
  };

  setAllValues = (props: Partial<T>, onChangeContext?: OnChangeContext) => {
    for (const key in this.componentStores) {
      if (Reflect.has(this.componentStores, key)) {
        if (props[key]) {
          this.setValue(key as keyof T, props[key as keyof T], onChangeContext);
        } else {
          this.setValue(key as keyof T, undefined, onChangeContext);
        }
      }
    }
  };

  // @TODO 因为 subStore 只是临时方案,所以暂时不支持 validFirst
  valid = async (rootId?: string) => {
    const errs: ErrorsType<T> = {};
    if (this.validFirst) {
      for (const key in this.componentStores) {
        if (Reflect.has(this.componentStores, key)) {
          const componentStore = this.componentStores[key];
          // eslint-disable-next-line
          const errors = await componentStore.valid(rootId);
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
      const keys = Object.keys(this.componentStores as any) as (keyof T)[];
      const errList = await Promise.all(
        keys.map(key => this.validValue(key, rootId)),
      );
      keys.forEach((key, i) => {
        const errMessages = errList[i];
        if (errMessages) {
          Object.assign(errs, {
            [key]: errMessages,
          });
        }
      });
    }
    if (isEmpty(errs)) return undefined;
    return errs;
  };

  // @TODO subStore 只是临时方案
  validValue = async (key: keyof T, rootId?: string) => {
    if (!this.componentStores[key]) return undefined;
    await this.componentStores[key].valid(rootId);
    const crossValidFuncs = this.crossValidFuncsDict[key];
    if (Array.isArray(crossValidFuncs)) {
      for (const crossValidFunc of crossValidFuncs) {
        crossValidFunc();
      }
    }
    const subErrors: ErrorMessage[] = [];
    const { subStore } = this.componentStores[key];
    if (subStore) {
      if (Array.isArray(subStore)) {
        const subStoreValids = await Promise.all(
          (subStore as FormStore<any>[]).map((store, i) => {
            return store.valid(
              `${rootId || ''}${rootId ? '.' : ''}${key}[${i}]`,
            );
          }),
        );
        subStoreValids.forEach(storeErrs => {
          if (storeErrs) {
            Object.values(storeErrs).forEach(item => {
              if (item) {
                subErrors.push(...item);
              }
            });
          }
        });
      } else {
        const subStoreValid = await ((subStore as any) as FormStore<any>).valid(
          `${rootId || ''}${rootId ? '.' : ''}${key}`,
        );
        if (subStoreValid) {
          Object.values(subStoreValid).forEach(item => {
            if (item) {
              subErrors.push(...item);
            }
          });
        }
      }
    }
    if (subErrors.length) {
      return subErrors.concat(this.componentStores[key].errors || []);
    }
    return this.componentStores[key].errors;
  };

  validValues = async <U extends ErrorsType<T> = ErrorsType<T>>(
    keys: (keyof T)[],
    rootId?: string,
  ) => {
    const errs: Partial<ErrorsType<T>> = {};
    const promiseErrors = keys.map(errMessages =>
      this.validValue(errMessages, rootId),
    );
    const errors = await Promise.all(promiseErrors);
    keys.forEach((key, i) => {
      errs[key] = errors[i];
    });
    return errs as Partial<U>;
  };
}
