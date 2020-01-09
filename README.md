# teaness(v2)

是一个偏业务型的 react component 库
定位成辅助型的组件库,主要对 ant design 缺少,和不喜欢的组件进行封装
当时写这个库的目的只是为了解决 ant design form 不好用的问题,但是ant design这个问题 v4 版本可能能解决

## 文档

https://blissful-blackwell-0e6e7c.netlify.com/

## todo
- [x] formConfig 的 component,props 属性删除
- [x] 删除原有的 useForm
- [x] 新增 Form,Item,useForm 组件
- [x] 新增 Autowired 组件(处理数据注入)
- [ ] 增加错误定位
- [x] label 嵌入 Item
- [ ] upload 上传方式修改(每个upload自身实现上传,upload.create只调用每个upload的上传方法)
- [ ] 测试用例

## 安装

`npm i -S teaness`

## 运行文档

`npm run dev`
