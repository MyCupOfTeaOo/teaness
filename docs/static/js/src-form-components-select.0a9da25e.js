(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{"./src/Form/Components/Select.mdx":function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return b}));var o=n("./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/slicedToArray.js"),a=n("./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js"),s=n("./node_modules/react/index.js"),l=n("./node_modules/@mdx-js/react/dist/index.es.js"),c=n("./node_modules/docz/dist/index.esm.js"),r=(n("./node_modules/antd/dist/antd.css"),n("./src/Form/Components/Select.tsx")),i={},u="wrapper";function b(e){var t=e.components,n=Object(a.a)(e,["components"]);return Object(l.b)(u,Object.assign({},i,n,{components:t,mdxType:"MDXLayout"}),Object(l.b)("h1",{id:"select\u9009\u62e9\u5668"},"Select(\u9009\u62e9\u5668)"),Object(l.b)("p",null,"antd ",Object(l.b)("a",Object.assign({parentName:"p"},{href:"https://ant.design/components/select-cn/"}),"Select")," \u5dee\u4e0d\u591a\n",Object(l.b)("del",{parentName:"p"},"\u8fd9\u662f\u4e00\u4e2a\u5b8c\u5168\u53d7\u63a7\u7684\u7ec4\u4ef6,\u4e5f\u5c31\u662f\u4e0d\u5904\u7406 onchange value \u9009\u62e9\u4e0d\u4f1a\u6709\u4efb\u4f55\u7528")),Object(l.b)("h2",{id:"\u57fa\u672c\u7528\u6cd5basic-usage"},"\u57fa\u672c\u7528\u6cd5(Basic usage)"),Object(l.b)(c.Playground,{__position:0,__code:"() => {\n  const [value, setValue] = useState(undefined)\n  return (\n    <div>\n      <Select onChange={setValue} value={value}>\n        <Select.Option value=\"\u6e05\u534e\">\u6e05\u534e</Select.Option>\n        <Select.Option value=\"\u5317\u5927\">\u5317\u5927</Select.Option>\n      </Select>\n      <Select\n        onChange={setValue}\n        value={value}\n        options={[\n          { label: '\u6e05\u534e', value: '\u6e05\u534e' },\n          { label: '\u5317\u5927', value: '\u5317\u5927' },\n        ]}\n      />\n    </div>\n  )\n}",__scope:{props:this?this.props:n,Playground:c.Playground,Props:c.Props,useState:s.useState,Select:r.a},__codesandbox:"undefined",mdxType:"Playground"},(function(){var e=Object(s.useState)(void 0),t=Object(o.a)(e,2),n=t[0],a=t[1];return Object(l.b)("div",null,Object(l.b)(r.a,{onChange:a,value:n,mdxType:"Select"},Object(l.b)(r.a.Option,{value:"\u6e05\u534e"},"\u6e05\u534e"),Object(l.b)(r.a.Option,{value:"\u5317\u5927"},"\u5317\u5927")),Object(l.b)(r.a,{onChange:a,value:n,options:[{label:"\u6e05\u534e",value:"\u6e05\u534e"},{label:"\u5317\u5927",value:"\u5317\u5927"}],mdxType:"Select"}))})),Object(l.b)("blockquote",null,Object(l.b)("p",{parentName:"blockquote"},"\u6b64\u5916\u8fd8\u652f\u6301 ",Object(l.b)("inlineCode",{parentName:"p"},"requestMethod")," \u65b9\u6cd5 \u9700\u8981\u4e00\u4e2a ",Object(l.b)("inlineCode",{parentName:"p"},"() => CancellablePromise<{ label: string; value: any }[]>"),"\u8fd9\u6837\u7684\u65b9\u6cd5\n\u4f1a\u81ea\u52a8\u8bf7\u6c42 ",Object(l.b)("inlineCode",{parentName:"p"},"requestMethod")," \u52a0\u8f7d ",Object(l.b)("inlineCode",{parentName:"p"},"options"))),Object(l.b)("pre",null,Object(l.b)("code",Object.assign({parentName:"pre"},{className:"language-ts"}),"type CancellablePromise<T> = Promise<T> & {\n  cancel(): void;\n};\n")),Object(l.b)("h2",{id:"\u5c5e\u6027properties"},"\u5c5e\u6027(Properties)"),Object(l.b)(c.Props,{of:r.a,mdxType:"Props"}))}b&&b===Object(b)&&Object.isExtensible(b)&&Object.defineProperty(b,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"MDXContent",filename:"src\\Form\\Components\\Select.mdx"}}),b.isMDXComponent=!0},"./src/Form/Components/Select.tsx":function(e,t,n){"use strict";var o=n("./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/slicedToArray.js"),a=n("./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js"),s=n("./node_modules/react/index.js"),l=n.n(s),c=n("./node_modules/antd/es/select/index.js"),r=n("./node_modules/classnames/index.js"),i=n.n(r),u=(n("./src/Form/Components/styles/select.scss"),n("./src/hooks/index.ts"));"undefined"!==typeof CancellablePromise&&CancellablePromise&&CancellablePromise===Object(CancellablePromise)&&Object.isExtensible(CancellablePromise)&&Object.defineProperty(CancellablePromise,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"CancellablePromise",filename:"src\\Form\\Components\\Select.tsx"}}),"undefined"!==typeof SelectProps&&SelectProps&&SelectProps===Object(SelectProps)&&Object.isExtensible(SelectProps)&&Object.defineProperty(SelectProps,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"SelectProps",filename:"src\\Form\\Components\\Select.tsx"}});var b=function(e){var t=e.onChange,n=e.options,r=e.requestMethod,b=e.errorCallback,p=e.className,d=Object(a.a)(e,["onChange","options","requestMethod","errorCallback","className"]),m=Object(u.b)(n,[n]),f=Object(o.a)(m,2),j=f[0],O=f[1],v=Object(s.useMemo)((function(){return e.children||(Array.isArray(j)?j.map((function(e){return l.a.createElement(c.a.Option,{key:e.value,value:e.value},e.label)})):void 0)}),[e.children,j]);return Object(s.useEffect)((function(){var e;return r?(e=r()).then((function(e){return O(e)})).catch((function(e){b?b(e):console.error(e)})):O(n),function(){e&&e.cancel()}}),[r]),l.a.createElement(c.a,Object.assign({className:i()("tea-select",p)},d,{onChange:t}),v)};"undefined"!==typeof SelectType&&SelectType&&SelectType===Object(SelectType)&&Object.isExtensible(SelectType)&&Object.defineProperty(SelectType,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"SelectType",filename:"src\\Form\\Components\\Select.tsx"}}),b.Option=c.a.Option,b.OptGroup=c.a.OptGroup,b.defaultProps={options:[],placeholder:"\u8bf7\u9009\u62e9",showSearch:!0,allowClear:!0},t.a=b,b&&b===Object(b)&&Object.isExtensible(b)&&Object.defineProperty(b,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"Select",filename:"src\\Form\\Components\\Select.tsx"}})},"./src/Form/Components/styles/select.scss":function(e,t,n){},"./src/hooks/index.ts":function(e,t,n){"use strict";n.d(t,"b",(function(){return s})),n.d(t,"a",(function(){return l}));var o=n("./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/slicedToArray.js"),a=n("./node_modules/react/index.js");function s(e,t){var n=Object(a.useState)(e),s=Object(o.a)(n,2),l=s[0],c=s[1];return Object(a.useEffect)((function(){c(e)}),t),[l,c]}function l(e,t){var n=Object(a.useRef)(0);return Object(a.useEffect)((function(){if(n.current)return e();n.current+=1}),t)}function c(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1,o=Object(a.useRef)(0);return Object(a.useEffect)((function(){if(!(o.current<n))return e();o.current+=1}),t)}s&&s===Object(s)&&Object.isExtensible(s)&&Object.defineProperty(s,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"useEffectState",filename:"src\\hooks\\index.ts"}}),l&&l===Object(l)&&Object.isExtensible(l)&&Object.defineProperty(l,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"useEffectExcludeFirst",filename:"src\\hooks\\index.ts"}}),c&&c===Object(c)&&Object.isExtensible(c)&&Object.defineProperty(c,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"useEffectExcludeNum",filename:"src\\hooks\\index.ts"}})}}]);
//# sourceMappingURL=src-form-components-select.7d048527ffcd316fc328.js.map