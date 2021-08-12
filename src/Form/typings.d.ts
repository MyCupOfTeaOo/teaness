import Schema, { RuleItem } from 'async-validator';
import { CancellablePromise } from '../typings';

export type ValidFormatterType<U> = any;
export interface ErrorMessage {
  message: string;
  field: string;
}

export type InputStatus = 'default' | 'focus' | 'blur';

export type ErrorType = ErrorMessage[] | undefined;

export type ErrorsType<T> = {
  [U in keyof T]?: ErrorType;
};

export type ComponentStoresType<T> = {
  [P in keyof T]: ComponentStoreInterface<T[P], T>;
};

export type Rules = RuleItem | RuleItem[];

export type SubmitType<T> = () => Promise<SubmitCallbackProps<T>>;
export interface FunctionProperty {
  [key: string]: any;
}

export type Parse<U> = (...args: any) => U | undefined;

export type Format<U> = (value?: U) => any;

export type CheckResult = 'loading' | 'error' | 'success' | 'default';

export type SubStore<U> = U extends object[]
  ? FormStoreInstance<U[number]>[]
  : U extends { [key: string]: any }
  ? FormStoreInstance<U>
  : undefined;
export interface OnChangeContext {
  noParse?: boolean;
}

export interface ComponentStoreInterface<U = any, T = {}> {
  /**
   * 字段
   */
  key: keyof T;
  /**
   * 错误信息
   */
  err: ErrorType;
  /**
   * 字段交联错误信息
   */
  crossErr: {
    [key: string]: ErrorMessage;
  };
  /**
   * onChange上下文,每次onChange结束清空
   */
  onChangeContext: OnChangeContext;
  setOnChangeContext(context?: OnChangeContext): void;
  clearOnChangeContext: () => void;
  /**
   * 对外数据的错误信息(err and crossErr)
   */
  errors: ErrorType;
  /**
   * 父组件实例
   */
  formStore: FormStoreInstance<T>;
  /**
   * 前一次输入后的值
   */
  prevValue: U | undefined;
  /**
   * 格式化输出的值
   */
  value: U | undefined;

  /**
   * 当前输入后的值
   */
  source: U | undefined;
  /**
   * 子sotre
   */
  subStore?: SubStore<U>;
  /**
   * 默认值
   */
  defaultValue: U | undefined;
  /**
   * 是否输入过
   */
  isChange: boolean;
  /**
   * 是否正在验证
   */
  validing: boolean;
  /**
   * 输出错误信息的时机,默认 "default"
   */
  errorOutputTrigger: InputStatus;
  /**
   * 输入状态
   */
  inputStatus: InputStatus;
  /**
   * 检测结果
   */
  checkResult: CheckResult;

  /**
   * 验证规则,详情请查看相关链接
   * @see {@link https://github.com/yiminghe/async-validator}
   */
  rules?: Rules;
  /**
   * 验证规则实例
   */
  schema?: Schema;
  /**
   * @summary 输入的值格式化
   */
  parse?: Parse<U>;
  /**
   * 输出的值格式化
   */
  format?: Format<U>;

  setProps: (
    props: Omit<ComponentStoreProps<U, T>, 'key' | 'formStore'>,
  ) => void;
  setSubStore: (store?: SubStore<U>) => void;
  setValiding: (validing: boolean) => void;
  setParse: (parse?: Parse<U>) => void;
  setFormat: (format?: Format<U>) => void;
  setCrossErr: (props: { [key: string]: ErrorMessage }) => void;
  delCrossErr: (keys: string[]) => void;
  onChange: (value: U | undefined, ...args: any) => void;
  setDefaultValue: (value: U | undefined) => void;
  setRules: (rules: Rules | undefined) => void;
  setInputStatus: (inputStatus: InputStatus) => void;
  setErrorOutputTrigger: (inputStatus: InputStatus) => void;
  /**
   * @param rootId 根id,用于生成errorkey
   */
  valid: (rootId?: string) => CancellablePromise<ErrorType>;
  reset: () => void;
}
export interface ComponentStoreProps<U = any, T = {}> {
  key: keyof T;
  formStore: FormStoreInstance<T>;
  /**
   * 默认值
   */
  defaultValue?: U;
  /**
   * 验证规则,详情请查看相关链接
   * @see {@link https://github.com/yiminghe/async-validator}
   */
  rules?: Rules;
  /**
   * @summary 输入的值格式化
   */
  parse?: Parse<U>;
  /**
   * 输出的值格式化
   */
  format?: Format<U>;
  /**
   * 输出错误信息的时机,默认 "default"
   */
  errorOutputTrigger?: InputStatus;
}

export type SubmitCallbackProps<T> =
  | {
      values: T;
      errs: undefined;
    }
  | {
      values: Partial<T>;
      errs: ErrorsType<T>;
    };

export interface FormStoreProps<T> {
  getInstances: (formStore: FormStoreInstance<T>) => ComponentStoresType<T>;
}

export interface FormStoreInstance<T extends { [key: string]: any }> {
  /**
   * 父store
   */
  fatherStore?: ComponentStoreInterface;
  /**
   * 全局disabled
   */
  disabled: boolean;
  /**
   * valid一个错误就停止
   */
  validFirst?: boolean;

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
   * 自动返回当前的所有错误
   */
  errors?: ErrorType;

  /**
   * 表单变化触发
   * @param key 触发的key
   * @param value 触发的值(格式化过的)
   * @param original 触发的原始值
   * @param originalArgs 触发的原始值的其他参数
   * @param subStore 触发的子store
   */
  onChange?(
    key: keyof T,
    value: any,
    original: any,
    originalOtherArgs: any,
    subStore: ComponentStoreInterface<any, T>,
  ): void;
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
  setValue(
    key: keyof T,
    value?: T[keyof T],
    onChangeContext?: OnChangeContext,
  ): void;
  setValues(props: Partial<T>, onChangeContext?: OnChangeContext): void;
  /**
   * 跟上面 setValues 区别在于 此接口是把所有值更新成props,setValues({})不会更新任何值,setAllValues({})会把所有值更新成undefined
   * @param props
   */
  setAllValues(props: Partial<T>, onChangeContext?: OnChangeContext): void;
  /**
   * 触发全局验证
   * @param rootId 根id,用于生成errorkey
   */
  valid: (rootId?: string) => Promise<Partial<ErrorsType<T>> | undefined>;
  /**
   * 触发key对应的字段验证
   * @param key
   * @param rootId 用于生成errorkey
   */
  validValue(key: keyof T, rootId?: string): Promise<ErrorType>;
  /**
   *  触发keys对应的字段集验证
   * @param keys
   * @param rootId 用于生成errorkey
   */
  validValues<U extends ErrorsType<T> = ErrorsType<T>>(
    keys: (keyof T)[],
    rootId?: string,
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

export interface FormConfig<U>
  extends Omit<ComponentStoreProps<U, {}>, 'key' | 'formStore'> {}

export type FormConfigs<T = {}> = {
  [P in keyof T]: FormConfig<T[P]>;
};

export type PartialUndefined<T> = {
  [P in keyof T]: T[P] | undefined;
};

export interface GlobalOptions<T> {
  autoValid?: AutoValid<T> | AutoValid<T>[];
  autoHandle?: AutoHandle<T> | AutoHandle<T>[];
  errorOutputTrigger?: InputStatus;
}
