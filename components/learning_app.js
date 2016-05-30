/**
 * @overview ccm connector for learning apps from http://learningapps.org
 * @author Manfred Kaul <manfred.kaul@h-brs.de>, 2016
 * @license The MIT License (MIT)
 * @link http://learningapps.org
 */

ccm.component( {

  /*-------------------------------------------- public component members --------------------------------------------*/

  /**
   * component name
   * @type {string}
   * @ignore
   */
  name: 'learning_app',

  /**
   * @summary default instance configuration
   * @type {ccm.components.learning_app.config}
   * @ignore
   */
  config: {

    key: '1661469', // key of learning app, see http://learningapps.org
    style: [ ccm.load, './css/learning_app.css' ]

  },


  /*-------------------------------------------- public component classes --------------------------------------------*/

  /**
   * @alias ccm.components.learning_app
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
     * @summary render content in own website area
     * @param {function} [callback] - callback when instance is rendered
     */
    this.render = function ( callback ) {

      /**
       * website area for own content
       * @type {ccm.element}
       */
      var element = ccm.helper.element( self );

      // render learning_app into own website area
      element.html(
        '<iframe frameborder="0" webkitallowfullscreen="true" mozallowfullscreen="true">' +
        ' Your browser doesn´t support iframes. ' +
        '</iframe>'
      );

      loadIframe( '//LearningApps.org/watch?app=' + self.key );

      // perform callback
      if ( callback ) callback();

      function loadIframe( url ) {
        var iframe = element.find('iframe');
        if ( iframe.length ) {
          iframe.attr('src',url);
          return false;
        }
        return true;
      }

    };

  }

  /*------------------------------------------------ type definitions ------------------------------------------------*/

  /**
   * @summary ccm instance configuration
   * @typedef {ccm.config} ccm.components.learning_app.config
   * @property {ccm.element} element - website area of ccm instance
   */

} );

