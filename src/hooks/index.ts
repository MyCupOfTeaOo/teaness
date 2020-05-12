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
): {
  current: S;
};

export function useValue<S = undefined>(): {
  current: S | undefined;
};

export function useValue(initialState?: any) {
  const [value, setValue] = useState(initialState);
  const proxyTarget = useMemo(() => {
    return new Proxy(
      {
        current: value,
      },
      {
        set(target, __, v) {
          // eslint-disable-next-line
          target.current = v;
          setValue(v);
          return true;
        },
        get(target) {
          return target.current;
        },
      },
    );
  }, []);
  return proxyTarget;
}
