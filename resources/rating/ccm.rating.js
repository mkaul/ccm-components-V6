ccm.component({name:"rating",config:{icons:[ccm.load,"https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css"],key:"demo",mode:"thumbs",store:[ccm.store,".http://mkaul.github.io/ccm-components/resources/rating/rating.json"],style:[ccm.load,".http://mkaul.github.io/ccm-components/resources/rating/rating.css"],user:[ccm.instance,"http://kaul.inf.h-brs.de/ccm/components/user2.js"]},Instance:function(){var e=this;this.init=function(s){e.store.onChange=function(){e.render()},s()},this.ready=function(s){e.user&&e.user.addObserver(function(){e.render()}),s()},this.render=function(s){var t=ccm.helper.element(e);t.html(ccm.helper.html({"class":"rating"})),ccm.helper.dataset(e,function(t){function i(){function s(s,i){n[s].click(function(){e.user.login(function(){var n=e.user.data().key;t[s][n]?delete t[s][n]:(t[s][n]=!0,delete t[i][n]),e.store.set(t,function(){e.render()})})})}t.likes||(t.likes={}),t.dislikes||(t.dislikes={}),ccm.helper.find(e,".rating").html('<div class="likes fa fa-lg fa-thumbs-up"><div>'+(t.likes?Object.keys(t.likes).length:0)+'</div></div>&nbsp;<div class="dislikes fa fa-lg fa-thumbs-down"> <div>'+(t.dislikes?Object.keys(t.dislikes).length:0)+"</div></div>");var i=ccm.helper.find(e,".rating");if(e.user){var n={likes:ccm.helper.find(e,i,".likes"),dislikes:ccm.helper.find(e,i,".dislikes")};if(i.addClass("user"),e.user.isLoggedIn()){var r=e.user.data().key;t.likes[r]&&n.likes.addClass("selected"),t.dislikes[r]&&n.dislikes.addClass("selected")}s("likes","dislikes"),s("dislikes","likes")}}function n(){function s(){return function(){var s=jQuery(this).index();e.user&&e.user.login(function(){var i=e.user.data().key;jQuery(this).addClass("selected"),t.stars[i]=s+1;var n=0;for(var r in t.stars)n+=t.stars[r];t.star_vote=Math.round(n/Object.keys(t.stars).length*10)/10,e.store.set(t,function(){e.render()})})}}t.stars||(t.stars={}),t.star_vote||(t.star_vote="0");var i,n=ccm.helper.find(e,".rating"),r=0;e.user&&e.user.isLoggedIn()&&t.stars[e.user.data().key]&&(r=t.stars[e.user.data().key]);for(var a=1;5>=a;a++)i=r>=a?jQuery("<div>&#9733;</div>"):jQuery("<div>&#9734;</div>"),i.on("click",s()),n.append(i);n.append("&nbsp;("+t.star_vote+")")}"thumbs"===e.mode&&i(),"stars"===e.mode&&n(),s&&s()})}}});