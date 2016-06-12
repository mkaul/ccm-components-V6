/**
 * @overview Demo of integrating ccm with W3C WebComponent Technique Custom Element: ccm components can be included into HTML via custom tags
 * @author Manfred Kaul <manfred.kaul(at)h-brs.de> 2016
 * @license The MIT License (MIT)
 * @see http://webcomponents.org/polyfills/custom-elements/
 */

// 1. browser switch
if ('registerElement' in document &&
  'createShadowRoot' in HTMLElement.prototype &&
  'import' in document.createElement('link') &&
  'import' in document.createElement('link')
) console.log('Woohoo! Browser has native WC support!');
else {
  // Chrome and Opera are W3C WebComponent ready, but Firefox and Safari need additional help
  // Firefox https://developer.mozilla.org/en-US/docs/Web/Web_Components#Enabling_Web_Components_in_Firefox
  document.write('<script src="//cdnjs.cloudflare.com/ajax/libs/document-register-element/0.5.3/document-register-element.js"><\/script>');
  document.write('<script src="//cdnjs.cloudflare.com/ajax/libs/webcomponentsjs/0.7.22/webcomponents-lite.min.js"><\/script>');
}


// 2. register ccm component as new element
newElement('ccm-element', {
  
  createdCallback: function () {
    ccm.render('../' + this.dataset.component + '/ccm.'+ this.dataset.component + '.js', {
      element: jQuery('div.demo')
    } );
  },
  
  addMoreText: function (s) {
    this.textContent = this.textContent + s;
  }
  
});

function newElement(name, proto) {
  $(document).ready(function () {
    var ep = Object.create(HTMLElement.prototype);
    Object.keys(proto).forEach(function(key) {
      ep[key] = proto[key];
    });
    document.registerElement(name, {prototype: ep});
  });
}