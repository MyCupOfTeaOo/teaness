(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{"./src/Form/Components/Select.mdx":function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return u}));var a=n("./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/slicedToArray.js"),o=n("./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js"),l=n("./node_modules/react/index.js"),s=n("./node_modules/@mdx-js/react/dist/index.es.js"),c=n("./node_modules/docz/dist/index.esm.js"),r=(n("./node_modules/antd/dist/antd.css"),n("./src/Form/Components/Select.tsx")),i={},b="wrapper";function u(e){var t=e.components,n=Object(o.a)(e,["components"]);return Object(s.b)(b,Object.assign({},i,n,{components:t,mdxType:"MDXLayout"}),Object(s.b)("h1",{id:"select\u9009\u62e9\u5668"},"Select(\u9009\u62e9\u5668)"),Object(s.b)("p",null,"antd ",Object(s.b)("a",Object.assign({parentName:"p"},{href:"https://ant.design/components/select-cn/"}),"Select")," \u5dee\u4e0d\u591a\n",Object(s.b)("del",{parentName:"p"},"\u8fd9\u662f\u4e00\u4e2a\u5b8c\u5168\u53d7\u63a7\u7684\u7ec4\u4ef6,\u4e5f\u5c31\u662f\u4e0d\u5904\u7406 onchange value \u9009\u62e9\u4e0d\u4f1a\u6709\u4efb\u4f55\u7528")),Object(s.b)("h2",{id:"\u57fa\u672c\u7528\u6cd5basic-usage"},"\u57fa\u672c\u7528\u6cd5(Basic usage)"),Object(s.b)(c.Playground,{__position:0,__code:"() => {\n  const [value, setValue] = useState(undefined)\n  return (\n    <div>\n      <Select onChange={setValue} value={value}>\n        <Select.Option value=\"\u6e05\u534e\">\u6e05\u534e</Select.Option>\n        <Select.Option value=\"\u5317\u5927\">\u5317\u5927</Select.Option>\n      </Select>\n      <Select\n        onChange={setValue}\n        value={value}\n        options={[\n          { label: '\u6e05\u534e', value: '\u6e05\u534e' },\n          { label: '\u5317\u5927', value: '\u5317\u5927' },\n        ]}\n      />\n    </div>\n  )\n}",__scope:{props:this?this.props:n,Playground:c.Playground,Props:c.Props,useState:l.useState,Select:r.a},__codesandbox:"undefined",mdxType:"Playground"},(function(){var e=Object(l.useState)(void 0),t=Object(a.a)(e,2),n=t[0],o=t[1];return Object(s.b)("div",null,Object(s.b)(r.a,{onChange:o,value:n,mdxType:"Select"},Object(s.b)(r.a.Option,{value:"\u6e05\u534e"},"\u6e05\u534e"),Object(s.b)(r.a.Option,{value:"\u5317\u5927"},"\u5317\u5927")),Object(s.b)(r.a,{onChange:o,value:n,options:[{label:"\u6e05\u534e",value:"\u6e05\u534e"},{label:"\u5317\u5927",value:"\u5317\u5927"}],mdxType:"Select"}))})),Object(s.b)("blockquote",null,Object(s.b)("p",{parentName:"blockquote"},"\u6b64\u5916\u8fd8\u652f\u6301 ",Object(s.b)("inlineCode",{parentName:"p"},"requestMethod")," \u65b9\u6cd5 \u9700\u8981\u4e00\u4e2a ",Object(s.b)("inlineCode",{parentName:"p"},"() => CancellablePromise<{ label: string; value: any }[]>"),"\u8fd9\u6837\u7684\u65b9\u6cd5\n\u4f1a\u81ea\u52a8\u8bf7\u6c42 ",Object(s.b)("inlineCode",{parentName:"p"},"requestMethod")," \u52a0\u8f7d ",Object(s.b)("inlineCode",{parentName:"p"},"options"))),Object(s.b)("pre",null,Object(s.b)("code",Object.assign({parentName:"pre"},{className:"language-ts"}),"type CancellablePromise<T> = Promise<T> & {\n  cancel(): void;\n};\n")),Object(s.b)("h2",{id:"\u5c5e\u6027properties"},"\u5c5e\u6027(Properties)"),Object(s.b)(c.Props,{of:r.a,mdxType:"Props"}))}u&&u===Object(u)&&Object.isExtensible(u)&&Object.defineProperty(u,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"MDXContent",filename:"src\\Form\\Components\\Select.mdx"}}),u.isMDXComponent=!0},"./src/Form/Components/Select.tsx":function(e,t,n){"use strict";var a=n("./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/slicedToArray.js"),o=n("./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js"),l=n("./node_modules/react/index.js"),s=n.n(l),c=n("./node_modules/antd/es/select/index.js"),r=n("./node_modules/classnames/index.js"),i=n.n(r),b=(n("./src/Form/Components/styles/select.scss"),n("./src/hooks/index.ts"));"undefined"!==typeof CancellablePromise&&CancellablePromise&&CancellablePromise===Object(CancellablePromise)&&Object.isExtensible(CancellablePromise)&&Object.defineProperty(CancellablePromise,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"CancellablePromise",filename:"src\\Form\\Components\\Select.tsx"}}),"undefined"!==typeof SelectProps&&SelectProps&&SelectProps===Object(SelectProps)&&Object.isExtensible(SelectProps)&&Object.defineProperty(SelectProps,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"SelectProps",filename:"src\\Form\\Components\\Select.tsx"}});var u=function(e){var t=e.onChange,n=e.options,r=e.requestMethod,u=e.errorCallback,p=e.className,d=Object(o.a)(e,["onChange","options","requestMethod","errorCallback","className"]),m=Object(b.a)(n,[n]),j=Object(a.a)(m,2),O=j[0],f=j[1],S=Object(l.useMemo)((function(){return e.children||(Array.isArray(O)?O.map((function(e){return s.a.createElement(c.a.Option,{key:e.value,value:e.value},e.label)})):void 0)}),[e.children,O]);return Object(l.useEffect)((function(){var e;return r?(e=r()).then((function(e){return f(e)})).catch((function(e){u?u(e):console.error(e)})):f(n),function(){e&&e.cancel()}}),[r]),s.a.createElement(c.a,Object.assign({className:i()("tea-select",p)},d,{onChange:t}),S)};"undefined"!==typeof SelectType&&SelectType&&SelectType===Object(SelectType)&&Object.isExtensible(SelectType)&&Object.defineProperty(SelectType,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"SelectType",filename:"src\\Form\\Components\\Select.tsx"}}),u.Option=c.a.Option,u.OptGroup=c.a.OptGroup,u.defaultProps={options:[],placeholder:"\u8bf7\u9009\u62e9",showSearch:!0,allowClear:!0},t.a=u,u&&u===Object(u)&&Object.isExtensible(u)&&Object.defineProperty(u,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"Select",filename:"src\\Form\\Components\\Select.tsx"}})},"./src/Form/Components/styles/select.scss":function(e,t,n){},"./src/hooks/index.ts":function(e,t,n){"use strict";n.d(t,"a",(function(){return l}));var a=n("./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/slicedToArray.js"),o=n("./node_modules/react/index.js");function l(e,t){var n=Object(o.useState)(e),l=Object(a.a)(n,2),s=l[0],c=l[1];return Object(o.useEffect)((function(){c(e)}),t),[s,c]}l&&l===Object(l)&&Object.isExtensible(l)&&Object.defineProperty(l,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"useEffectState",filename:"src\\hooks\\index.ts"}})}}]);
//# sourceMappingURL=src-form-components-select.aef1b1fa3aaa5966c71b.js.map