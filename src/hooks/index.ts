import {
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  DependencyList,
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
