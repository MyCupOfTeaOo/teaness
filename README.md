# teaness(v3)



是一个偏业务型的 react component 库
定位成辅助型的组件库,主要对 ant design 缺少,和不喜欢的组件进行封装
当时写这个库的目的只是为了解决 ant design form 不好用的问题,但是ant design这个问题 v4 版本可能能解决

## 文档

https://blissful-blackwell-0e6e7c.netlify.com/

## todo
- [x] 升级到antd 4.0
- [ ] 重构api与不合理的组件结构
  - [x] DataGrid
  - [ ] Form
  - [x] Label
  - [x] Modal
  - [x] PictureView
  - [x] Show
- [x] 增加错误定位方法
~~- [ ] 表单验证去抖~~真有性能问题在加这个机制
- [ ] 表单验证/显示增加多种模式
  - [ ] 校验时机
    - [ ] blur
    - [ ] change
    - [ ] submit
  - [ ] 校验错误
    - [ ] 校验到一个即停止
    - [ ] 校验所有
  - [ ] 显示错误
    - [ ] 所有的错误全部显示
    - [ ] 同时显示一个错误
  - [ ] 显示错误ui
    - [ ] toolTip
    - [ ] bottomtext
- [ ] 测试用例
- [x] 增加更好用的grid hook
~~- [ ] 研究下form布局问题~~

## 安装

`npm i -S teaness`

## 运行文档

`npm run dev`
