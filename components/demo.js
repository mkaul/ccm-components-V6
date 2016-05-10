/**
 * @overview demo template for <i>ccm</i> component
 * @author Manfred Kaul <manfred.kaul@h-brs.de> 2016
 * @license The MIT License (MIT)
 */

ccm.component( {

  /*-------------------------------------------- public component members --------------------------------------------*/

  /**
   * @summary component name
   * @memberOf ccm.components.demo
   * @type {ccm.name}
   */
  name: 'demo',

  /**
   * @summary default instance configuration
   * @memberOf ccm.components.demo
   * @type {ccm.components.demo.config}
   */
  config: {
    
    key:   'demo',
    html:  [ ccm.load, './json/demo_html.json' ],
    style: [ ccm.load, './css/demo.css' ],
    lang:  [ ccm.instance, './components/lang.js', { store: [ ccm.store, './json/demo_lang.json' ] } ],
    langmenu: [ ccm.instance, './components/langmenu.js', { element: 'name', context: false } ]

  },

  /*-------------------------------------------- public component classes --------------------------------------------*/

  /**
   * @summary constructor for creating <i>ccm</i> instances out of this component
   * @alias ccm.components.demo.demo
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

      // ...

      // perform callback
      callback();

    };

    /**
     * @summary when <i>ccm</i> instance is ready
     * @description
     * Called one-time when this <i>ccm</i> instance and dependent <i>ccm</i> components, instances and datastores are initialized and ready.
     * This method will be removed by <i>ccm</i> after the one-time call.
     * @param {function} callback - callback when this instance is ready
     */
    this.ready = function ( callback ) {

      // ...

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
      

      // render main html structure
      element.html( ccm.helper.html( self.html.main, { h: dataset.foo, w: dataset.bar } ) );

      // ...

      // perform callback
      if ( callback ) callback();


    };

  }

  /*------------------------------------------------ type definitions ------------------------------------------------*/

  /**
   * @namespace ccm.components.demo
   */

  /**
   * @summary <i>ccm</i> instance configuration
   * @typedef {ccm.config} ccm.components.demo.config
   * @property {string} classes - css classes for own website area
   * @property {ccm.element} element - own website area
   * @property {Object.<ccm.key, ccm.html>} html - <i>ccm</i> html data templates for own content
   * @property {ccm.key} key - key of [demo dataset]{@link ccm.components.demo.dataset} for rendering
   * @property {ccm.store} store - <i>ccm</i> datastore that contains the [demo dataset]{@link ccm.components.demo.dataset} for rendering
   * @property {ccm.style} style - css for own content
   * ...
   */

  /**
   * @summary demo dataset for rendering
   * @typedef {ccm.dataset} ccm.components.demo.dataset
   * @property {ccm.key} key - dataset key
   * ...
   */

  // ...

} );