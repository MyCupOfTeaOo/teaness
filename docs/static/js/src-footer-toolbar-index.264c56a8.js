(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{"./src/FooterToolbar/index.mdx":function(e,o,t){"use strict";t.r(o);var r=t("./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js"),n=t("./node_modules/react/index.js"),s=t.n(n),a=t("./node_modules/@mdx-js/react/dist/index.es.js"),l=t("./node_modules/docz/dist/index.esm.js"),i=t("./node_modules/antd/es/button/index.js"),b=(t("./node_modules/antd/dist/antd.css"),t("./src/FooterToolbar/mdx.scss"),t("./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/defineProperty.js")),d=t("./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/classCallCheck.js"),c=t("./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/createClass.js"),u=t("./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js"),p=t("./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js"),m=t("./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/inherits.js"),j=t("./node_modules/classnames/index.js"),f=t.n(j);t("./src/FooterToolbar/index.scss");function O(e,o){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);o&&(r=r.filter((function(o){return Object.getOwnPropertyDescriptor(e,o).enumerable}))),t.push.apply(t,r)}return t}function y(e){for(var o=1;o<arguments.length;o++){var t=null!=arguments[o]?arguments[o]:{};o%2?O(t,!0).forEach((function(o){Object(b.a)(e,o,t[o])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):O(t).forEach((function(o){Object.defineProperty(e,o,Object.getOwnPropertyDescriptor(t,o))}))}return e}"undefined"!==typeof FooterToolbarProps&&FooterToolbarProps&&FooterToolbarProps===Object(FooterToolbarProps)&&Object.isExtensible(FooterToolbarProps)&&Object.defineProperty(FooterToolbarProps,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"FooterToolbarProps",filename:"src\\FooterToolbar\\index.tsx"}});var h=function(e){function o(){var e,t;Object(d.a)(this,o);for(var r=arguments.length,n=new Array(r),s=0;s<r;s++)n[s]=arguments[s];return(t=Object(u.a)(this,(e=Object(p.a)(o)).call.apply(e,[this].concat(n)))).state={width:void 0},t.resizeFooterToolbar=function(){var e=document.querySelector(".ant-layout-sider");if(null!=e){var o=t.props.isMobile?null:"calc(100% - ".concat(e.style.width,")");t.state.width!==o&&t.setState({width:o})}},t}return Object(m.a)(o,e),Object(c.a)(o,[{key:"componentDidMount",value:function(){window.addEventListener("resize",this.resizeFooterToolbar),this.resizeFooterToolbar()}},{key:"componentWillUnmount",value:function(){window.removeEventListener("resize",this.resizeFooterToolbar)}},{key:"render",value:function(){var e=this.props,o=e.children,t=e.className,n=e.style,a=Object(r.a)(e,["children","className","style"]),l=this.state.width;return s.a.createElement("div",{className:"tea-footer-toolbar-layout"},s.a.createElement("div",Object.assign({className:f()(t,"tea-footer-toolbar"),style:y({width:l},n)},a),o))}}]),o}(n.Component);"undefined"!==typeof h&&h&&h===Object(h)&&Object.isExtensible(h)&&Object.defineProperty(h,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"FooterToolbar",filename:"src\\FooterToolbar\\index.tsx"}}),"undefined"!==typeof h&&h&&h===Object(h)&&Object.isExtensible(h)&&Object.defineProperty(h,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"FooterToolbar",filename:"src\\FooterToolbar\\index.tsx"}});var _=t("./node_modules/docz-iframe-playground/dist/IFramePlayground.min.js");t.d(o,"default",(function(){return T}));var P={},v="wrapper";function T(e){var o=e.components,t=Object(r.a)(e,["components"]);return Object(a.b)(v,Object.assign({},P,t,{components:o,mdxType:"MDXLayout"}),Object(a.b)("h1",{id:"footertoolbar\u5e95\u90e8\u5de5\u5177\u680f"},"FooterToolbar(\u5e95\u90e8\u5de5\u5177\u680f)"),Object(a.b)("p",null,"\u6284\u7684 antd pro \u7684"),Object(a.b)("p",null,"\u9700\u8981menu \u6536\u7f29\u89e6\u53d1 resize"),Object(a.b)("h2",{id:"\u57fa\u672c\u7528\u6cd5basic-usage"},"\u57fa\u672c\u7528\u6cd5(Basic usage)"),Object(a.b)("p",null,"\u989c\u8272\u5176\u5b9e\u662f\u767d\u8272 \u4f46\u662f\u88ab\u6211\u7ffb\u8f6c\u4e86\u989c\u8272 \u65b9\u4fbf\u67e5\u770b\u8f6e\u5ed3"),Object(a.b)(l.Playground,{__position:0,__code:"<div style={{ padding: 20, backgroundColor: '#e5e5e5' }}>\n  <IFramePlayground>\n    <div className=\"content\">\n      <FooterToolbar>\n        <Button>\u63d0\u4ea4</Button>\n      </FooterToolbar>\n    </div>\n  </IFramePlayground>\n</div>",__scope:{props:this?this.props:t,Playground:l.Playground,Props:l.Props,Button:i.a,FooterToolbar:h,IFramePlayground:_.a},__codesandbox:"undefined",mdxType:"Playground"},Object(a.b)("div",{style:{padding:20,backgroundColor:"#e5e5e5"}},Object(a.b)(_.a,{mdxType:"IFramePlayground"},Object(a.b)("div",{className:"content"},Object(a.b)(h,{mdxType:"FooterToolbar"},Object(a.b)(i.a,{mdxType:"Button"},"\u63d0\u4ea4")))))),Object(a.b)("h2",{id:"\u5c5e\u6027properties"},"\u5c5e\u6027(Properties)"),Object(a.b)(l.Props,{of:h,mdxType:"Props"}))}T&&T===Object(T)&&Object.isExtensible(T)&&Object.defineProperty(T,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"MDXContent",filename:"src\\FooterToolbar\\index.mdx"}}),T.isMDXComponent=!0},"./src/FooterToolbar/index.scss":function(e,o,t){},"./src/FooterToolbar/mdx.scss":function(e,o,t){}}]);
//# sourceMappingURL=src-footer-toolbar-index.f35934118fa724741155.js.map