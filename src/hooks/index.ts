import {
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  DependencyList,
  EffectCallback,
  useRef,
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

export function useEffectExcludeFirst(
  effect: EffectCallback,
  deps?: DependencyList,
): void {
  const count = useRef(0);
  return useEffect(() => {
    if (!count.current) {
      count.current += 1;
    } else return effect();
  }, deps);
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
