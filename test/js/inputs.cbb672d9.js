!function(t){var e={};function n(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(r,o,function(e){return t[e]}.bind(null,o));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=35)}({0:function(t,e,n){"use strict";function r(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}n.d(e,"h",(function(){return o})),n.d(e,"k",(function(){return i.a})),n.d(e,"l",(function(){return i.b})),n.d(e,"f",(function(){return c})),n.d(e,"j",(function(){return y})),n.d(e,"i",(function(){return g})),n.d(e,"g",(function(){return R})),n.d(e,"c",(function(){return Y})),n.d(e,"d",(function(){return F})),n.d(e,"e",(function(){return M})),n.d(e,"a",(function(){return kt})),n.d(e,"b",(function(){return lt}));var o=function(){function t(e,n){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.selector=e,this.classes=n,this.instances=[],"loading"!==document.readyState?this.start():document.addEventListener("DOMContentLoaded",this.start.bind(this))}var e,n,o;return e=t,(n=[{key:"start",value:function(){if(!(this.instances.length>0)&&document.querySelectorAll(this.selector).length>0)for(var t=0;t<this.classes.length;t++)this.instances.push(new this.classes[t])}}])&&r(e.prototype,n),o&&r(e,o),t}(),i=n(1);function u(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function a(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function s(t,e,n){return e&&a(t.prototype,e),n&&a(t,n),t}var c=function(){function t(e,n){u(this,t),this.selector=e,this.group=n,this.elements=this.group.querySelectorAll(this.selector),this.maxWidth=0,this.changing=this.change.bind(this),window.addEventListener("resize",this.changing),window.addEventListener("load",this.changing)}return s(t,[{key:"change",value:function(){this.reset();for(var t=0;t<this.elements.length;t++){var e=this._getWidth(this.elements[t]);e>this.maxWidth&&(this.maxWidth=e)}this.apply()}},{key:"apply",value:function(){for(var t=0;t<this.elements.length;t++)this.elements[t].style.width=this.maxWidth+1+"px"}},{key:"reset",value:function(){for(var t=0;t<this.elements.length;t++)this.elements[t].style.width="auto";this.maxWidth=0}},{key:"_getWidth",value:function(t){var e=t.offsetWidth,n=getComputedStyle(t);return e+=parseInt(n.marginLeft)+parseInt(n.marginRight)}}]),t}();function l(t,e){var n;if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(n=function(t,e){if(!t)return;if("string"==typeof t)return f(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return f(t,e)}(t))||e&&t&&"number"==typeof t.length){n&&(t=n);var r=0,o=function(){};return{s:o,n:function(){return r>=t.length?{done:!0}:{done:!1,value:t[r++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,u=!0,a=!1;return{s:function(){n=t[Symbol.iterator]()},n:function(){var t=n.next();return u=t.done,t},e:function(t){a=!0,i=t},f:function(){try{u||null==n.return||n.return()}finally{if(a)throw i}}}}function f(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}function h(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}var y=function(){function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.closures=[],this.nexts=[],this.rendering=this.render.bind(this),this.render()}var e,n,r;return e=t,r=[{key:"add",value:function(e){return t.instance.closures.push(e),function(){var n=t.instance.closures.indexOf(e);-1!==n&&t.instance.closures.splice(n,1)}}},{key:"next",value:function(e){t.instance.nexts.push(e)}}],(n=[{key:"render",value:function(){window.requestAnimationFrame(this.rendering);var t,e=l(this.closures);try{for(e.s();!(t=e.n()).done;)t.value.call()}catch(t){e.e(t)}finally{e.f()}var n=this.nexts.slice();this.nexts.length=0;var r,o=l(n);try{for(o.s();!(r=o.n()).done;)r.value.call()}catch(t){o.e(t)}finally{o.f()}}}])&&h(e.prototype,n),r&&h(e,r),t}();function d(t,e){var n;if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(n=function(t,e){if(!t)return;if("string"==typeof t)return p(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return p(t,e)}(t))||e&&t&&"number"==typeof t.length){n&&(t=n);var r=0,o=function(){};return{s:o,n:function(){return r>=t.length?{done:!0}:{done:!1,value:t[r++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,u=!0,a=!1;return{s:function(){n=t[Symbol.iterator]()},n:function(){var t=n.next();return u=t.done,t},e:function(t){a=!0,i=t},f:function(){try{u||null==n.return||n.return()}finally{if(a)throw i}}}}function p(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}function b(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function m(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function v(t,e,n){return e&&m(t.prototype,e),n&&m(t,n),t}y.instance=new y;var g=function(){function t(e){b(this,t),this.element=e,this.collections={}}return v(t,[{key:"_add",value:function(t,e){void 0===this.collections[t]&&(this.collections[t]=new w(t,this.element)),this.collections[t].add(e)}},{key:"down",value:function(t,e,n,r){this._add("down",new k(t,e,n,r))}},{key:"up",value:function(t,e,n,r){this._add("up",new k(t,e,n,r))}},{key:"dispose",value:function(){var t,e=d(this.collections);try{for(e.s();!(t=e.n()).done;){t.value.dispose()}}catch(t){e.e(t)}finally{e.f()}this.types=null}}]),t}(),w=function(){function t(e,n){b(this,t),this.type=e,this.element=n,this.actions=[],this.binding=this.handle.bind(this),this.element.addEventListener("key"+e,this.binding)}return v(t,[{key:"add",value:function(t){this.actions.push(t)}},{key:"handle",value:function(t){var e,n=d(this.actions);try{for(n.s();!(e=n.n()).done;){e.value.handle(t)}}catch(t){n.e(t)}finally{n.f()}}},{key:"dispose",value:function(){this.element.removeEventListener("key"+this.type,this.binding),this.actions=null}}]),t}(),k=function(){function t(e,n,r,o){b(this,t),this.key=e,this.closure=n,this.preventDefault=!0===r,this.stopPropagation=!0===o}return v(t,[{key:"handle",value:function(t){t.keyCode===this.key&&(this.closure(t),this.preventDefault&&t.preventDefault(),this.stopPropagation&&t.stopPropagation())}}]),t}();function E(t){return function(t){if(Array.isArray(t))return A(t)}(t)||function(t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}(t)||S(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function O(t,e){var n;if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(n=S(t))||e&&t&&"number"==typeof t.length){n&&(t=n);var r=0,o=function(){};return{s:o,n:function(){return r>=t.length?{done:!0}:{done:!1,value:t[r++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,u=!0,a=!1;return{s:function(){n=t[Symbol.iterator]()},n:function(){var t=n.next();return u=t.done,t},e:function(t){a=!0,i=t},f:function(){try{u||null==n.return||n.return()}finally{if(a)throw i}}}}function S(t,e){if(t){if("string"==typeof t)return A(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?A(t,e):void 0}}function A(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}function j(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function x(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function T(t,e,n){return e&&x(t.prototype,e),n&&x(t,n),t}g.TAB=9,g.ESCAPE=27,g.END=35,g.HOME=36,g.LEFT=37,g.UP=38,g.RIGHT=39,g.DOWN=40;var _=['[tabindex="0"]',"a[href]","button:not([disabled])","input:not([disabled])","select:not([disabled])","textarea:not([disabled])","audio[controls]","video[controls]",'[contenteditable]:not([contenteditable="false"])',"details>summary:first-of-type","details"].join(),P=['[tabindex]:not([tabindex="-1"]):not([tabindex="0"])'].join(),I=function(t,e){if("hidden"===window.getComputedStyle(t).visibility)return!1;for(void 0===e&&(e=t);e.contains(t);){if("none"===window.getComputedStyle(t).display)return!1;t=t.parentElement}return!0},R=function(){function t(e,n){j(this,t),this.element=null,this.activeElement=null,this.onTrap=e,this.onUntrap=n,this.waiting=this.wait.bind(this),this.handling=this.handle.bind(this),this.current=null}return T(t,[{key:"trap",value:function(t){this.trapped&&this.untrap(),this.element=t,this.wait(),this.onTrap&&this.onTrap()}},{key:"wait",value:function(){I(this.element)?this.trapping():y.next(this.waiting)}},{key:"trapping",value:function(){var t=this.focusables;t.length&&t[0].focus(),this.element.addEventListener("keydown",this.handling),this.stunneds=[],this.stun(document.body)}},{key:"stun",value:function(t){var e,n=O(t.children);try{for(n.s();!(e=n.n()).done;){var r=e.value;r!==this.element&&(r.contains(this.element)?this.stun(r):this.stunneds.push(new C(r)))}}catch(t){n.e(t)}finally{n.f()}}},{key:"handle",value:function(t){if(9===t.keyCode){var e=this.focusables;if(0!==e.length){var n=e[0],r=e[e.length-1],o=e.indexOf(document.activeElement);t.shiftKey?!this.element.contains(document.activeElement)||o<1?(t.preventDefault(),r.focus()):(document.activeElement.tabIndex>0||e[o-1].tabIndex>0)&&(t.preventDefault(),e[o-1].focus()):this.element.contains(document.activeElement)&&o!==e.length-1&&-1!==o?document.activeElement.tabIndex>0&&(t.preventDefault(),e[o+1].focus()):(t.preventDefault(),n.focus())}}}},{key:"untrap",value:function(){if(this.trapped){this.element.removeEventListener("keydown",this.handling),this.element=null;var t,e=O(this.stunneds);try{for(e.s();!(t=e.n()).done;){t.value.unstun()}}catch(t){e.e(t)}finally{e.f()}this.stunneds=[],this.onUntrap&&this.onUntrap()}}},{key:"trapped",get:function(){return null!==this.element}},{key:"focusables",get:function(){var t=this,e=E(this.element.querySelectorAll(_)),n=E(this.element.querySelectorAll(P));n.sort((function(t,e){return t.tabIndex-e.tabIndex}));var r=e.filter((function(t){return-1===n.indexOf(t)}));return n.concat(r).filter((function(e){return"-1"!==e.tabIndex&&I(e,t.element)}))}}]),t}(),C=function(){function t(e){j(this,t),this.element=e,this.hidden=e.getAttribute("aria-hidden"),this.inert=e.getAttribute("inert"),this.element.setAttribute("aria-hidden",!0),this.element.setAttribute("inert","")}return T(t,[{key:"unstun",value:function(){null===this.hidden?this.element.removeAttribute("aria-hidden"):this.element.setAttribute("aria-hidden",this.hidden),null===this.inert?this.element.removeAttribute("inert"):this.element.setAttribute("inert",this.inert)}}]),t}();function N(t,e){var n;if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(n=function(t,e){if(!t)return;if("string"==typeof t)return D(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return D(t,e)}(t))||e&&t&&"number"==typeof t.length){n&&(t=n);var r=0,o=function(){};return{s:o,n:function(){return r>=t.length?{done:!0}:{done:!1,value:t[r++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,u=!0,a=!1;return{s:function(){n=t[Symbol.iterator]()},n:function(){var t=n.next();return u=t.done,t},e:function(t){a=!0,i=t},f:function(){try{u||null==n.return||n.return()}finally{if(a)throw i}}}}function D(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}function U(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}var B=[],M=function(){function t(e,n){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.id=e,this.element=n,this.members=[],this._index=-1,this._current=null,B.push(this)}var e,n,r;return e=t,r=[{key:"getGroupById",value:function(t){var e,n=N(B);try{for(n.s();!(e=n.n()).done;){var r=e.value;if(r.constructor===this&&r.id===t)return r}}catch(t){n.e(t)}finally{n.f()}return new this(t)}},{key:"getGroupByElement",value:function(t){var e,n=N(B);try{for(n.s();!(e=n.n()).done;){var r=e.value;if(r.element===t)return r}}catch(t){n.e(t)}finally{n.f()}return new this(!1,t)}},{key:"groupById",value:function(t,e){var n=t.element.getAttribute("data-rf-group");null!==n&&e.getGroupById(n).add(t)}},{key:"groupByParent",value:function(t,e,n){if(void 0===n&&(n=e.selector),""!==n)for(var r=t.element.parentElement;r;){if(r.classList.contains(t.constructor.selector))return;if(r.classList.contains(n))return void e.getGroupByElement(r).add(t);r=r.parentElement}}},{key:"selector",get:function(){return""}}],(n=[{key:"add",value:function(t){if(-1===this.members.indexOf(t))switch(this.members.push(t),t.setGroup(this),!0){case null!==this.current:case!t.disclosed:t.apply(!1,!0);break;default:this._current=t,this._index=this.members.indexOf(t),t.apply(!0,!0)}}},{key:"apply",value:function(){}},{key:"length",get:function(){return this.members.length}},{key:"index",get:function(){return this._index},set:function(t){t<-1||t>=this.length||this._index===t||(null!==this.current&&this.current.apply(!1),this._index=t,this._current=this._index>-1?this.members[this._index]:null,null!==this.current&&this.current.apply(!0),this.apply())}},{key:"current",get:function(){return this._current},set:function(t){this.index=this.members.indexOf(t)}}])&&U(e.prototype,n),r&&U(e,r),t}();function L(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}var F=function(){function t(e,n){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.element=e,this.disclosure=n,this.hasAttribute=this.element.hasAttribute(this.disclosure.attributeName),this.element.addEventListener("click",this.click.bind(this)),this.observer=new MutationObserver(this.mutate.bind(this)),this.observe()}var e,n,r;return e=t,(n=[{key:"observe",value:function(){this.observer.observe(this.element,{attributes:!0})}},{key:"click",value:function(t){this.disclosure.change(this.hasAttribute)}},{key:"mutate",value:function(t){var e=this;t.forEach((function(t){"attributes"===t.type&&t.attributeName===e.disclosure.attributeName&&e.disclosure.change(e.disclosed)}))}},{key:"apply",value:function(t){this.hasAttribute&&(this.observer&&this.observer.disconnect(),this.element.setAttribute(this.disclosure.attributeName,t),this.observer&&this.observe())}},{key:"disclosed",get:function(){return"true"===this.element.getAttribute(this.disclosure.attributeName)}}])&&L(e.prototype,n),r&&L(e,r),t}();function H(t){return function(t){if(Array.isArray(t))return W(t)}(t)||function(t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}(t)||q(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function G(t,e){var n;if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(n=q(t))||e&&t&&"number"==typeof t.length){n&&(t=n);var r=0,o=function(){};return{s:o,n:function(){return r>=t.length?{done:!0}:{done:!1,value:t[r++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,u=!0,a=!1;return{s:function(){n=t[Symbol.iterator]()},n:function(){var t=n.next();return u=t.done,t},e:function(t){a=!0,i=t},f:function(){try{u||null==n.return||n.return()}finally{if(a)throw i}}}}function q(t,e){if(t){if("string"==typeof t)return W(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?W(t,e):void 0}}function W(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}function V(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}var $=[],Y=function(){function t(e){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.element=e,this.id=e.id,this.buttons=[],this.disclosed=null,this._selector=this.constructor.selector,this.modifier=this._selector+"--"+this.type.id,this.attributeName=(this.type.aria?"aria-":"data-rf-")+this.type.id;var n=document.querySelectorAll("["+(this.type.aria?"aria-":"data-rf-")+'controls="'+this.id+'"]');if(n.length>0)for(var r=0;r<n.length;r++)this.addButton(n[r]);this.disclosed=!0===this.disclosed,this.apply(this.disclosed,!0),this.group()}var e,n,r;return e=t,r=[{key:"build",value:function(t){var e,n=G(H(t.querySelectorAll(".".concat(this.selector))));try{for(n.s();!(e=n.n()).done;){var r=e.value;$.push(new this(r))}}catch(t){n.e(t)}finally{n.f()}}},{key:"type",get:function(){return null}},{key:"selector",get:function(){return""}}],(n=[{key:"group",value:function(){M.groupById(this,this.GroupConstructor),M.groupByParent(this,this.GroupConstructor)}},{key:"addButton",value:function(t){var e=this.buttonFactory(t);e.hasAttribute&&(null===this.disclosed?this.disclosed=e.disclosed:e.apply(this.disclosed)),this.buttons.push(e)}},{key:"buttonFactory",value:function(t){return new F(t,this)}},{key:"disclose",value:function(){this.disclosed||(void 0!==this.group&&(this.group.current=this),this.apply(!0))}},{key:"conceal",value:function(){this.disclosed&&(void 0!==this.group&&(this.group.current=null),this.apply(!1))}},{key:"apply",value:function(t,e){this.disclosed=t,t?Object(i.a)(this.element,this.modifier):Object(i.b)(this.element,this.modifier);for(var n=0;n<this.buttons.length;n++)this.buttons[n].apply(t);if(!t){var r,o=G($);try{for(o.s();!(r=o.n()).done;){var u=r.value;u!==this&&this.element.contains(u.element)&&u.reset()}}catch(t){o.e(t)}finally{o.f()}}}},{key:"reset",value:function(){}},{key:"change",value:function(t){if(this.constructor.type.canConceal)switch(!0){case!t:case this.disclosed:this.conceal();break;default:this.disclose()}else this.disclose()}},{key:"setGroup",value:function(t){this.group=t}},{key:"focus",value:function(){for(var t=0;t<this.buttons.length;t++){var e=this.buttons[t];if(e.hasAttribute)return void e.element.focus()}}},{key:"type",get:function(){return this.constructor.type}},{key:"GroupConstructor",get:function(){return M}},{key:"hasFocus",get:function(){return this.element===document.activeElement||this.element.querySelectorAll(":focus").length>0||!!this.buttons.some((function(t){return t.hasFocus}))}}])&&V(e.prototype,n),r&&V(e,r),t}();function z(t){return(z="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function J(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function K(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function Q(t,e){return(Q=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function X(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=tt(t);if(e){var o=tt(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return Z(this,n)}}function Z(t,e){return!e||"object"!==z(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function tt(t){return(tt=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}Y.TYPES={expand:{id:"expanded",aria:!0,canConceal:!0},select:{id:"selected",aria:!0,canConceal:!1},open:{id:"opened",aria:!1,canConceal:!0}};var et=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&Q(t,e)}(i,t);var e,n,r,o=X(i);function i(){return J(this,i),o.apply(this,arguments)}return e=i,(n=[{key:"hasFocus",get:function(){return this.element===document.activeElement}}])&&K(e.prototype,n),r&&K(e,r),i}(F);function nt(t){return(nt="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function rt(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function ot(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function it(t,e){return(it=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function ut(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=st(t);if(e){var o=st(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return at(this,n)}}function at(t,e){return!e||"object"!==nt(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function st(t){return(st=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var ct={},lt=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&it(t,e)}(i,t);var e,n,r,o=ut(i);function i(){return rt(this,i),o.apply(this,arguments)}return e=i,r=[{key:"register",value:function(t,e){ct[t]=e}},{key:"ascendants",get:function(){return ct}}],(n=[{key:"hasFocus",get:function(){return void 0===this.current?null:this.current.hasFocus}}])&&ot(e.prototype,n),r&&ot(e,r),i}(M);function ft(t){return(ft="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function ht(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function yt(t,e,n){return(yt="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function(t,e,n){var r=function(t,e){for(;!Object.prototype.hasOwnProperty.call(t,e)&&null!==(t=vt(t)););return t}(t,e);if(r){var o=Object.getOwnPropertyDescriptor(r,e);return o.get?o.get.call(n):o.value}})(t,e,n||t)}function dt(t,e){return(dt=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function pt(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=vt(t);if(e){var o=vt(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return bt(this,n)}}function bt(t,e){return!e||"object"!==ft(e)&&"function"!=typeof e?mt(t):e}function mt(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function vt(t){return(vt=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var gt=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&dt(t,e)}(i,t);var e,n,r,o=pt(i);function i(t){var e;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,i),e=o.call(this,t),t.addEventListener("transitionend",e.transitionend.bind(mt(e))),e}return e=i,r=[{key:"type",get:function(){return Y.TYPES.expand}},{key:"selector",get:function(){return"rf-collapse"}}],(n=[{key:"group",value:function(){for(var t in lt.ascendants)for(var e=this.element.parentElement;e;){if(e.classList.contains(t))return void("string"==typeof lt.ascendants[t]?M.groupByParent(this,lt,lt.ascendants[t]):M.groupByParent(this,lt.ascendants[t]));e=e.parentElement}yt(vt(i.prototype),"group",this).call(this)}},{key:"buttonFactory",value:function(t){return new et(t,this)}},{key:"transitionend",value:function(t){this.disclosed||(this.element.style.maxHeight="")}},{key:"apply",value:function(t,e){var n=this;t&&(this.element.style.maxHeight="none"),this.element.style.setProperty("--collapser","none");var r=this.element.offsetHeight;this.element.style.setProperty("--collapse",-r+"px"),this.element.style.setProperty("--collapser",""),window.requestAnimationFrame((function(){return yt(vt(i.prototype),"apply",n).call(n,t,e)}))}},{key:"reset",value:function(){this.apply(!1)}},{key:"GroupConstructor",get:function(){return lt}},{key:"buttonHasFocus",get:function(){return!!this.buttons.some((function(t){return t.hasFocus}))}},{key:"hasFocus",get:function(){return this.element===document.activeElement||this.element.querySelectorAll(":focus").length>0||this.buttonHasFocus}}])&&ht(e.prototype,n),r&&ht(e,r),i}(Y);function wt(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}var kt=function(){function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.init()}var e,n,r;return e=t,(n=[{key:"init",value:function(){gt.build(document)}}])&&wt(e.prototype,n),r&&wt(e,r),t}()},1:function(t,e,n){"use strict";n.d(e,"a",(function(){return o})),n.d(e,"b",(function(){return i}));var r=function(t,e,n){"."===e.charAt(0)&&(e=e.substr(1));var r=t.className.split(" "),o=r.indexOf(e);!0===n?o>-1&&r.splice(o,1):-1===o&&r.push(e),t.className=r.join(" ")},o=function(t,e){return r(t,e)},i=function(t,e){return r(t,e,!0)}},2:function(t,e,n){"use strict";t.exports=function(t){var e=[];return e.toString=function(){return this.map((function(e){var n=function(t,e){var n=t[1]||"",r=t[3];if(!r)return n;if(e&&"function"==typeof btoa){var o=(u=r,a=btoa(unescape(encodeURIComponent(JSON.stringify(u)))),s="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(a),"/*# ".concat(s," */")),i=r.sources.map((function(t){return"/*# sourceURL=".concat(r.sourceRoot||"").concat(t," */")}));return[n].concat(i).concat([o]).join("\n")}var u,a,s;return[n].join("\n")}(e,t);return e[2]?"@media ".concat(e[2]," {").concat(n,"}"):n})).join("")},e.i=function(t,n,r){"string"==typeof t&&(t=[[null,t,""]]);var o={};if(r)for(var i=0;i<this.length;i++){var u=this[i][0];null!=u&&(o[u]=!0)}for(var a=0;a<t.length;a++){var s=[].concat(t[a]);r&&o[s[0]]||(n&&(s[2]?s[2]="".concat(n," and ").concat(s[2]):s[2]=n),e.push(s))}},e}},3:function(t,e,n){"use strict";var r=n(0);new r.h(".rf-collapse",[r.a])},35:function(t,e,n){"use strict";n.r(e);n(36),n(5)},36:function(t,e,n){(e=n(2)(!1)).push([t.i,"",""]),t.exports=e},4:function(t,e,n){"use strict";var r=n(0);function o(t){return(o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function u(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function a(t,e,n){return(a="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function(t,e,n){var r=function(t,e){for(;!Object.prototype.hasOwnProperty.call(t,e)&&null!==(t=f(t)););return t}(t,e);if(r){var o=Object.getOwnPropertyDescriptor(r,e);return o.get?o.get.call(n):o.value}})(t,e,n||t)}function s(t,e){return(s=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function c(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=f(t);if(e){var o=f(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return l(this,n)}}function l(t,e){return!e||"object"!==o(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function f(t){return(f=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var h=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&s(t,e)}(h,t);var e,n,o,l=c(h);function h(){return i(this,h),l.apply(this,arguments)}return e=h,o=[{key:"selector",get:function(){return"rf-accordions-group"}}],(n=[{key:"_attachEvents",value:function(){this.keyEvents=new r.i(this.element),this.keyEvents.down(r.i.DOWN,this.arrowDownPress.bind(this),!0,!0),this.keyEvents.down(r.i.UP,this.arrowUpPress.bind(this),!0,!0),this.keyEvents.down(r.i.HOME,this.homePress.bind(this),!0,!0),this.keyEvents.down(r.i.END,this.endPress.bind(this),!0,!0)}},{key:"arrowDownPress",value:function(){var t=this.focusIndex;-1!==t&&(++t>=this.length&&(t=0),this.members[t].focus())}},{key:"arrowUpPress",value:function(){var t=this.focusIndex;-1!==t&&(--t<0&&(t=this.length-1),this.members[t].focus())}},{key:"homePress",value:function(){-1!==this.focusIndex&&this.members[0].focus()}},{key:"endPress",value:function(){-1!==this.focusIndex&&this.members[this.length-1].focus()}},{key:"apply",value:function(){a(f(h.prototype),"apply",this).call(this),null!==this.current&&this.current.focus()}},{key:"focusIndex",get:function(){for(var t=0;t<this.members.length;t++)if(this.members[t].buttonHasFocus)return t;return-1}}])&&u(e.prototype,n),o&&u(e,o),h}(r.b);r.b.register("rf-accordion",h)},5:function(t,e,n){"use strict";var r=n(0);function o(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}var i=function(){function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.init()}var e,n,r;return e=t,(n=[{key:"init",value:function(){var e=this;this.scheme=localStorage.getItem("scheme")?localStorage.getItem("scheme"):null,null===this.scheme&&(window.matchMedia("(prefers-color-scheme: dark)").matches?(this.scheme="dark",localStorage.setItem("scheme","dark")):this.scheme="light"),this.root=document.documentElement,"dark"===this.scheme?this.root.hasAttribute(t.TRANSITION_ATTRIBUTE)?(this.root.removeAttribute(t.TRANSITION_ATTRIBUTE),this.root.setAttribute(t.SCHEME_ATTRIBUTE,"dark"),setTimeout((function(){e.root.setAttribute(t.TRANSITION_ATTRIBUTE,"")}),300)):this.root.setAttribute(t.SCHEME_ATTRIBUTE,"dark"):this.root.setAttribute(t.SCHEME_ATTRIBUTE,"light"),this.observer=new MutationObserver(this.mutate.bind(this)),this.observer.observe(this.root,{attributes:!0})}},{key:"mutate",value:function(e){var n=this;e.forEach((function(e){if("attributes"===e.type&&e.attributeName===t.SCHEME_ATTRIBUTE){var r=n.root.getAttribute(t.SCHEME_ATTRIBUTE);"dark"===r?localStorage.setItem("scheme","dark"):"light"===r&&localStorage.setItem("scheme","light")}}))}}])&&o(e.prototype,n),r&&o(e,r),t}();i.SCHEME_ATTRIBUTE="data-rf-theme",i.TRANSITION_ATTRIBUTE="data-rf-transition",new r.h(":root["+i.SCHEME_ATTRIBUTE+"]",[i]);n(3),n(4);function u(t){return(u="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function a(t,e){return(a=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function s(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=l(t);if(e){var o=l(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return c(this,n)}}function c(t,e){return!e||"object"!==u(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function l(t){return(l=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function f(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function h(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function y(t,e,n){return e&&h(t.prototype,e),n&&h(t,n),t}var d=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&a(t,e)}(n,t);var e=s(n);function n(t,r,o,i){var u;return f(this,n),(u=e.call(this,t)).attributeName=r,u.checkedValue=o,u.uncheckedValue=i,u}return y(n,[{key:"init",value:function(){this.observer=new MutationObserver(this.mutate.bind(this)),this.observer.observe(document.documentElement,{attributes:!0}),this.checkbox.checked=this.state}},{key:"mutate",value:function(t){var e=this;t.forEach((function(t){"attributes"===t.type&&t.attributeName===e.attributeName&&(e.checkbox.checked=e.state)}))}},{key:"change",value:function(){var t=this.checkbox.checked?this.checkedValue:this.uncheckedValue;switch(t){case null:document.documentElement.removeAttribute(this.attributeName);break;case!0:document.documentElement.setAttribute(this.attributeName,"");break;default:document.documentElement.setAttribute(this.attributeName,t)}}},{key:"state",get:function(){var t=document.documentElement.getAttribute(this.attributeName),e=document.documentElement.hasAttribute(this.attributeName);switch(!0){case this.checkedValue===t:return!0;case this.uncheckedValue===t:return!1;case!0===this.checkedValue&&e:case!0===this.uncheckedValue&&e:return!0}return!1}}]),n}(function(){function t(e){f(this,t),this.checkbox=document.getElementById(e),this.init(),this.checkbox.addEventListener("change",this.change.bind(this))}return y(t,[{key:"init",value:function(){}},{key:"change",value:function(){}}]),t}());new d("theme-checkbox","data-rf-theme","dark","light"),new d("reset-checkbox","data-rf-reset",!0,null)}});
//# sourceMappingURL=inputs.cbb672d9.js.map