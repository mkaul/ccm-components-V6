ccm.component({name:"lang",config:{element:"parent",langmenu:[ccm.instance,".http://mkaul.github.io/ccm-components/resources/langmenu/langmenu.js",{lang:null}],store:[ccm.store,".http://mkaul.github.io/ccm-components/resources/lang/lang.json"]},Instance:function(){function t(){return n.language?n.language.toLowerCase():n.component.getLanguage(n.element)}var n=this;this.ready=function(t){n.langmenu&&n.langmenu.addObserver(function(){n.render()}),t&&t()},this.render=function(t,e){ccm.helper.reselect(n),"string"==typeof t&&(e=t,t=void 0);var a=e?n.element.find(e):n.element;a.find("*:not(.ccm, #"+a.attr("id")+" > .ccm .ccm *)").andSelf().each(function(){function t(){function t(t,n){t=t.substr("lang#".length)+(n?"-"+n:"");var e=a.attr("data-lang");a.attr("data-lang",e?e+" "+t:t)}0===a.html().indexOf("lang#")&&""!==a.attr("data-lang-content")&&t(a.html());for(var n=0;n<a.context.attributes.length;n++){var e=a.context.attributes[n];0===e.value.indexOf("lang#")&&""!==a.attr("data-lang-"+e.name)&&t(e.value,e.name)}}function e(){for(var t=a.attr("data-lang"),n=t.split(" "),e=0;e<n.length;e++)n[e]=n[e].split("-");return n}var a=jQuery(this);if(t(),a.attr("data-lang"))for(var r=e(),l=0;l<r.length;l++){var c=n.translateIndex(r[l][0]);c&&(c=ccm.helper.val(c),r[l][1]?a.attr(r[l][1],c):a.html(c))}}),t&&t()},this.translateIndex=function(e){var a=t(),r=n.store.get(a),l=e.split("#");e=l.shift();var c=r[e];if(!c)return null;n.onTranslateIndex&&(c=n.onTranslateIndex(c,l));for(var o=0;o<l.length;o++)c=c.replace(/%s/,l[o]);return c},this.isTranslatable=function(e){var a=t(),r=n.store.get(a);return r&&!!r[e.split("#")[0]]}},getLanguage:function(t){var n=t.closest("*[lang]").attr("lang");return n||(n=jQuery('meta[http-equiv="content-language"]').attr("content")),n?n.toLowerCase():"en"}});