(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{"./src/Form/Components/Upload/index.mdx":function(e,n,o){"use strict";o.r(n),o.d(n,"default",(function(){return l}));var t,d=o("./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js"),a=o("./node_modules/react/index.js"),s=o("./node_modules/@mdx-js/react/dist/index.es.js"),p=o("./node_modules/docz/dist/index.esm.js"),r=o("./node_modules/antd/es/button/index.js"),c=(o("./node_modules/antd/dist/antd.css"),o("./src/Form/Components/Upload/index.tsx")),u=(t="Demo",{}),i="wrapper";function l(e){var n=e.components,o=Object(d.a)(e,["components"]);return Object(s.b)(i,Object.assign({},u,o,{components:n,mdxType:"MDXLayout"}),Object(s.b)("h2",{id:"\u57fa\u672c\u7528\u6cd5basic-usage"},"\u57fa\u672c\u7528\u6cd5(Basic usage)"),Object(s.b)("p",null,"\u8fd9\u662f\u4e00\u4e2a\u624b\u52a8\u4e0a\u4f20\u7684\u7ec4\u4ef6,\u9700\u8981\u5148\u5b9e\u73b0 upload \u65b9\u6cd5\u5168\u5c40\u6ce8\u518c\u540e\u624d\u53ef\u4ee5\u4f7f\u7528"),Object(s.b)("h3",{id:"\u6700\u7b80\u5355\u7684\u4e0a\u4f20\u9700\u8981\u76f4\u63a5\u4e0a\u4f20\u53ef\u4ee5\u5b9e\u73b0-beforeupload-\u65b9\u6cd5"},"\u6700\u7b80\u5355\u7684\u4e0a\u4f20,\u9700\u8981\u76f4\u63a5\u4e0a\u4f20\u53ef\u4ee5\u5b9e\u73b0 beforeUpload \u65b9\u6cd5"),Object(s.b)("p",null,"\u7ee7\u627f\u4e86 antd upload \u7684\u6240\u6709\u5c5e\u6027"),Object(s.b)(p.Playground,{__position:0,__code:'\u9650\u5236\u5927\u5c0f\n<Upload maxSize={1} />\n\u9650\u5236\u4e0a\u4f20\u6570\u91cf\n<Upload max={1} multiple />\n\u5c55\u793a\u6837\u5f0f\n<Upload listType="picture" />\n\u53cb\u597d\u7684\u6587\u4ef6\u63d0\u793a\n<Upload accept="image/*" />',__scope:{props:this?this.props:o,useContext:a.useContext,useMemo:a.useMemo,Playground:p.Playground,Props:p.Props,Button:r.a,Upload:c.c,UploadContext:c.b,Registry:c.a},__codesandbox:"undefined",mdxType:"Playground"},"\u9650\u5236\u5927\u5c0f",Object(s.b)(c.c,{maxSize:1,mdxType:"Upload"}),"\u9650\u5236\u4e0a\u4f20\u6570\u91cf",Object(s.b)(c.c,{max:1,multiple:!0,mdxType:"Upload"}),"\u5c55\u793a\u6837\u5f0f",Object(s.b)(c.c,{listType:"picture",mdxType:"Upload"}),"\u53cb\u597d\u7684\u6587\u4ef6\u63d0\u793a",Object(s.b)(c.c,{accept:"image/*",mdxType:"Upload"})),Object(s.b)(p.Playground,{__position:1,__code:'() => {\n  const Demo = useMemo(\n    () =>\n      Upload.create()(() => {\n        const uploadContext = useContext(UploadContext)\n        Registry.upload = () => {\n          return new Promise((r, j) => {\n            setTimeout(() => j(false), 1000)\n          })\n        }\n        return (\n          <div>\n            <Button\n              onClick={() => {\n                uploadContext\n                  .upload()\n                  .then(res => console.log(`\u4e0a\u4f20\u6210\u529f ${res}`))\n              }}\n            >\n              \u624b\u52a8\u4e0a\u4f20\u5230\u670d\u52a1\u5668\n            </Button>\n            <Upload listType="picture" />\n          </div>\n        )\n      }),\n    [],\n  )\n  return <Demo />\n}',__scope:{props:this?this.props:o,useContext:a.useContext,useMemo:a.useMemo,Playground:p.Playground,Props:p.Props,Button:r.a,Upload:c.c,UploadContext:c.b,Registry:c.a},__codesandbox:"undefined",mdxType:"Playground"},(function(){var e=Object(a.useMemo)((function(){return c.c.create()((function(){var e=Object(a.useContext)(c.b);return c.a.upload=function(){return new Promise((function(e,n){setTimeout((function(){return n(!1)}),1e3)}))},Object(s.b)("div",null,Object(s.b)(r.a,{onClick:function(){e.upload().then((function(e){return console.log("\u4e0a\u4f20\u6210\u529f ".concat(e))}))},mdxType:"Button"},"\u624b\u52a8\u4e0a\u4f20\u5230\u670d\u52a1\u5668"),Object(s.b)(c.c,{listType:"picture",mdxType:"Upload"}))}))}),[]);return Object(s.b)(e,{mdxType:"Demo"})})),Object(s.b)("h2",{id:"\u5c5e\u6027properties"},"\u5c5e\u6027(Properties)"),Object(s.b)("h3",{id:"upload"},"Upload"),Object(s.b)(p.Props,{of:c.c,mdxType:"Props"}),Object(s.b)("pre",null,Object(s.b)("code",Object.assign({parentName:"pre"},{className:"language-ts"}),"interface UploadProps extends AntUploadProps {\n  /**\n   * \u9009\u62e9\u56fe\u7247\u540e\u89e6\u53d1\n   */\n  onSelect?: (info: UploadChangeParam) => void;\n  /**\n   * \u83b7\u53d6\u4fe1\u606f\u5931\u8d25\u540e\u7684\u56de\u8c03\n   */\n  getInfoErrorback?: (uid: string, err: any) => void;\n  /**\n   * \u83b7\u53d6\u4fe1\u606f\u7684\u65b9\u6cd5 \u4e00\u822c\u4f1a\u5148\u4ece\u4e0a\u4e0b\u6587\u83b7\u53d6,\u4f46\u662f\u8fd9\u4e2a\u4f18\u5148\u7ea7\u66f4\u9ad8\n   */\n  getFileInfo?: GetFileInfoType;\n  /**\n   * \u52a0\u8f7d\u4fe1\u606f\u65f6\u5019\u5c55\u793a\u7684\u6837\u5f0f\n   */\n  loading?: React.ReactNode;\n  /**\n   * \u6587\u4ef6\u6700\u5927size \u5355\u4f4dKB\n   */\n  maxSize?: number;\n    /**\n   * \u6587\u4ef6\u6700\u5927\u6570\u91cf \u5355\u4f4d\u4e2a\n   */\n  max?: number;\n}\n")),Object(s.b)("h3",{id:"create"},"create"),Object(s.b)(p.Props,{of:c.c.create,mdxType:"Props"}),Object(s.b)("h2",{id:"\u5168\u5c40\u914d\u7f6e"},"\u5168\u5c40\u914d\u7f6e"),Object(s.b)("p",null,"\u53ef\u4ee5\u901a\u8fc7 Upload \u76ee\u5f55\u7684 Registry \u4fee\u6539"))}l&&l===Object(l)&&Object.isExtensible(l)&&Object.defineProperty(l,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"MDXContent",filename:"src\\Form\\Components\\Upload\\index.mdx"}}),l.isMDXComponent=!0}}]);
//# sourceMappingURL=src-form-components-upload-index.16e8ad8baac93973d40d.js.map