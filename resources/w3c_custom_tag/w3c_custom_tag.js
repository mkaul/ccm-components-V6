function newElement(e,t){$(document).ready(function(){var n=Object.create(HTMLElement.prototype);Object.keys(t).forEach(function(e){n[e]=t[e]}),document.registerElement(e,{prototype:n})})}"registerElement"in document&&"createShadowRoot"in HTMLElement.prototype&&"import"in document.createElement("link")&&"import"in document.createElement("link")?console.log("Woohoo! Browser has native WC support!"):(document.write('<script src="//cdnjs.cloudflare.com/ajax/libs/document-register-element/0.5.3/document-register-element.js"></script>'),document.write('<script src="//cdnjs.cloudflare.com/ajax/libs/webcomponentsjs/0.7.22/webcomponents-lite.min.js"></script>')),newElement("ccm-element",{createdCallback:function(){ccm.render("http://mkaul.github.io/ccm-components/resources/"+this.dataset.component+"/ccm."+this.dataset.component+".js",{element:jQuery("div.demo")})},addMoreText:function(e){this.textContent=this.textContent+e}});