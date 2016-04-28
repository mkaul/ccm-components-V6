/**
 * @overview ccm component for language selection
 * @author Andre Kless <andre.kless@h-brs.de>, 2013-2015
 * @license The MIT License (MIT)
 */

ccm.component( {

  /*-------------------------------------------- public component members --------------------------------------------*/

  /**
   * component name
   * @type {string}
   * @ignore
   */
  name: 'langmenu',

  /**
   * @summary default instance configuration
   * @type {ccm.components.langmenu.config}
   * @ignore
   */
  config: {

    context:   true,
    style:     [ ccm.load, './css/langmenu.css' ],
    lang:      [ ccm.instance, './components/lang.js', { langmenu: null, store: [ ccm.store, './json/lang_langmenu.json' ] } ],
    languages: [ 'de', 'en' ]

  },

  /*-------------------------------------------- public component classes --------------------------------------------*/

  /**
   * @alias ccm.components.langmenu
   * @class
   */
  Instance: function () {

    /*----------------------------------------------- instance members -----------------------------------------------*/

    /**
     * @summary observers for flag click event
     * @private
     * @type {function[]}
     */
    var observers = [];

    /**
     * @summary own context
     * @private
     * @type {ccm.instance}
     * @this ccm.instance
     */
    var self = this;

    /*------------------------------------------- public instance methods --------------------------------------------*/

    /**
     * @summary initialize <i>ccm</i> instance
     * @description
     * Called one-time when this <i>ccm</i> instance is created, all dependencies are solved and before dependent <i>ccm</i> instances and components are initialized.
     * This method will be removed automatically after initialization.
     * @param {function} [callback] - callback when this instance is initialized
     */
    this.init = function ( callback ) {

      // context mode? = set context to highest ccm instance for language selection in current ccm context
      if ( self.context ) { var context = ccm.context.find( self, 'langmenu' ); self.context = context && context.context || context; }

      // see context of user instances
//    console.log( 'langmenu#init', self.index, self.context );

      // perform callback
      if ( callback ) callback();

    };

    /**
     * @summary render content in own website area
     * @param {function} [callback] - callback when instance is rendered
     */
    this.render = function ( callback ) {

      // see render call order of langmenu instances
//    console.log( 'langmenu#render', self.index );

      // context mode? => delegate function call
      if ( self.context ) return self.context.render( callback );

      /**
       * website area for own content
       * @type {ccm.element}
       */
      var element = ccm.helper.element( self ).html( '' );

      // iterate over selectable languages
      for ( var i = 0; i < self.languages.length; i++ ) {

        /**
         * selectable language
         * @type {string}
         */
        var language = ccm.helper.val( self.languages[ i ], 'key' );

        // render flag
        element.append( '<div class="langmenu_flag langmenu_flag-' + language + '" data-langmenu="' + language + '" title="lang#' + language + '"></div>' );

      }

      /**
       * flag elements
       * @type {ccm.element}
       */
      var flags = element.find( '.langmenu_flag' );

      // set flag click event
      flags.click( function () {

        // highlight selected flag
        element.find( '.langmenu_selected' ).removeClass( 'langmenu_selected' );
        jQuery( this ).addClass( 'langmenu_selected' );

        /**
         * website area with multilingualism content
         * @type {ccm.element}
         */
        var area = self.parent ? self.parent.element : jQuery( 'html' );

        /**
         * selected language
         * @type {string}
         */
        var language = jQuery( this ).attr( 'data-langmenu' );

        // set website area language
        area.attr( 'lang', language );

        // translate own content
        self.lang.render();

        // notify observers about selected language
        notify( language );

      } );

      // highlight default language flag
      flags.each( function () {

        if ( jQuery( this ).attr( 'data-langmenu' ) === ( self.selected ? self.selected : self.languages[ 0 ] ) )
          jQuery( this ).addClass( 'langmenu_selected' );

      } );

      // select default language
      element.find( '.langmenu_selected' ).click();

      // perform callback
      if ( callback ) callback();

    };

    /**
     * @summary add an observer for flag click event
     * @param {function} observer - will be performed when event fires (first parameter is selected language)
     */
    this.addObserver = function ( observer ) {

      // context mode? => delegate function call
      if ( self.context ) return self.context.addObserver( observer );

      observers.push( observer );

    };

    /*------------------------------------------- private instance methods -------------------------------------------*/

    /**
     * notify observers about selected language
     * @param {string} language - selected language
     */
    function notify( language ) {

      for ( var i = 0; i < observers.length; i++ )
        observers[ i ]( language );

    }

  }

  /*------------------------------------------------ type definitions ------------------------------------------------*/

  /**
   * @summary ccm instance configuration
   * @typedef {ccm.config} ccm.components.langmenu.config
   * @property {ccm.element} element - website area of ccm instance
   * @property {string} classes - CSS classes for website area
   * @property {ccm.style} style - CSS for website area
   * @property {ccm.components.langmenu.lang} lang - instance for multilingualism
   * @property {string[]} languages - selectable languages
   * @property {string} selected - default selected language
   */

  /**
   * @summary expected interfaces of ccm instance for multilingualism
   * @typedef {ccm.instance} ccm.components.langmenu.lang
   * @property {function} render - render content of own website area in current language
   */

} );