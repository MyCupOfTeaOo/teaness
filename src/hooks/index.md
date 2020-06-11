---
name: hooks
route: /hooks
menu: hooks
---

import { Playground, Props } from 'docz';

# hooks

## useValue

| Property     | Type           | Required | Default   | return                                  | Description                                         |
| ------------ | -------------- | -------- | --------- | --------------------------------------- | --------------------------------------------------- |
| props | (initialState: S \| (() => S), options?: { storageKey?: string }) | false    | undefined | S extends undefined ? undefined \|S : S | 无闭包陷阱的 value,相当于 useRef 与 useState 的结合,配置 storageKey 时,则会在localStorage缓存数据 |

## useEffectState

| Property | Type                        | Required | Default | return | Description                         |
| -------- | --------------------------- | -------- | ------- | ------ | ----------------------------------- |
| props    | (initialState: T \| () => T,deps?: any[]) | true     |         | T      | 可以 hook 依赖重复初始化的 useState |

## useEffectExcludeFirst

| Property | Type                                  | Required | Default | return | Description         |
| -------- | ------------------------------------- | -------- | ------- | ------ | ------------------- |
| props    | (effect: EffectCallback,deps?: any[]) | true     |         | void   | effect 第一次不执行 |

## useEffectExcludeNum

| Property | Type                                               | Required | Default      | return | Description                         |
| -------- | -------------------------------------------------- | -------- | ------------ | ------ | ----------------------------------- |
| props    | (effect: EffectCallback,deps?: any[],num?: number) | true     | num 默认为 1 | void   | effect 第{num}次不执行,num 默认为 1 |
