---
name: Getting Started
route: /
menu: 'Getting Started'
---

# teaness

[![NPM version](https://img.shields.io/npm/v/teaness.svg)](https://img.shields.io/npm/v/teaness.svg)
[![Dependency Status](https://img.shields.io/david/MyCupOfTeaOo/teaness)](https://img.shields.io/david/MyCupOfTeaOo/teaness)
[![react-^16.10.2](https://img.shields.io/badge/react-^16.10.2-066da5)](https://img.shields.io/badge/react-^16.10.2-066da5)
[![antd-^4.1.0](https://img.shields.io/badge/antd-^4.1.0-066da5)](https://img.shields.io/badge/antd-^4.1.0-066da5)
[![mobx-^5.14.2](https://img.shields.io/badge/mobx-^5.14.2-066da5)](https://img.shields.io/badge/mobx-^5.14.2-066da5)
[![async-validator-^3.2.4](https://img.shields.io/badge/async--validator-^3.2.4-066da5)](https://img.shields.io/badge/async--validator-^3.2.4-066da5)
[![ag-grid-react-^21.2.2](https://img.shields.io/badge/ag--grid--react-^21.2.2-066da5)](https://img.shields.io/badge/ag--grid--react-^21.2.2-066da5)

---

teaness 是一个的 react component 库,主要功能是

1. 高性能、易用的、可自定义 UI 的 Form
2. AgGrid 的 React 封装
3. 对 Ant design 组件的增强实现
4. 一些简单的组件封装

组件说明 Props 仅供参考,尽量直接看 interface

# Install

`npm i -S teaness`

## Example

https://teaness.org/

## todo

- [x] 升级到 antd 4.0
- [ ] 重构 api 与不合理的组件结构
  - [x] DataGrid
  - [ ] Form
    - [ ] Item 或 AutoWired 增加`显示中间件`的接口,类似于 props.middleware: `[component,props,options][]`,按顺序利用`compoent`一层层包裹`children`
  - [x] Label
  - [x] ~~Modal~~删除该组件
  - [x] PictureView
  - [x] Show
- [x] 增加错误定位方法
      ~~- [ ] 表单验证去抖~~真有性能问题在加这个机制
- [ ] 表单验证/显示增加多种模式
  - [x] 输出错误时机
    - [x] blur
    - [x] focus
    - [x] default
  - [ ] 校验错误
    - [ ] 校验到一个即停止
    - [ ] 校验所有
  - [ ] 显示错误
    - [x] 所有的错误全部显示
    - [ ] 同时显示一个错误
  - [x] 错误显示组件
    - [x] toolTip
    - [x] bottomText
- [ ] 测试用例
- [x] 增加更好用的 grid hook
      ~~- [ ] 研究下 form 布局问题~~
