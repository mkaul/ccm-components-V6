ccm.component({name:"index",config:{html:[ccm.load,"http://mkaul.github.io/ccm-components/resources/index/index_html.json"],key:"index",store:[ccm.store,"http://mkaul.github.io/ccm-components/resources/index/index.json"],style:[ccm.load,"http://mkaul.github.io/ccm-components/resources/index/index.css"],menu:[ccm.component,"http://mkaul.github.io/ccm-components/resources/menu/ccm.menu.js"],menu_content:function(e){return[ccm.proxy,"http://mkaul.github.io/ccm-components/resources/"+e+"/ccm."+e+".js"]},lang:[ccm.instance,"http://mkaul.github.io/ccm-components/resources/lang/lang.js",{store:[ccm.store,"http://mkaul.github.io/ccm-components/resources/index/index_lang.json"]}],langmenu:[ccm.instance,"http://mkaul.github.io/ccm-components/resources/langmenu/langmenu.js",{element:jQuery("#langmenu"),context:!1,selected:"en"}]},Instance:function(){var e=this;this.render=function(n){function c(){ccm.helper.dataset(e,function(n){var c=Object.keys(n).reduce(function(e,c){return e.push(n[c]),e},[]);e.menu.render({element:t.find("> #menu"),parent:e,entries:c.reduce(function(n,c){return n.push({label:c,content:e.menu_content(c)}),n},[])})})}var t=ccm.helper.element(e);t.html(ccm.helper.html(e.html.main)),c(),e.langmenu&&e.langmenu.render(),e.lang&&e.lang.render(),n&&n()}}});