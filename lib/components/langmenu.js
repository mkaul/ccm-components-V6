ccm.component({name:"langmenu",config:{context:!0,style:[ccm.load,"http://mkaul.github.io/ccm-components/lib/css/langmenu.css"],lang:[ccm.instance,"http://mkaul.github.io/ccm-components/lib/components/lang.js",{langmenu:null,store:[ccm.store,"http://mkaul.github.io/ccm-components/lib/jsonp/lang_langmenu.json"]}],languages:["de","en"]},Instance:function(){function n(n){for(var t=0;t<e.length;t++)e[t](n)}var e=[],t=this;this.init=function(n){if(t.context){var e=ccm.context.find(t,"langmenu");t.context=e&&e.context||e}n&&n()},this.render=function(e){if(t.context)return t.context.render(e);for(var a=ccm.helper.element(t).html(""),l=0;l<t.languages.length;l++){var c=ccm.helper.val(t.languages[l],"key");a.append('<div class="langmenu_flag langmenu_flag-'+c+'" data-langmenu="'+c+'" title="lang#'+c+'"></div>')}var s=a.find(".langmenu_flag");s.click(function(){a.find(".langmenu_selected").removeClass("langmenu_selected"),jQuery(this).addClass("langmenu_selected");var e=t.parent?t.parent.element:jQuery("html"),l=jQuery(this).attr("data-langmenu");e.attr("lang",l),t.lang.render(),n(l)}),s.each(function(){jQuery(this).attr("data-langmenu")===(t.selected?t.selected:t.languages[0])&&jQuery(this).addClass("langmenu_selected")}),a.find(".langmenu_selected").click(),e&&e()},this.addObserver=function(n){return t.context?t.context.addObserver(n):void e.push(n)}}});