ccm.component({name:"tagcloud",config:{key:"demo",store:[ccm.store,"http://mkaul.github.io/ccm-components/resources/tagcloud/tagcloud.json"],style:[ccm.load,"http://mkaul.github.io/ccm-components/resources/tagcloud/tagcloud.css"],defaults:{size:{start:8,end:56,unit:"pt"},color:{start:"#a00",end:"#fed"}},link:function(t){return"./demo_mkaul.html#"+t},jquery_tagcloud_lib:[ccm.load,"http://mkaul.github.io/ccm-components/resources/libs/jquery.tagcloud.min.js"],lang:[ccm.instance,"http://mkaul.github.io/ccm-components/resources/lang/lang.js",{store:[ccm.store,"http://mkaul.github.io/ccm-components/resources/tagcloud/tagcloud_lang.json"]}]},Instance:function(){var t=this;this.init=function(e){jQuery.fn.tagcloud.defaults=t.defaults,e()},this.render=function(e){var c=ccm.helper.element(t),n={tag:"div",id:"demo",inner:[]};t.store.get(t.key,function(e){for(var o in e)n.inner.push({tag:"a",href:t.link(o),rel:e[o],inner:"lang#"+o});c.html(ccm.helper.html(n)),c.find("#demo a").tagcloud()}),t.lang&&t.lang.render(),"function"==typeof e&&e()}}});