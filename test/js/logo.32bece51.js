!function(t){var e={};function n(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(r,o,function(e){return t[e]}.bind(null,o));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=45)}({0:function(t,e,n){"use strict";function r(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}n.d(e,"a",(function(){return o}));var o=function(){function t(e,n){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.selector=e,this.classes=n,this.instances=[],"loading"!==document.readyState?this.start():document.addEventListener("DOMContentLoaded",this.start.bind(this))}var e,n,o;return e=t,(n=[{key:"start",value:function(){if(!(this.instances.length>0)&&document.querySelectorAll(this.selector).length>0)for(var t=0;t<this.classes.length;t++)this.instances.push(new this.classes[t])}}])&&r(e.prototype,n),o&&r(e,o),t}()},1:function(t,e,n){"use strict";t.exports=function(t){var e=[];return e.toString=function(){return this.map((function(e){var n=function(t,e){var n=t[1]||"",r=t[3];if(!r)return n;if(e&&"function"==typeof btoa){var o=(a=r,c=btoa(unescape(encodeURIComponent(JSON.stringify(a)))),s="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(c),"/*# ".concat(s," */")),i=r.sources.map((function(t){return"/*# sourceURL=".concat(r.sourceRoot||"").concat(t," */")}));return[n].concat(i).concat([o]).join("\n")}var a,c,s;return[n].join("\n")}(e,t);return e[2]?"@media ".concat(e[2]," {").concat(n,"}"):n})).join("")},e.i=function(t,n,r){"string"==typeof t&&(t=[[null,t,""]]);var o={};if(r)for(var i=0;i<this.length;i++){var a=this[i][0];null!=a&&(o[a]=!0)}for(var c=0;c<t.length;c++){var s=[].concat(t[c]);r&&o[s[0]]||(n&&(s[2]?s[2]="".concat(n," and ").concat(s[2]):s[2]=n),e.push(s))}},e}},2:function(t,e,n){"use strict";n(3);var r=n(0);function o(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}var i="data-theme",a=function(){function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.init()}var e,n,r;return e=t,(n=[{key:"init",value:function(){var t=this;this.scheme=localStorage.getItem("scheme")?localStorage.getItem("scheme"):null,null===this.scheme&&(window.matchMedia("(prefers-color-scheme: dark)").matches?(this.scheme="dark",localStorage.setItem("scheme","dark")):this.scheme="light"),this.root=document.documentElement,"dark"===this.scheme&&(this.root.hasAttribute("data-transition")?(this.root.removeAttribute("data-transition"),this.root.setAttribute(i,"dark"),setTimeout((function(){t.root.setAttribute("data-transition","")}),300)):this.root.setAttribute(i,"dark")),this.checkbox=document.getElementById("rf-dark-mode-toggle-switch"),"dark"===this.scheme&&(this.checkbox.checked=!0),this.checkbox.addEventListener("change",this.change.bind(this))}},{key:"change",value:function(){this.checkbox.checked?(this.scheme="dark",localStorage.setItem("scheme","dark"),this.root.setAttribute(i,"dark")):(this.scheme="light",localStorage.setItem("scheme","light"),this.root.removeAttribute(i))}}])&&o(e.prototype,n),r&&o(e,r),t}();new r.a("#rf-dark-mode-toggle-switch",[a])},3:function(t,e,n){(e=n(1)(!1)).push([t.i,"",""]),t.exports=e},45:function(t,e,n){"use strict";n.r(e);n(46),n(2)},46:function(t,e,n){(e=n(1)(!1)).push([t.i,"",""]),t.exports=e}});
//# sourceMappingURL=logo.32bece51.js.map