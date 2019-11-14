import Scheme, { RuleItem } from 'async-validator';
import { CancellablePromise } from 'mobx/lib/api/flow';

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
export interface ComponentBaseProps<U = any> {
  onChange?: (value: U) => void;
  value?: U | undefined;
  errors?: ErrorType;
}
export interface FunctionComponent<T = {}>
  extends React.FC<T>,
    FunctionProperty {}
export interface Component<T = {}> extends React.ComponentClass<T> {}
export type ComponentType<
  U,
  T extends ComponentBaseProps<U> = ComponentBaseProps<U>
> = FunctionComponent<T> | Component<T>;

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
  defaultValue: U | undefined;
  isChange: boolean;
  scheme?: Scheme;
  rules?: Rules;
  props?: {
    [key: string]: any;
  };
  component: ComponentType<U>;
  setCrossErr: (props: { [key: string]: ErrorMessage }) => void;
  delCrossErr: (keys: string[]) => void;
  onChange: (value: U | undefined) => void;
  setDefaultValue: (value: U | undefined) => void;
  setRules: (rules: Rules | undefined) => void;
  setProps: (
    props:
      | {
          [key: string]: any;
        }
      | undefined,
  ) => void;
  setComponent: (component: ComponentType<U>) => void;
  valid: () => CancellablePromise<any>;
  reset: () => void;
}
export interface ComponentStoreProps<U = any, T = {}> {
  key: keyof T;
  formStore: FormStoreInstance<T>;
  defaultValue: U | undefined;
  component: ComponentType<U>;
  rules?: Rules;
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
  getValues<U extends T = T>(keys: (keyof T)[]): Partial<U>;
  setValue(key: keyof T, value: T[keyof T]): void;
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

export interface AutoValid<T> {
  primaryKey: keyof T;
  listenKey: (keyof T)[];
  effect: (arg: T, formStore: FormStoreInstance<T>) => string | undefined;
}

export interface AutoHandle<T> {
  listenKey: (keyof T)[];
  effect: (arg: T, formStore: FormStoreInstance<T>) => void;
}

export interface FormConfig<U, T, C = any> {
  /**
   * form组件,只要支持 onChange,value即可
   */
  component: C;
  /**
   * 校验规则 建议观看 https://github.com/yiminghe/async-validator
   */
  rules?: Rules;
  /**
   * 默认值
   */
  defaultValue?: U | undefined;
  /**
   * 组件props,不过不建议在这边传
   */
  props?: {
    [key: string]: any;
  };
}

export type FormConfigs<T = {}> = {
  [P in keyof T]: FormConfig<T[P], T>;
};

export type PartialUndefined<T> = {
  [P in keyof T]: T[P] | undefined;
};

export interface HookOptions<T> {
  autoValid?: AutoValid<T> | AutoValid<T>[];
  autoHandle?: AutoHandle<T> | AutoHandle<T>[];
}
