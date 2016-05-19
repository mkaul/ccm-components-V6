/**
 * @overview geogebra
 * @author mkaul2m <Manfred.Kaul@h-brs.de>, 2015-2016
 * @license The MIT License (MIT)
 * @see https://www.geogebra.org/wiki/en/Reference:Applet_Embedding
 *      https://dev.geogebra.org/trac/wiki/GeoGebraWeb
 *      https://github.com/geogebra/geogebra
 *      https://tube.geogebra.org
 */

ccm.component( {

  /*-------------------------------------------- public component members --------------------------------------------*/

  /**
   * @summary component name
   * @memberOf ccm.components.geogebra
   * @type {ccm.name}
   */
  name: 'geogebra',

  /**
   * @summary default instance configuration
   * @memberOf ccm.components.geogebra
   * @type {ccm.components.geogebra.config}
   */
  config: {

    // https://www.geogebra.org/wiki/en/Reference:Applet_Embedding
    geogebra:  [ ccm.load, 'http://tube.geogebra.org/scripts/deployggb.js' ],
    applet: { material_id: "17499", borderColor:"#55FF00" }

  },

  /*-------------------------------------------- public component classes --------------------------------------------*/

  /**
   * @summary constructor for creating <i>ccm</i> instances out of this component
   * @alias ccm.components.geogebra.geogebra
   * @class
   */
  Instance: function () {

    /*------------------------------------- private and public instance members --------------------------------------*/

    /**
     * @summary own context
     * @private
     */
    var self = this;

    /*------------------------------------------- public instance methods --------------------------------------------*/
    

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

      element.html(
        '<div id="applet_container"></div>'
      );

      var applet = new GGBApplet( self.applet, true );
      applet.inject( 'applet_container', 'preferHTML5' );

      // translate own content
      if ( self.lang ) self.lang.render();

      // perform callback
      if ( callback ) callback();

    };

  }

  /*------------------------------------------------ type definitions ------------------------------------------------*/

  /**
   * @namespace ccm.components.geogebra
   */

  /**
   * @summary <i>ccm</i> instance configuration
   * @typedef {ccm.config} ccm.components.geogebra.config
   * @property {string} classes - css classes for own website area
   * @property {ccm.element} element - own website area
   * @property {Object.<ccm.key, ccm.html>} html - <i>ccm</i> html data templates for own content
   * @property {ccm.key} key - key of [geogebra dataset]{@link ccm.components.geogebra.dataset} for rendering
   * @property {ccm.instance} lang - <i>ccm</i> instance for multilingualism
   * @property {ccm.store} store - <i>ccm</i> datastore that contains the [geogebra dataset]{@link ccm.components.geogebra.dataset} for rendering
   * @property {ccm.style} style - css for own content
   * @property {ccm.instance} user - <i>ccm</i> instance for user authentication
   * ...
   */

  /**
   * @summary geogebra dataset for rendering
   * @typedef {ccm.dataset} ccm.components.geogebra.dataset
   * @property {ccm.key} key - dataset key
   * ...
   */

  // ...

} );