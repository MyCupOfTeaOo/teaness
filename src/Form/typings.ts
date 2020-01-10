import Scheme, { RuleItem } from 'async-validator';
import { CancellablePromise } from '../typings';

export type ValidFormatterType<U> = any;
export interface ErrorMessage {
  message: string;
}
export type ErrorType = ErrorMessage[] | undefined;

export type ErrorsType<T> = {
  [U in keyof T]?: ErrorType;
};

export type ComponentStoresType<T> = {
  [P in keyof T]: ComponentStoreInstance<T[P], T>;
};

export type Rules = RuleItem | RuleItem[];

export type SubmitCallBackType<T> = (props: SubmitCallBackProps<T>) => void;
export type SubmitType<T> = (callback: SubmitCallBackType<T>) => void;
export interface FunctionProperty {
  [key: string]: any;
}

export type Parse<U> = (...args: any) => U | undefined;

export type Format<U> = (value?: U) => any;

export interface ComponentStoreInstance<U = any, T = {}> {
  key: keyof T;
  err: ErrorType;
  crossErr: {
    [key: string]: ErrorMessage;
  };
  errors: ErrorType;
  formStore: FormStoreInstance<T>;
  prevValue: U | undefined;
  value: U | undefined;
  formatValue: U | undefined;
  defaultValue: U | undefined;
  isChange: boolean;
  scheme?: Scheme;
  rules?: Rules;
  parse?: Parse<U>;
  setParse: (parse?: Parse<U>) => void;
  format?: Format<U>;
  setFormat: (format?: Format<U>) => void;
  setCrossErr: (props: { [key: string]: ErrorMessage }) => void;
  delCrossErr: (keys: string[]) => void;
  onChange: (value: U | undefined) => void;
  setDefaultValue: (value: U | undefined) => void;
  setRules: (rules: Rules | undefined) => void;
  valid: () => CancellablePromise<any>;
  reset: () => void;
}
export interface ComponentStoreProps<U = any, T = {}> {
  key: keyof T;
  formStore: FormStoreInstance<T>;
  defaultValue: U | undefined;
  rules?: Rules;
  parse?: Parse<U>;
  format?: Format<U>;
}

export interface ComponentStoreConstructor<U = any, T = {}> {
  new (props: ComponentStoreProps): ComponentStoreInstance<U, T>;
}

export interface SubmitCallBackProps<T> {
  values: {
    [P in keyof T]?: T[P] | undefined;
  };
  errs: ErrorsType<T> | undefined;
}

export interface FormStoreProps<T> {
  getInstances: (formStore: FormStoreInstance<T>) => ComponentStoresType<T>;
}

export interface FormStoreInstance<T extends {}> {
  /**
   * 全局disabled
   */
  disabled: boolean;

  setDisabled: (disabled: boolean) => void;
  /**
   * 所有的component store
   */
  componentStores: ComponentStoresType<T>;
  crossValidFuncsDict: {
    [P in keyof T]?: (() => void)[];
  };
  /**
   * 提交
   */
  submit: SubmitType<T>;
  /**
   * 表单是否输入过
   */
  isChange: boolean;
  /**
   * 重置
   */
  setChangeState: (isChange: boolean) => void;
  reset: () => void;
  getValue<U extends T[keyof T]>(key: keyof T): U | undefined;
  /**
   * keys不传的情况下返回所有值
   * @param keys 获取的值
   */
  getValues<U extends T = T>(keys?: (keyof T)[]): Partial<U>;
  setValue(key: keyof T, value?: T[keyof T]): void;
  setValues(props: Partial<T>): void;
  /**
   * 跟上面 setValues 区别在于 此接口是把所有值更新成props,setValues({})不会更新任何值,setAllValues({})会把所有值更新成undefined
   * @param props
   */
  setAllValues(props: Partial<T>): void;
  /**
   * 触发全局验证
   */
  valid: () => Promise<Partial<ErrorsType<T>> | undefined>;
  /**
   * 触发key对应的字段验证
   * @param key
   */
  validValue(key: keyof T): Promise<ErrorType>;
  /**
   *  触发keys对应的字段集验证
   * @param keys
   */
  validValues<U extends ErrorsType<T> = ErrorsType<T>>(
    keys: (keyof T)[],
  ): Promise<Partial<U>>;
}

/**
 * 自动交联验证
 */
export interface AutoValid<T, P extends keyof T = keyof T> {
  /**
   * 错误显示在那个key上
   */
  primaryKey: P;
  /**
   * 除 primaryKey 外监听的其他key,primaryKey 与 key对应的值改变,即触发动作
   */
  listenKey: (keyof T)[];
  /**
   * 触发动作
   */
  effect: (
    arg: T,
    formStore: FormStoreInstance<T>,
    value?: T[P],
  ) => string | undefined;
}

/**
 * 自动处理
 */
export interface AutoHandle<T> {
  /**
   * 监听的key,key对应的值改变,即触发动作
   */
  listenKey: (keyof T)[];
  /**
   * 触发动作
   */
  effect: (arg: T, formStore: FormStoreInstance<T>) => void;
}

export interface FormConfig<U> {
  /**
   * form组件,只要支持 onChange,value即可
   */
  /**
   * 校验规则 建议观看 https://github.com/yiminghe/async-validator
   */
  rules?: Rules;
  /**
   * 默认值
   */
  defaultValue?: U | undefined;
  /**
   * 输入解析
   */
  parse?: Parse<U>;
  /**
   * 输入格式化
   */
  format?: Format<U>;
}

export type FormConfigs<T = {}> = {
  [P in keyof T]: FormConfig<T[P]>;
};

export type PartialUndefined<T> = {
  [P in keyof T]: T[P] | undefined;
};

export interface HookOptions<T> {
  autoValid?: AutoValid<T> | AutoValid<T>[];
  autoHandle?: AutoHandle<T> | AutoHandle<T>[];
}
