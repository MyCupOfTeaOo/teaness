# teaness(v2)

- [ ] 4月初会来一次api整理,生产项目为了加急完工加了很多不合理的api,届时会增加更多的全局配置,修改当前全局配置的方式

是一个偏业务型的 react component 库
定位成辅助型的组件库,主要对 ant design 缺少,和不喜欢的组件进行封装
当时写这个库的目的只是为了解决 ant design form 不好用的问题,但是ant design这个问题 v4 版本可能能解决

## 文档

https://blissful-blackwell-0e6e7c.netlify.com/

## todo
- [x] formConfig 的 component,props 属性删除
- [x] 删除原有的 useForm
- [x] 新增 Form,Item,useForm 组件
- [x] 新增 Autowired 组件(处理数据装配)
~~- [ ] 增加错误定位~~v3
- [x] label 嵌入 Item
- [x] upload 上传方式优化,增加了 `UploadGroup`,每个局部的 upload 还可以替换全局 Upload.create 对自身的调用的 onUpload
~~- [ ] 测试用例~~
~~- [ ] 表单验证去抖~~
~~- [ ] 研究下form布局问题~~

## 安装

`npm i -S teaness`

## 运行文档

`npm run dev`
