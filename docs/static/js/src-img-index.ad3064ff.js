(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{"./src/Img/index.mdx":function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return u}));var s=n("./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js"),r=(n("./node_modules/react/index.js"),n("./node_modules/@mdx-js/react/dist/index.es.js")),c=n("./node_modules/docz/dist/index.esm.js"),i=n("./src/Img/index.tsx"),o={},a="wrapper";function u(e){var t=e.components,n=Object(s.a)(e,["components"]);return Object(r.b)(a,Object.assign({},o,n,{components:t,mdxType:"MDXLayout"}),Object(r.b)("h1",{id:"img\u56fe\u7247"},"Img(\u56fe\u7247)"),Object(r.b)("p",null,"\u4e3b\u8981\u662f\u4e3a\u4e86\u89e3\u51b3\u56fe\u7247\u52a0\u8f7d\u5931\u8d25 \u4f7f\u7528\u5907\u7528\u56fe\u7247"),Object(r.b)("h2",{id:"\u57fa\u672c\u7528\u6cd5basic-usage"},"\u57fa\u672c\u7528\u6cd5(Basic usage)"),Object(r.b)(c.Playground,{__position:0,__code:'<Img\n  src="/img.png"\n  style={{\n    width: 20,\n  }}\n/>',__scope:{props:this?this.props:n,Playground:c.Playground,Props:c.Props,Img:i.a},__codesandbox:"undefined",mdxType:"Playground"},Object(r.b)(i.a,{src:"/img.png",style:{width:20},mdxType:"Img"})),Object(r.b)("h2",{id:"\u5c5e\u6027properties"},"\u5c5e\u6027(Properties)"),Object(r.b)(c.Props,{of:i.a,mdxType:"Props"}))}u&&u===Object(u)&&Object.isExtensible(u)&&Object.defineProperty(u,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"MDXContent",filename:"src\\Img\\index.mdx"}}),u.isMDXComponent=!0},"./src/Img/index.tsx":function(e,t,n){"use strict";var s=n("./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/slicedToArray.js"),r=n("./node_modules/react/index.js"),c=n.n(r),i=n("./src/hooks/index.ts");"undefined"!==typeof ImgProps&&ImgProps&&ImgProps===Object(ImgProps)&&Object.isExtensible(ImgProps)&&Object.defineProperty(ImgProps,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"ImgProps",filename:"src\\Img\\index.tsx"}});var o=function(e){var t=Object(i.b)(e.src||e.backupSrc,[e.src]),n=Object(s.a)(t,2),r=n[0],o=n[1];return c.a.createElement("img",{className:e.className,style:e.style,alt:e.alt,src:r,onError:function(){return o(e.backupSrc)}})};o.defaultProps={backupSrc:"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pgo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCI+CiAgPHBhdGggZmlsbD0iI0Q5RDlEOSIgZD0iTTUzNCAzNTJWMTM2SDIzMnY3NTJoNTYwVjM5NEg1NzZhNDIgNDIgMCAwIDEtNDItNDJ6Ii8+CiAgPHBhdGggZD0iTTg1NC42IDI4OC42TDYzOS40IDczLjRjLTYtNi0xNC4xLTkuNC0yMi42LTkuNEgxOTJjLTE3LjcgMC0zMiAxNC4zLTMyIDMydjgzMmMwIDE3LjcgMTQuMyAzMiAzMiAzMmg2NDBjMTcuNyAwIDMyLTE0LjMgMzItMzJWMzExLjNjMC04LjUtMy40LTE2LjctOS40LTIyLjd6TTYwMiAxMzcuOEw3OTAuMiAzMjZINjAyVjEzNy44ek03OTIgODg4SDIzMlYxMzZoMzAydjIxNmE0MiA0MiAwIDAgMCA0MiA0MmgyMTZ2NDk0eiIvPgo8L3N2Zz4K"},t.a=o,o&&o===Object(o)&&Object.isExtensible(o)&&Object.defineProperty(o,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"Img",filename:"src\\Img\\index.tsx"}})},"./src/hooks/index.ts":function(e,t,n){"use strict";n.d(t,"b",(function(){return c})),n.d(t,"a",(function(){return i}));var s=n("./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/slicedToArray.js"),r=n("./node_modules/react/index.js");function c(e,t){var n=Object(r.useState)(e),c=Object(s.a)(n,2),i=c[0],o=c[1];return Object(r.useEffect)((function(){o(e)}),t),[i,o]}function i(e,t){var n=Object(r.useRef)(0);return Object(r.useEffect)((function(){if(n.current)return e();n.current+=1}),t)}function o(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1,s=Object(r.useRef)(0);return Object(r.useEffect)((function(){if(!(s.current<n))return e();s.current+=1}),t)}c&&c===Object(c)&&Object.isExtensible(c)&&Object.defineProperty(c,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"useEffectState",filename:"src\\hooks\\index.ts"}}),i&&i===Object(i)&&Object.isExtensible(i)&&Object.defineProperty(i,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"useEffectExcludeFirst",filename:"src\\hooks\\index.ts"}}),o&&o===Object(o)&&Object.isExtensible(o)&&Object.defineProperty(o,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"useEffectExcludeNum",filename:"src\\hooks\\index.ts"}})}}]);
//# sourceMappingURL=src-img-index.ddfa5e38a78b985e967a.js.map