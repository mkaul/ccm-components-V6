ccm.component({name:"tagcloud",config:{key:"demo",store:[ccm.store,"http://mkaul.github.io/ccm-components/lib/jsonp/tagcloud.json"],style:[ccm.load,"http://mkaul.github.io/ccm-components/lib/css/tagcloud.css"],defaults:{size:{start:8,end:56,unit:"pt"},color:{start:"#a00",end:"#fed"}},link:function(t){return"http://mkaul.github.io/ccm-components/lib/demo_mkaul.html#"+t},jquery_tagcloud_lib:[ccm.load,"http://mkaul.github.io/ccm-components/lib/lib/jquery.tagcloud.js"],lang:[ccm.instance,"http://mkaul.github.io/ccm-components/lib/components/lang.js",{store:[ccm.store,"http://mkaul.github.io/ccm-components/lib/jsonp/tagcloud_lang.json"]}]},Instance:function(){var t=this;this.init=function(n){jQuery.fn.tagcloud.defaults=t.defaults,n()},this.render=function(n){var c=ccm.helper.element(t),o={tag:"div",id:"demo",inner:[]};t.store.get(t.key,function(n){for(var e in n)o.inner.push({tag:"a",href:t.link(e),rel:n[e],inner:"lang#"+e});c.html(ccm.helper.html(o)),c.find("#demo a").tagcloud()}),t.lang&&t.lang.render(),"function"==typeof n&&n()}}});