/**
 * @overview runtime environment for <i>ccm</i> components
 * @author André Kless <andre.kless@web.de> 2014-2016
 * @copyright Copyright (c) 2014-2016 André Kless
 * @license
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software
 * and associated documentation files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, publish, distribute, sublicense, and/or sell
 * (<b>NOT MODIFY OR MERGE</b>) copies of the Software, and to permit persons to whom the Software is furnished
 * to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
 * LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * All rights that the author André Kless do not expressly grant in these Terms are reserved by the author André Kless.
 * @version latest (5.8.0)
 * @changes
 * version 5.8.0 (07.03.2016):
 * - ccm.helper.html supports double click event
 * version 5.7.1 (06.03.2016):
 * - bugfix when instance choose self.element = 'name'
 * - bugfix in ccm.helper.format
 * version 5.7.0 (28.02.2016):
 * - ccm loading icon animation witout image file (css only) and transparent background
 * version 5.6.3 (21.02.2016):
 * - bugfix for crossdomain HTML loading via loadHTML()
 * version 5.6.2 (21.02.2016):
 * - bugfix for default ccm instance configuration parameter in ccm.component()
 * version 5.6.1 (20.02.2016):
 * - remove remote flag
 * version 5.6.0 (18.02.2016):
 * - delete component init function after one-time call
 * - some refactoring in ccm instance initialisation algorithm
 * - add helper function 'ccm.helper.getElementID'
 * version 5.5.1 (10.02.2016):
 * - bugfix for components with a version number
 * version 5.5.0 (08.02.2016):
 * - search from a inner website area in ccm.helper.find
 * version 5.4.0 (31.01.2016):
 * - add default ccm instance configuration parameter for ccm.component()
 * version 5.3.1 (29.01.2016):
 * - bugfix in ccm.helper.format
 * version 5.3.0 (29.01.2016):
 * - add helper function 'find'
 * version 5.2.0 (25.01.2016):
 * - little optimisation of initialisation algorithm
 * - add helper function 'isProxy'
 * - ccm.helper.html supports blur event
 * version 5.1.0 (24.01.2016):
 * - ccm.load supports parallel-serial loading
 * - add helper function 'isObject'
 * - use of typeof operator without brackets
 * version 5.0.1 (23.01.2016):
 * - add helper functions 'getCursor' and 'isInDOM'
 * version 5.0.0 (23.01.2016):
 * - update initialisation algorithm of ccm instances
 * - new ready callback for ccm instances
 * - rename function 'ccm.register' to 'ccm.component' (incompatible change)
 * - remove no more needed function 'ccm.context.user' (incompatible change)
 * - add function 'ccm.helper.isElement'
 * - update function 'ccm.context.find'
 * (for older version changes see ccm-4.1.0.js)
 */
window.jQuery||(document.body?(window.jQuery=document.createElement("script"),window.jQuery.setAttribute("src","./lib/jquery.min.js"),document.head.appendChild(window.jQuery)):document.write('<script src="./lib/jquery.min.js"></script>')),document.body?(window.ccm=document.createElement("style"),window.ccm.appendChild(document.createTextNode("@keyframes ccm_loading { to { transform: rotate(360deg); } }")),document.head.appendChild(window.ccm)):document.write("<style>@keyframes ccm_loading { to { transform: rotate(360deg); } }</style>"),ccm=function(){function e(e){if(-1===e.indexOf(".js"))return e;var n=e.split("/").pop();return n.substr(0,n.lastIndexOf("."))}function n(e){var n=JSON.stringify(e);return"{}"===n&&(n=Object.keys(i).length),n}var t,c={},r={},i={},o={},a=function(){function e(e,t){function c(){function n(){i--,0===i&&t&&t(c)}var c=[],i=1;for(var o in p.local)if(ccm.helper.isSubset(e,p.local[o])){var a=ccm.helper.clone(p.local[o]);c.push(a),i++,r(a,n)}return n(),c}function r(e,t){function c(e,t){return null===i[n(e[t][1])]?a.push([c,e,t]):(o++,void ccm.helper.solveDependency(e,t,r))}function r(){return o--,0===o?a.length>0?ccm.helper.action(a.pop()):void(t&&t(e)):void 0}var o=1,a=[];for(var s in e){var u=e[s];if(ccm.helper.isDependency(u))c(e,s);else if(jQuery.isArray(u))for(var l=0;l<u.length;l++)ccm.helper.isDependency(u[l])&&c(u,l)}r()}if(void 0===e||jQuery.isPlainObject(e))return c();var o=p.local[e]?ccm.helper.clone(p.local[e]):null;return r(o,t),o}function c(n,t){return p.local[n.key]?ccm.helper.integrate(n,p.local[n.key]):p.local[n.key]=n,e(n.key,t)}function r(e,n){var t;return void 0===e?(t=p.local,p.local={}):(t=p.local[e],delete p.local[e]),n&&n(t),t}function o(){var e=t.transaction([p.store],"readwrite");return e.objectStore(p.store)}function a(e,n,t){return n=n||p.user,ccm.helper.integrate(e,{db:p.db,store:p.store,username:"object"==typeof n?n.key:n,password:t||p.password})}function s(e,n){f.push(n),e.callback=f.length,p.socket.send(JSON.stringify(e))}function u(e,n){ccm.load([p.url,e],n)}function l(e,n){return"string"==typeof e&&0===e.indexOf("[ccm]")?(ccm.helper.isInstance(n)&&n.logout(),!1):!0}var f=[],p=this;this.init=function(){p.socket&&(p.socket.onmessage=function(e){if(e=JSON.parse(e.data),e.callback)f[e.callback-1](e.data);else{var n=jQuery.isPlainObject(e)?c(e):r(e);p.onChange&&p.onChange(n,e)}})},this.get=function(n,t,c,r){function i(){return e(n,t)}function f(){var e=d();if(e)return e;var c=o(),r=c.get(n);r.onsuccess=function(e){var c=e.target.result;return c?(void 0!==c.key&&(p.local[n]=c),void(t&&t(c))):t(null)}}function m(){function e(e){if(l(e,c)){if(!e)return t(null);if(ccm.helper.isDataset(e))p.local[e.key]=e;else for(var n=0;n<e.length;n++)void 0!==e[n].key&&(p.local[e[n].key]=e[n]);t(e)}}if(!jQuery.isPlainObject(n)){var i=d();if(i)return i}var o=a({key:n},c,r);p.socket?s(o,e):u(o,e)}function d(){var c=e(n);return c&&t&&t(c),c}return"function"==typeof n&&(r=c,c=t,t=n,n={}),void 0===n&&(n={}),p.url?m():p.store?f():p.local?i():void 0},this.set=function(e,n,t,r){function i(){return c(e,n)}function f(){var n=o(),t=n.put(e);t.onsuccess=i}function m(){function n(n){l(n,t)&&(e=n,i())}var c=a({dataset:e},t,r);p.socket?s(c,n):u(c,n)}return e.key||(e.key=ccm.helper.generateKey()),p.url?m():p.store?f():p.local?i():void 0},this.del=function(e,n,t,c){function i(){return r(e,n)}function f(){var n=o(),t=n["delete"](e);t.onsuccess=i}function m(){function r(e){l(e,t)&&(n&&n(e),n=void 0,i())}var o=a({del:e},t,c);p.socket?s(o,r):u(o,r)}return p.url?m():p.store?f():p.local?i():void 0},this.count=function(e,n,t){function c(){var n=Object.keys(p.local).length;return e&&e(n),n}function r(){if(!e)return-1;var n=o(),t=n.count();return t.onsuccess=function(){e(t.result)},-1}function i(){function c(t){l(t,n)&&e&&e(t)}if(!e)return-1;var r=a({count:!0},n,t);return p.socket?s(r,c):u(r,c),-1}return p.url?i():p.store?r():p.local?c():void 0},this.clear=function(){p.local={}}};return{callback:{},loading_icon:"./img/ccm-load-icon.gif",version:[5,8,0],load:function(){function n(n,s){function l(e){if(null!==e&&a[s].push(e),n.length>0){var c=n.shift();!Array.isArray(c)||c.length>1&&ccm.helper.isObject(c[1])?ccm.load(c,l):(c.push(l),ccm.load.apply(null,c))}else t()}function p(){if(!g()){if(0!==n.indexOf("http"))return jQuery.ajax({url:n,cache:!1,dataType:"html",crossDomain:!0,success:j});var e=n.split("/").pop();ccm.callback[e]=j,jQuery("head").append('<script src="'+n+'"></script>')}}function m(){Q||jQuery("head").append('<link rel="stylesheet" type="text/css" href="'+n+'">'),k()}function d(){Q||jQuery('<img src="'+n+'">'),k()}function h(){g()||jQuery.getScript(n,b).fail(x)}function y(){if(!g()){if(0!==n.indexOf("http"))return jQuery.getJSON(n,j).fail(x);var e=n.split("/").pop();ccm.callback[e]=j,jQuery("head").append('<script src="'+n+'"></script>')}}function v(){f||(0===n.indexOf("http")?jQuery.ajax({url:n,data:w,dataType:"jsonp",username:w&&w.username?w.username:void 0,password:w&&w.password?w.password:void 0,success:j}):jQuery.ajax({url:n,data:w,username:w&&w.username?w.username:void 0,password:w&&w.password?w.password:void 0,success:j}).fail(x))}function g(){return null===Q?f?!0:(f=!0,o[n]||(o[n]=[]),o[n].push(u),!0):Q?(a[s]=r[n]=Q,k(),!0):!1}function b(){var t=e(n),i=c[t];if(!i)return k();for(a[s]=r[n]=i;o[i.index]&&o[i.index].length>0;)ccm.helper.action(o[i.index].pop());k()}function j(e){a[s]=r[n]=e,k()}function k(){for(r[n]||(r[n]=n);o[n]&&o[n].length>0;)ccm.helper.action(o[n].pop());t()}function x(e,n,t){console.log(e,this.url),jQuery("body").html(e.responseText+"<p>Request Failed: "+n+", "+t+"</p>")}var w;if(jQuery.isArray(n)){if(!(n.length>1&&ccm.helper.isObject(n[1])))return i++,a[s]=[],l(null);w=n[1],n=n[0]}var Q=r[n];if(r[n]=null,i++,w)return v();var O=n.split(".").pop();switch(O){case"html":return p();case"css":return m();case"jpg":case"gif":case"png":case"svg":return d();case"js":return h();case"json":return y();default:v()}}function t(){return i--,0===i?(a.length<=1&&(a=a[0]),l&&l(a),a):void 0}var i=1,a=[],s=Array.prototype.slice.call(arguments),u=s.slice(0);u.unshift(ccm.load);var l,f=!1;("function"==typeof s[s.length-1]||void 0===s[s.length-1])&&(l=s.pop());for(var p=0;p<s.length;p++)n(s[p],p);return t()},component:function(e,n,t){function r(){t&&t(e)}function i(){if(e.index){var n=e.index.split("-");e.name=n[0],n.length>1&&(e.version=n[1].split("."));for(var t=0;3>t;t++)e.version[t]=parseInt(e.version[t])}e.index=e.name,e.version&&(e.index+="-"+e.version.join("."))}function o(){e.instances=0,e.instance=function(n,t){return ccm.instance(e.index,n,t)},e.render=function(n,t){return ccm.render(e.index,n,t)},ccm.helper.integrate(n,e.config),e.config||(e.config={}),e.config.element||(e.config.element=jQuery("body"))}return"function"==typeof n&&(t=n,n=void 0),"string"==typeof e?ccm.load(e,function(e){ccm.helper.integrate(n,e.config),t&&t(e)}):(i(),c[e.index]?c[e.index]:(o(),c[e.index]=e,void(e.init?(e.init(r),delete e.init):r())))},instance:function(n,t,r){function i(n,t,s,u,l){function f(){function e(e){function n(e){function c(e,n){function c(c){e[n]=c,t()}function r(e,n,t,c,r){function i(n){t[c]={component:e,parent:r,render:function(r){delete this.component,delete this.render,n||(n={}),ccm.helper.integrate(this,n),ccm.render(e,n,function(e){t[c]=e,r&&r()})}}}ccm.helper.isDependency(n)?ccm.dataset(n[1],n[2],i):i(n)}var o=e[n];switch(o[0]){case ccm.load:case"ccm.load":a++,ccm.load(o[1],c);break;case ccm.component:case"ccm.component":a++,ccm.component(o[1],o[2],c);break;case ccm.instance:case"ccm.instance":i(o[1],o[2],e,n,m);break;case ccm.proxy:case"ccm.proxy":r(o[1],o[2],e,n,m);break;case ccm.store:case"ccm.store":a++,ccm.store(o[1],c);break;case ccm.dataset:case"ccm.dataset":a++,ccm.dataset(o[1],o[2],c)}}for(var r in e){var o=e[r];if(ccm.helper.isDependency(o))c(e,r);else if("object"==typeof o&&null!==o){if(ccm.helper.isElement(o)||ccm.helper.isInstance(o)||ccm.helper.isComponent(o))continue;n(o)}}}function t(){return a--,0===a&&f(o,function(){r&&r(o)}),0===a?o:null}function f(e,n){function t(e){ccm.helper.isInstance(e)&&i.push(e);for(var n in e){var c=e[n];if(ccm.helper.isInstance(c)&&"parent"!==n&&!ccm.helper.isProxy(c))t(c);else if("object"==typeof c&&null!==c){if(ccm.helper.isElement(c)||ccm.helper.isInstance(c)||ccm.helper.isComponent(c))continue;t(c)}}}function c(){if(o===i.length)return r();var e=i[o];o++,e.init?(e.init(c),delete e.init):c()}function r(){if(0===i.length)return n();var e=i.pop();e.ready?(e.ready(r),delete e.ready):r()}var i=[];t(e);var o=0;c()}var m=new c[p].Instance;switch(c[p].instances++,s&&(s[u]=m),l&&(m.parent=l),o||(o=m),m.id=c[p].instances,m.index=p+"-"+m.id,m.component=c[p],ccm.helper.integrate(c[p].config,m),e&&ccm.helper.integrate(e,m),m.element){case"name":m.element=ccm.helper.find(l,"."+m.component.name);break;case"parent":m.element=l.element}return n(m),t()}return ccm.helper.isDependency(t)?ccm.dataset(t[1],t[2],e):e(t)}var p=e(n);return a++,c[p]?f():ccm.load(n,f)}"function"==typeof t&&(r=t,t=void 0);var o,a=0;return i(n,t)},render:function(e,n,t){ccm.instance(e,n,function(e){e.render(function(){t&&t(e)})})},store:function(e,c){function r(n){function r(n){function c(e){var n=indexedDB.open("ccm");n.onsuccess=function(){t=this.result,e()}}function r(){function c(n){var c=parseInt(localStorage.getItem("ccm"));c||(c=1),t.close();var r=indexedDB.open("ccm",c+1);r.onupgradeneeded=function(){t=this.result,localStorage.setItem("ccm",t.version),t.createObjectStore(e.store,{keyPath:"key"})},r.onsuccess=n}t.objectStoreNames.contains(e.store)?n():c(n)}t?r():c(r)}function s(){function n(){return t.init(),i[o]=t,c&&c(t),t}var t=new a;return ccm.helper.integrate(e,t),t.url&&0===t.url.indexOf("ws")?(t.socket=new WebSocket(t.url,"ccm"),void(t.socket.onopen=function(){this.send([t.db,t.store]),n()})):n()}return e.local=n,e.store&&!e.url?r(s):s()}"function"==typeof e&&(c=e,e=void 0),e||(e={}),"string"==typeof e&&(e={local:e}),e=ccm.helper.clone(e);var o=n(e);return i[o]?(c&&c(i[o]),i[o]):(e.local||(e.local={}),"string"==typeof e.local?ccm.load(e.local,r):r(e.local))},dataset:function(e,n,t,c,r){ccm.store(e,function(e){e.get(n,t,c,r)})},context:{find:function(e,n){for(var t=e;e=e.parent;)if(e[n]&&e[n]!==t)return e[n]},root:function(e){for(;e.parent;)e=e.parent;return e}},helper:{action:function(e,n){return"function"==typeof e?e():("object"!=typeof e&&(e=e.split(" ")),"function"==typeof e[0]?e[0].apply(window,e.slice(1)):0===e[0].indexOf("this.")?this.executeByName(e[0].substr(5),e.slice(1),n):this.executeByName(e[0],e.slice(1)))},clone:function(e,n){return"object"==typeof e?jQuery.extend(!n,{},e):void 0},dataset:function(e,n){e.store.get(e.key,function(t){function c(t){e.key=t.key,n&&n(t)}null===t?e.store.set({key:e.key},c):c(t)})},element:function(e){ccm.helper.reselect(e);var n=e.component.name;jQuery.isArray(e.classes)&&(e.classes=e.classes.join(" ")),e.element.html('<div id="ccm-'+e.index+'" class="ccm '+(e.classes?e.classes:"ccm-"+n)+'"></div>');var t=e.element.find('div[id="ccm-'+e.index+'"]');return ccm.helper.loading(t),t},executeByName:function(e,n,t){t||(t=window);var c=e.split(".");e=c.pop();for(var r=0;r<c.length;r++)t=t[c[r]];return t[e].apply(t,n)},filter:function(e,n){e=ccm.helper.clone(e);for(var t in e)e[t]===n[t]&&delete e[t]},find:function(e,n,t){return"string"==typeof n&&(t=n,n=void 0),n||(n=e.element),n.find(t+":not(.ccm, #ccm-"+e.index+" .ccm *)")},focusInput:function(e,n){e=e.get(0),void 0===n&&(n=e.value.length),e.selectionStart=e.selectionEnd=n,e.focus()},format:function(e,n){var t=[[],[]];e=JSON.stringify(e,function(e,n){return"function"==typeof n?(t[0].push(n),"%f0"):n});for(var c=1;c<arguments.length;c++)if("function"==typeof arguments[c]&&(t[1].push(arguments[c]),arguments[c]="%f1"),"object"==typeof arguments[c])for(var r in arguments[c])"function"==typeof arguments[c][r]&&(t[1].push(arguments[c][r]),arguments[c][r]="%f1"),"string"==typeof arguments[c][r]&&(arguments[c][r]=arguments[c][r].replace(/"/g,"'")),e=e.replace(new RegExp("%"+r,"g"),arguments[c][r]);else"string"==typeof arguments[c]&&(arguments[c]=arguments[c].replace(/"/g,"'")),e=e.replace(/%s/,arguments[c]);return JSON.parse(e,function(e,n){return"%f0"===n?t[0].shift():"%f1"===n?t[1].shift():n})},formData:function(e){e.find("input[type=checkbox]").each(function(){var e=jQuery(this);e.is(":checked")||(e.attr("data-input",e.attr("value")),e.attr("value","")),e.prop("checked",!0)});var n=e.serializeArray();e.find('input[type=checkbox][value=""]').each(function(){var e=jQuery(this);e.prop("checked",!1),e.attr("value",e.attr("data-input")),e.removeAttr("data-input")});for(var t={},c=0;c<n.length;c++)t[n[c].name]=n[c].value;return t},generateKey:function(){return Date.now()+"X"+Math.random().toString().substr(2)},getCursor:function(e){return e.get(0).selectionStart},getElementID:function(e){return"ccm-"+e.index},html:function(e,n){if(arguments.length>1&&(e=ccm.helper.format.apply(this,arguments)),jQuery.isArray(e)){for(var t=[],c=0;c<e.length;c++)t.push(ccm.helper.html(e[c]));return t}if("string"==typeof e&&(e=ccm.helper.val(e)),"object"!=typeof e)return e;var r=jQuery("<"+ccm.helper.val(e.tag||"div","tag")+">");delete e.tag;for(var i in e){var o=e[i];switch(i){case"checked":case"disabled":case"readonly":case"required":case"selected":o&&"undefined"!==o&&"false"!==o&&r.prop(i,!0);break;case"inner":r.html(this.html(o));break;case"onblur":r.blur(o);break;case"onchange":r.change(o);break;case"onclick":r.click(o);break;case"ondblclick":r.dblclick(o);break;case"oninput":r.on("input",o);break;case"onmouseenter":r.mouseenter(o);break;case"onsubmit":r.submit(o);break;default:r.attr(i,ccm.helper.val(o))}}return r},htmlEncode:function(e,n,t){return"string"!=typeof e&&(e=e.toString()),e=n||void 0===n?e.trim():e,e=jQuery("<div>").text(e).html(),e=t||void 0===t?e.replace(/"/g,"&quot;"):e},htmlDecode:function(e){return jQuery("<div>").html(e).text()},integrate:function(e,n){if(!e)return n;if(!n)return e;for(var t in e)void 0!==e[t]?n[t]=e[t]:delete n[t];return n},isComponent:function(e){return"object"==typeof e&&null!==e&&e.Instance&&!0},isDataset:function(e){return"object"==typeof e&&!jQuery.isArray(e)&&null!==e},isDependency:function(e){if(jQuery.isArray(e)&&e.length>0)switch(e[0]){case ccm.load:case"ccm.load":case ccm.component:case"ccm.component":case ccm.instance:case"ccm.instance":case ccm.proxy:case"ccm.proxy":case ccm.render:case"ccm.render":case ccm.store:case"ccm.store":case ccm.dataset:case"ccm.dataset":return!0}return!1},isElement:function(e){return e instanceof jQuery},isInDOM:function(e){return ccm.helper.tagExists(jQuery("#ccm-"+e.index))},isInstance:function(e){return"object"==typeof e&&null!==e&&e.component&&!0},isObject:function(e){return"object"==typeof e&&null!==e&&!Array.isArray(e)},isProxy:function(e){return ccm.helper.isInstance(e)&&"string"==typeof e.component},isSubset:function(e,n){for(var t in e)if("object"==typeof e[t]&&"object"==typeof n[t]){if(JSON.stringify(e[t])!==JSON.stringify(n[t]))return!1}else if(e[t]!==n[t])return!1;return!0},loading:function(e){(e?e:jQuery("body")).html(jQuery("<div>").css({display:"inline-block",width:"0.5em",height:"0.5em",border:"0.15em solid #009ee0","border-right-color":"transparent","border-radius":"50%",animation:"ccm_loading 1s linear infinite"}))},noScript:function(e){var n=jQuery("<div>").html(e);return n.find("script").remove(),n.html()},regex:function(e){switch(e){case"key":return/^[a-z_0-9][a-zA-Z_0-9]*$/;case"tag":return/^[a-z][a-zA-Z]*$/;case"url":return/^(((http|ftp|https):\/\/)?[\w-]+(\.[\w-]*)+)?([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?$/}},reselect:function(e){e.element&&(e.element=jQuery(e.element.selector))},solveDependency:function(e,n,t){return e[n].push(function(c){e[n]=c,t(c)}),ccm.helper.action(e[n])},tagExists:function(e){return e.closest("html").length>0},val:function(e,n){return n?n===!0?ccm.helper.htmlEncode(e):("string"==typeof n?ccm.helper.regex(n):n).test(e)?e:null:ccm.helper.noScript(e)},wait:function(e,n){window.setTimeout(n,e)}}}}();