/**
 * @overview tagcloud component
 * @author Manfred Kaul <manfred.kaul(at)h-brs.de> 2016
 * @license The MIT License (MIT)
 * @uses https://github.com/addywaddy/jquery.tagcloud.js
 */

ccm.component( {

  /*-------------------------------------------- public component members --------------------------------------------*/

  /**
   * @summary component name
   * @memberOf ccm.components.tagcloud
   * @type {ccm.name}
   */
  name: 'tagcloud',

  /**
   * @summary default instance configuration
   * @memberOf ccm.components.tagcloud
   * @type {ccm.components.tagcloud.config}
   */
  config: {

    key:   'demo',
    store: [ ccm.store, '../tagcloud/tagcloud.json' ],
    style: [ ccm.load, '../tagcloud/tagcloud.css' ],
    defaults: {
      size: {start: 8, end: 56, unit: 'pt'},
      color: {start: '#a00', end: '#fed'}
    },
    link: function(term){
      return './demo_mkaul.html#' + term;
    },

    // https://github.com/addywaddy/jquery.tagcloud.js
    jquery_tagcloud_lib: [ ccm.load, '../libs/jquery.tagcloud.min.js' ],
    lang:  [ ccm.instance, 'http://mkaul.github.io/ccm-components/lib/components/lang.js', { store: [ ccm.store, '../tagcloud/tagcloud_lang.json' ] } ]

  },

  /*-------------------------------------------- public component classes --------------------------------------------*/

  /**
   * @summary constructor for creating <i>ccm</i> instances out of this component
   * @alias ccm.components.tagcloud.tagcloud
   * @class
   */
  Instance: function () {

    /*------------------------------------- private and public instance members --------------------------------------*/

    /**
     * @summary own context
     * @private
     */
    var self = this;

    // ...

    /*------------------------------------------- public instance methods --------------------------------------------*/

    /**
     * @summary initialize <i>ccm</i> instance
     * @description
     * Called one-time when this <i>ccm</i> instance is created, all dependencies are solved and before dependent <i>ccm</i> components, instances and datastores are initialized.
     * This method will be removed by <i>ccm</i> after the one-time call.
     * @param {function} callback - callback when this instance is initialized
     */
    this.init = function ( callback ) {
  
      jQuery.fn.tagcloud.defaults = self.defaults;

      // perform callback
      callback();

    };

    /**
     * @summary render content in own website area
     * @param {function} [callback] - callback when content is rendered
     */
    this.render = function ( callback ) {

      /**
       * website area for own content
       * @type {ccm.element}
       */
      var element = ccm.helper.element( self );

      var html_structure = { tag: 'div', id: 'demo', inner: [] };
  
      self.store.get(self.key, function ( dataset ) {

        for (var term in dataset){
          // <a href="/path" rel="7">peace</a>
          html_structure.inner.push({tag:'a',href:self.link(term) ,rel:dataset[term], inner: 'lang#'+term });
        }

        element.html( ccm.helper.html( html_structure ) );

        element.find('#demo a').tagcloud();

      } );

      // translate content of own website area
      if ( self.lang ) self.lang.render();

      // perform callback
      if ( typeof callback === 'function' ) callback();

    };

  }

  /*------------------------------------------------ type definitions ------------------------------------------------*/

  /**
   * @namespace ccm.components.tagcloud
   */

  /**
   * @summary <i>ccm</i> instance configuration
   * @typedef {ccm.config} ccm.components.tagcloud.config
   * @property {string} classes - css classes for own website area
   * @property {ccm.element} element - own website area
   * @property {Object.<ccm.key, ccm.html>} html - <i>ccm</i> html data templates for own content
   * @property {ccm.key} key - key of [tagcloud dataset]{@link ccm.components.tagcloud.dataset} for rendering
   * @property {ccm.store} store - <i>ccm</i> datastore that contains the [tagcloud dataset]{@link ccm.components.tagcloud.dataset} for rendering
   * @property {ccm.style} style - css for own content
   * ...
   */

  /**
   * @summary tagcloud dataset for rendering
   * @typedef {ccm.dataset} ccm.components.tagcloud.dataset
   * @property {ccm.key} key - dataset key
   * ...
   */

  // ...

} );