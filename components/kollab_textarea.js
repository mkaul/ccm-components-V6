/**
 * @overview ccm component for simple kollab_textarea
 * @author Manfred Kaul <manfred.kaul@h-brs.de> 2016
 * @copyright Copyright (c) 2016 Manfred Kaul
 * @license The MIT License (MIT)
 */

ccm.component( {

  /*-------------------------------------------- public component members --------------------------------------------*/

  /**
   * @summary component name
   * @type {ccm.name}
   */
  name: 'kollab_textarea',

  /**
   * @summary default instance configuration
   * @type {ccm.components.kollab_textarea.config}
   */
  config: {

    key: 'test2',
    store: [ ccm.store, { db: 'redis', store: 'wiki', url: 'wss://ccm.inf.h-brs.de:8888/index.js' } ],
    user: [ ccm.instance, './components/user.js' ]

  },
  
  /*-------------------------------------------- public component classes --------------------------------------------*/
  
  /**
   * @summary constructor for creating instances out of this component
   * @alias ccm.components.kollab_textarea
   * @class
   */
  Instance: function () {

    /*------------------------------------- private and public instance members --------------------------------------*/
    
    /**
     * @summary own context
     * @private
     */
    var self = this;

    /**
     * @summary unique jQuery element for collaborative writing in a textarea
     * @private
     */
    var textarea;

    /*------------------------------------------- public instance methods --------------------------------------------*/

    /**
     * @summary initialize <i>ccm</i> instance
     * @description Called one-time when this instance is created, all dependencies are solved and before dependent <i>ccm</i> instances will be initialized.
     * @param {function} [callback] - callback when this instance is initialized (and before first render call)
     */
    this.init = function ( callback ) {

      // listen to ccm realtime datastore change event
      self.store.onChange = function () {

        // own website area no more exists? => abort
        if ( !ccm.helper.tagExists( self.element.find( '#' + ccm.helper.getElementID( self ) ) ) ) return;

        // (re)render contents from database
        self.renderContents();

      };

      // perform callback
      if ( callback ) callback();

    }; //  end of init

    this.ready = function ( callback ) {

      // listen to login event
      self.user.addObserver( function () {

        // own website area no more exists? => abort
        if ( !ccm.helper.tagExists( '#' + ccm.helper.getElementID( self ) ) ) return;

        // (re)render content of own website area
        self.render();

      } );

      // perform callback
      if ( callback ) callback();

    };


    /**
     * @summary (re)render content of own website area
     * @param {function} callback - callback when ccm instance is rendered (first parameter is ccm instance)
     */
    this.render = function ( callback ) {

      // login user if not logged in
      if ( !self.user.isLoggedIn() ) return self.user.login( function () { self.render( callback ); } );

      /**
       * website area for own content
       * @type {ccm.element}
       */
      var element = ccm.helper.element(self);

      // render own content
      element.html(
        '<textarea>initial text</textarea>'
      );
  
      /**
       * textarea input field
       * @type {ccm.element}
       */
      textarea = element.find( '> textarea' );

      textarea.change(function() {
        self.store.set( { key: self.key, user: self.user.data().key, contents: jQuery(this).val() } );
      });

      // (re)render contents from database
      self.renderContents();

      // perform callback
      if (callback) callback();
    };



    /**
     * render contents from database
     */
    this.renderContents = function() {

      // get dataset
      self.store.get( self.key, function ( dataset ) {

        // dataset not exists? => create new dataset
        if ( dataset === null ){
          dataset = { key: self.key, user: self.user.data().key, contents: 'initial text' };
          self.store.set( dataset );
        }

        textarea.val( dataset.contents );

      } );

    }

  }
  
  /*------------------------------------------------ type definitions ------------------------------------------------*/

  /**
   * @summary ccm instance configuration
   * @typedef {ccm.config} ccm.components.kollab_textarea.config
   * @property {ccm.element} element - website area of ccm instance
   * @property {string} classes - CSS classes for website area
   * @property {ccm.style} style - CSS for website area
   * @property {ccm.store} store - ccm datastore for kollab_textareas
   * @property {ccm.key} key - kollab_textarea dataset key
   */

} );