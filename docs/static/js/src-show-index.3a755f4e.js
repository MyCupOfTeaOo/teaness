(window.webpackJsonp=window.webpackJsonp||[]).push([[20],{"./src/Show/index.mdx":function(e,t,n){"use strict";n.r(t);var o=n("./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js"),a=n("./node_modules/react/index.js"),s=n.n(a),i=n("./node_modules/@mdx-js/react/dist/index.es.js"),r=n("./node_modules/docz/dist/index.esm.js"),c=n("./node_modules/antd/es/button/index.js"),l=(n("./node_modules/antd/dist/antd.css"),n("./node_modules/lodash/lodash.js")),u=n.n(l),b=n("./node_modules/lodash-es/lodash.default.js");"undefined"!==typeof Value&&Value&&Value===Object(Value)&&Object.isExtensible(Value)&&Object.defineProperty(Value,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"Value",filename:"src\\Show\\Switch.tsx"}}),"undefined"!==typeof CaseProps&&CaseProps&&CaseProps===Object(CaseProps)&&Object.isExtensible(CaseProps)&&Object.defineProperty(CaseProps,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"CaseProps",filename:"src\\Show\\Switch.tsx"}});var p=function(e){return s.a.createElement(s.a.Fragment,null,e.children)};p&&p===Object(p)&&Object.isExtensible(p)&&Object.defineProperty(p,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"Case",filename:"src\\Show\\Switch.tsx"}}),"undefined"!==typeof SwitchProps&&SwitchProps&&SwitchProps===Object(SwitchProps)&&Object.isExtensible(SwitchProps)&&Object.defineProperty(SwitchProps,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"SwitchProps",filename:"src\\Show\\Switch.tsx"}});var d=function(e){var t=e.actual,n=e.position,o=s.a.Children.map(e.children,(function(e){if(!(null===e||void 0===e?void 0:e.props))return e;var o=e.props.expect;return b.a.isFunction(o)?o(t)?e:n:b.a.isRegExp(o)?o.test(t)?e:n:Array.isArray(o)?o.some((function(e){return e===t}))?e:n:o===t?e:n}));return s.a.createElement(s.a.Fragment,null,o)};d.Case=p;var h=d;d&&d===Object(d)&&Object.isExtensible(d)&&Object.defineProperty(d,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"Switch",filename:"src\\Show\\Switch.tsx"}}),"undefined"!==typeof ShowProps&&ShowProps&&ShowProps===Object(ShowProps)&&Object.isExtensible(ShowProps)&&Object.defineProperty(ShowProps,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"ShowProps",filename:"src\\Show\\index.tsx"}});var m=function(e){var t=e.expect,n=e.actual,o=e.position,i=Object(a.useMemo)((function(){return u.a.isFunction(t)?t(n):u.a.isRegExp(t)?t.test(n):Array.isArray(t)?t.some((function(e){return e===n})):t===n}),[t,n]);return s.a.createElement(s.a.Fragment,null,i?e.children:o)};m&&m===Object(m)&&Object.isExtensible(m)&&Object.defineProperty(m,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"Show",filename:"src\\Show\\index.tsx"}}),"undefined"!==typeof h&&h&&h===Object(h)&&Object.isExtensible(h)&&Object.defineProperty(h,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"Switch",filename:"src\\Show\\index.tsx"}});var f=m;m&&m===Object(m)&&Object.isExtensible(m)&&Object.defineProperty(m,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"Show",filename:"src\\Show\\index.tsx"}}),n.d(t,"default",(function(){return x}));var w={},j="wrapper";function x(e){var t=e.components,n=Object(o.a)(e,["components"]);return Object(i.b)(j,Object.assign({},w,n,{components:t,mdxType:"MDXLayout"}),Object(i.b)("h1",{id:"show\u663e\u793a"},"Show(\u663e\u793a)"),Object(i.b)("p",null,"\u63a7\u5236 children \u662f\u5426\u663e\u793a"),Object(i.b)("h2",{id:"\u57fa\u672c\u7528\u6cd5basic-usage"},"\u57fa\u672c\u7528\u6cd5(Basic usage)"),Object(i.b)(r.Playground,{__position:0,__code:"<Show actual={0} expect={0}>\n  \u663e\u793a\n</Show>\n<Show actual={0} expect={1}>\n  \u4e0d\u663e\u793a\n</Show>",__scope:{props:this?this.props:n,Playground:r.Playground,Props:r.Props,Button:c.a,Show:f,Switch:h},__codesandbox:"undefined",mdxType:"Playground"},Object(i.b)(f,{actual:0,expect:0,mdxType:"Show"},"\u663e\u793a"),Object(i.b)(f,{actual:0,expect:1,mdxType:"Show"},"\u4e0d\u663e\u793a")),Object(i.b)("h2",{id:"\u5c5e\u6027properties"},"\u5c5e\u6027(Properties)"),Object(i.b)(r.Props,{of:f,mdxType:"Props"}),Object(i.b)("h1",{id:"switch\u5339\u914d\u663e\u793a"},"Switch(\u5339\u914d\u663e\u793a)"),Object(i.b)("p",null,"\u6839\u636e Switch.Case \u7ec4\u4ef6\u7684\u5339\u914d\u663e\u793a"),Object(i.b)("h2",{id:"\u57fa\u672c\u7528\u6cd5basic-usage-1"},"\u57fa\u672c\u7528\u6cd5(Basic usage)"),Object(i.b)(r.Playground,{__position:2,__code:"<Switch actual={0}>\n  <Switch.Case expect={0}>\u663e\u793a</Switch.Case>\n  <Switch.Case expect={1}>\u4e0d\u663e\u793a</Switch.Case>\n</Switch>",__scope:{props:this?this.props:n,Playground:r.Playground,Props:r.Props,Button:c.a,Show:f,Switch:h},__codesandbox:"undefined",mdxType:"Playground"},Object(i.b)(h,{actual:0,mdxType:"Switch"},Object(i.b)(h.Case,{expect:0},"\u663e\u793a"),Object(i.b)(h.Case,{expect:1},"\u4e0d\u663e\u793a"))),Object(i.b)("h2",{id:"\u5c5e\u6027properties-1"},"\u5c5e\u6027(Properties)"),Object(i.b)(r.Props,{of:h,mdxType:"Props"}))}x&&x===Object(x)&&Object.isExtensible(x)&&Object.defineProperty(x,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"MDXContent",filename:"src\\Show\\index.mdx"}}),x.isMDXComponent=!0}}]);
//# sourceMappingURL=src-show-index.942d8260b651c68728dd.js.map