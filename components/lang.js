/**
 * @overview ccm component for multilingualism
 * @author André Kless <andre.kless@h-brs.de> 2014-2015
 * @copyright Copyright (c) 2014-2015 André Kless
 * @license The MIT License (MIT)
 */

ccm.component( {

  /*-------------------------------------------- public component members --------------------------------------------*/

  /**
   * component name
   * @type {string}
   * @ignore
   */
  name: 'lang',

  /**
   * @summary default instance configuration
   * @type {ccm.components.lang.config}
   * @ignore
   */
  config: {

    element: 'parent',
    langmenu: [ ccm.instance, './components/langmenu.js', { lang: null } ],
    store: [ ccm.store, './json/lang.json' ]

  },

  /*-------------------------------------------- public component classes --------------------------------------------*/

  /**
   * @alias ccm.components.lang
   * @class
   */
  Instance: function () {

    /*----------------------------------------------- instance members -----------------------------------------------*/

    /**
     * @summary own context
     * @private
     * @type {ccm.instance}
     * @this ccm.instance
     */
    var self = this;

    /*------------------------------------------- public instance methods --------------------------------------------*/

    /**
     * @summary when <i>ccm</i> instance is ready
     * @description
     * Called one-time when this <i>ccm</i> instance and dependent <i>ccm</i> instances and components are initialized and ready.
     * This method will be removed automatically after the one-time call.
     * @param {function} [callback] - callback when this instance is ready
     */
    this.ready = function ( callback ) {

      // listen to language selection event => (re)render
      if ( self.langmenu ) self.langmenu.addObserver( function () { self.render(); } );

      // perform callback
      if ( callback ) callback();

    };

    /**
     * @summary render content of own website area in current language
     * @param {function} [callback] - callback when instance is rendered
     * @param {string} [selector] - (re)render only self.element.find(selector) of own website area
     */
    this.render = function ( callback, selector ) {

      // reselect own website area
      ccm.helper.reselect( self );

      // callback is a string? => callback is selector
      if ( typeof ( callback ) === 'string' ) { selector = callback; callback = undefined; }

      /**
       * relevant website area
       * @type {ccm.element}
       */
      var element = selector ? self.element.find( selector ) : self.element;

      // select all html tags in relevant website area
      element.find( '*:not(.ccm, #' + element.attr( 'id' ) + ' > .ccm .ccm *)' ).andSelf().each( function () {

        /**
         * current html tag
         * @type {ccm.element}
         */
        var tag = jQuery( this );

        // transfer translation indexes into translation attribute
        transferIndex();

        // no translation attribute? => abort (nothing to translate)
        if ( !tag.attr( 'data-lang' ) ) return;

        /**
         * filtered values from translation attribute
         * @type {Array.<string[]>}
         */
        var filtered_values = filterValues();

        // iterate over filtered value
        for ( var j = 0; j < filtered_values.length; j++ ) {

          /**
           * translation
           * @type {string}
           */
          var translation = self.translateIndex( filtered_values[ j ][ 0 ] );

          // no translation? => skip
          if ( !translation ) continue;

          // prevent XSS attacks
          translation = ccm.helper.val( translation );

          // has attribute value to be translated? => translate attribute value
          if ( filtered_values[ j ][ 1 ] ) tag.attr( filtered_values[ j ][ 1 ], translation );

          // otherwise translate content of html tag
          else tag.html( translation );

        }

        /**
         * transfer translation indexes into translation attribute for current html tag
         * @example <span>lang#hello</span> => <span data-lang="hello"></span>
         * @example <button value="lang#hello"></button> => <button data-lang="hello-value"></button>
         */
        function transferIndex() {

          // content of html tag is translation index? => transfer translation index into translation attribute
          if ( tag.html().indexOf( 'lang#' ) === 0 && tag.attr( 'data-lang-content' ) !== '' ) append( tag.html() );

          // iterate over all html tag attributes
          for ( var i = 0; i < tag.context.attributes.length; i++ ) {

            /**
             * current html tag attribute
             * @type {string}
             */
            var attr = tag.context.attributes[ i ];

            // value of html tag is translation index? => transfer translation index into translation attribute
            if ( attr.value.indexOf( 'lang#' ) === 0 && tag.attr( 'data-lang-' + attr.name ) !== '' ) append( attr.value, attr.name );

          }

          /**
           * append translation index to translation attribute for current html tag
           * @param {string} index - contains translation index
           * @param {string} [attr] - Zu übersetzendes Attribut (Default: Inhalt des Tags)
           * @example append('lang#hello','value') => <span data-lang="hello-value">lang#hello</span>
           */
          function append( index, attr ) {

            // extract translation index
            index = index.substr( ( 'lang#' ).length ) + ( attr ? '-'+attr : '' );

            /**
             * current value of translation attribute
             * @type {string}
             */
            var value = tag.attr( 'data-lang' );

            // append translation index to translation attribute
            tag.attr( 'data-lang', value ? value + ' ' + index : index );

          }

        }

        /**
         * filter translation indexes and attribute names from translation attribute
         * @returns {Array.<string[]>} filtered values
         * @example filtered values
         * [i][0]: translation index
         * [i][1]: attribute name which value must be translated (default: content of html tag)
         */
        function filterValues() {

          /**
           * value of translation attribute
           * @type {string}
           */
          var value = tag.attr( 'data-lang' );

          /**
           * filtered values
           * @type {Array.<string[]>}
           */
          var filtered_values = value.split( ' ' );

          // iterate over filtered values
          for ( var i = 0; i < filtered_values.length; i++ ) {

            // split value into translation index and attribute name
            filtered_values[ i ] = filtered_values[ i ].split( '-' );

          }

          // return filtered values
          return filtered_values;

        }

      } );

      // perform callback
      if ( callback ) callback();

    };

    /**
     * @summary translate translation index
     * @param {string} index - translation index
     * @returns {string} associated translation
     */
    this.translateIndex = function ( index ) {

      /**
       * current language
       * @type {ccm.components.lang.language}
       */
      var lang = getLanguage();

      /**
       * translations associated with current language
       * @type {ccm.components.lang.translations}
       */
      var translations = self.store.get( lang );

      /**
       * values that must be replaced in translation
       * @type {string[]}
       */
      var fieldings = index.split( '#' );

      // filter translation index
      index = fieldings.shift();

      /**
       * translation associated with translation index
       * @type {string}
       */
      var translation = translations[ index ];

      // no translation? => abort
      if ( !translation ) return null;

      // callback exists? => modify translation
      if ( self.onTranslateIndex ) translation = self.onTranslateIndex( translation, fieldings );

      // iterate over values that must be replaced
      for ( var i = 0; i < fieldings.length; i++ ) {

        // replace first placeholder in translation with value
        translation = translation.replace( /%s/, fieldings[ i ] );

      }

      // return translation of translation value
      return translation;

    };

    /**
     * @summary checks if translation index is translatable
     * @param {string} index - translation index
     * @returns {boolean}
     */
    this.isTranslatable = function ( index ) {

      /**
       * current language
       * @type {ccm.components.lang.language}
       */
      var lang = getLanguage();

      /**
       * translations associated with current language
       * @type {ccm.components.lang.translations}
       */
      var translations = self.store.get( lang );

      // return if translation index is translatable
      return translations && !!translations[ index.split( '#' )[ 0 ] ];

    };

    /*------------------------------------------- private instance methods -------------------------------------------*/

    /**
     * get current language of own website area (in lower case letters)
     * @returns {ccm.components.lang.language} determined language (default: 'en')
     */
    function getLanguage() {

      // return determined language
      return self.language ? self.language.toLowerCase() : self.component.getLanguage( self.element );

    }

  },

  /*-------------------------------------------- public component methods --------------------------------------------*/

  /**
   * @summary get current language of a website area (in lower case letters)
   * @param {ccm.element} element - website area
   * @returns {ccm.components.lang.language} determined language (default: 'en')
   * @ignore
   */
  getLanguage: function ( element ) {

    /**
     * determined language
     * @type {ccm.components.lang.language}
     */
    var lang = element.closest( '*[lang]' ).attr( 'lang' );

    // no result? => determine language by meta tag
    if ( !lang ) lang = jQuery( 'meta[http-equiv="content-language"]' ).attr( 'content' );

    // return determined language (default: 'en')
    return lang ? lang.toLowerCase() : 'en';

  }

  /*------------------------------------------------ type definitions ------------------------------------------------*/

  /**
   * @summary ccm instance configuration
   * @typedef {ccm.config} ccm.components.lang.config
   * @property {ccm.element} element - website area of ccm instance
   * @property {ccm.store} store - ccm datastore for translations
   * @property {ccm.components.lang.language} language - current language of own website area
   * @property {ccm.components.lang.onTranslateIndex} onTranslationIndex - callback when an index will be translated
   */

  /**
   * @summary language
   * @typedef {string} ccm.components.lang.language
   * @example "de"
   * @example "en"
   */

  /**
   * @summary ccm dataset with translations of a language
   * @typedef {ccm.dataset} ccm.components.lang.translations
   * @example { "hello": "Hallo Welt", "sayHello": "Hallo, %s" }
   * @example { "hello": "Hello world", "sayHello": "Hello, %s" }
   */

  /**
   * @summary callback after an index will be translated and before values in translation will be replaced
   * @callback ccm.components.lang.onTranslateIndex
   * @param {string} translation - translation
   * @param {string[]} fieldings - values that must be replaced in translation
   * @returns {string} modified translation
   */

} );