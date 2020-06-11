import {
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  DependencyList,
  EffectCallback,
  useRef,
  useMemo,
} from 'react';

export function useEffectState<T>(
  props: T | (() => T),
  deps?: DependencyList,
): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState(props);
  useEffect(() => {
    setState(props);
  }, deps);
  return [state, setState];
}

export function useEffectExcludeNum(
  effect: EffectCallback,
  deps?: DependencyList,
  num = 1,
): void {
  const count = useRef(0);
  return useEffect(() => {
    if (count.current < num) {
      count.current += 1;
    } else return effect();
  }, deps);
}

export function useEffectExcludeFirst(
  effect: EffectCallback,
  deps?: DependencyList,
): void {
  return useEffectExcludeNum(effect, deps, 1);
}

export function useValue<S>(
  initialState: S | (() => S),
  options?: { storageKey?: string },
): {
  value: S;
  setValue(value: S): void;
};

export function useValue<S = undefined>(): {
  value: S | undefined;
  setValue(value: S | undefined): void;
};

/**
 *
 * @param initialState 初始值
 * @param options storageKey只在创建时生效
 */
export function useValue(
  initialState?: any,
  options?: { storageKey?: string },
) {
  const myInitialState = useMemo(() => {
    if (options?.storageKey) {
      let seqValue = initialState;
      try {
        const v = localStorage.getItem(options?.storageKey as string);
        if (v) seqValue = JSON.parse(v);
      } catch (err) {
        localStorage.removeItem(options?.storageKey as string);
        console.error(err, `${options?.storageKey}数据解析失败,删除`);
      }
      return seqValue;
    }
    return initialState;
  }, []);
  const [value, setValue] = useState(myInitialState);
  const proxyTarget = useMemo(() => {
    return new Proxy(
      {
        value,
        setValue(v: typeof value) {
          this.value = v;
        },
      },
      {
        set(target, name, v) {
          // eslint-disable-next-line
          target[name as keyof typeof target] = v;
          if (name === 'value') {
            if (options?.storageKey) {
              localStorage.setItem(options.storageKey, JSON.stringify(v));
            }
            setValue(v);
          }
          return true;
        },
        get(target, name) {
          return target[name as keyof typeof target];
        },
      },
    );
  }, []);
  return proxyTarget;
}
