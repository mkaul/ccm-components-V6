/**
 * @overview ccm component for content
 * @author Andre Kless <andre.kless@h-brs.de>, 2015
 * @license The MIT License (MIT)
 */

ccm.component( {

  /*-------------------------------------------- public component members --------------------------------------------*/

  /**
   * ccm component name
   * @type {string}
   * @ignore
   */
  name: 'content',

  /**
   * @summary default instance configuration
   * @type {ccm.components.content.config}
   * @ignore
   */
  config: {

    content: [ 'Hello <b>world</b>!', { tag: 'br' }, '<i>this is example content</i>' ]

  },

  /*-------------------------------------------- public component classes --------------------------------------------*/

  /**
   * @alias ccm.components.content
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
     * @summary initialize ccm instance
     * @description when instance is created, all dependencies are solved and before dependent instances are initialized
     * @ignore
     */
    this.init = function ( callback ) {

      // prepare content
      self.content = jQuery( '<div></div>' ).html( ccm.helper.html( self.content ) );

      var i = 0;

      // select all inner html tags for ccm instance contents
      self.content.find( "*[id^='content#']" ).each( function () {

        /**
         * inner html tag for ccm instance content
         * @type {ccm.element}
         */
        var tag = jQuery( this );

        /**
         * ccm instance property in content instance
         */
        var property = tag.attr( 'id' ).split( '#' )[ 1 ];

        /**
         * ccm instance
         * @type {ccm.element}
         */
        var instance = self[ property ];

        i++;

        // change inner html tag id and add html tag class
        tag.attr( 'id', self.index + '_' + i ).addClass( 'content-' + property );

        // set ccm instance website area
        instance.element = self.content.find( '#' + self.index + '_' + i );

      } );

      if ( callback ) callback();

    };

    /**
     * @summary render content in own website area
     * @param {function} [callback] - callback when instance is rendered
     */
    this.render = function ( callback ) {

      /**
       * website area for own content
       * @type {ccm.element}
       */
      var element = ccm.helper.element( self );

      // render content
      element.html( ccm.helper.val( self.content.html() ) );

      // select all inner html tags for ccm instance contents
      element.find( '*[id^="' + self.index + '_"]' ).each( function () {

        /**
         * inner html tag for ccm instance content
         * @type {ccm.element}
         */
        var tag = jQuery( this );

        /**
         * ccm instance
         * @type {ccm.element}
         */
        var instance = self[ tag.attr( 'class' ).split( '-' )[ 1 ] ];

        // render ccm instance content
        instance.render();

      } );

      // use multilingualism? => translate content of own website area
      if ( self.lang ) self.lang.render();

      // perform callback
      if ( callback ) callback();

    };

  }

  /*------------------------------------------------ type definitions ------------------------------------------------*/

  /**
   * @summary ccm instance configuration
   * @typedef {ccm.config} ccm.components.content.config
   * @property {ccm.element} element - website area of ccm instance
   * @property {string} classes - CSS classes for website area
   * @property {ccm.style} style - CSS for website area
   * @property {ccm.components.content.lang} lang - instance for multilingualism
   * @property {ccm.html} content - ccm html data for content
   */

  /**
   * @summary expected interfaces of ccm instance for multilingualism
   * @typedef {ccm.instance} ccm.components.content.lang
   * @property {function} render - render content of own website area in current language
   */

} );