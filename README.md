---
name: Getting Started
route: /
menu: 'Getting Started'
---

# teaness

[![NPM version](https://img.shields.io/npm/v/teaness.svg)](https://img.shields.io/npm/v/teaness.svg)
[![Dependency Status](https://img.shields.io/david/MyCupOfTeaOo/teaness)](https://img.shields.io/david/MyCupOfTeaOo/teaness)
[![react-version](https://img.shields.io/npm/dependency-version/teaness/react)](https://img.shields.io/npm/dependency-version/teaness/react)
[![antd-version](https://img.shields.io/npm/dependency-version/teaness/@material-ui/core)](https://img.shields.io/npm/dependency-version/teaness/@material-ui/core)
[![antd-version](https://img.shields.io/npm/dependency-version/teaness/antd)](https://img.shields.io/npm/dependency-version/teaness/antd)
[![mobx-version](https://img.shields.io/npm/dependency-version/teaness/mobx)](https://img.shields.io/npm/dependency-version/teaness/mobx)
[![async-validator-version](https://img.shields.io/npm/dependency-version/teaness/async-validator)](https://img.shields.io/npm/dependency-version/teaness/async-validator)
[![ag-grid-community-version](https://img.shields.io/npm/dependency-version/teaness/ag-grid-community)](https://img.shields.io/npm/dependency-version/teaness/ag-grid-community)
[![ag-grid-react-version](https://img.shields.io/npm/dependency-version/teaness/ag-grid-react)](https://img.shields.io/npm/dependency-version/teaness/ag-grid-react)

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
  - [x] Form
  - [x] Label
  - [x] ~~Modal~~删除该组件
  - [x] Show
- [x] 增加错误定位方法
      ~~- [ ] 表单验证去抖~~真有性能问题在加这个机制
- [ ] 表单验证/显示增加多种模式
  - [x] 输出错误时机
    - [x] blur
    - [x] focus
    - [x] default
  - [x] 校验错误
    - [x] 校验到一个即停止
    - [x] 校验所有
  - [ ] 显示错误
    - [x] 所有的错误全部显示
    - [ ] 同时显示一个错误
  - [x] 错误显示组件
    - [x] toolTip
    - [x] bottomText
- [ ] 测试用例
- [x] 增加更好用的 grid hook
      ~~- [ ] 研究下 form 布局问题~~
