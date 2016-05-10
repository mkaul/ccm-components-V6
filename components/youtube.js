/**
 * @overview <i>ccm</i> component for [youtube player]{@link https://developers.google.com/youtube/iframe_api_reference}
 * @author André Kless <andre.kless@h-brs.de> 2016
 * @copyright Copyright (c) 2016 Bonn-Rhein-Sieg University of Applied Sciences
 * @license The MIT License (MIT)
 */

ccm.component( {

  /*-------------------------------------------- public component members --------------------------------------------*/

  /**
   * @summary component name
   * @memberOf ccm.components.youtube
   * @type {ccm.name}
   */
  name: 'youtube',

  /**
   * @summary default instance configuration
   * @memberOf ccm.components.youtube
   * @type {ccm.components.youtube.config}
   */
  config: {

    html:   [ ccm.load, './json/youtube_html.json' ],
    key:    'M7lc1UVf-VE',
    store:  [ ccm.store ],
    style:  [ ccm.load, './css/youtube.css' ],
    user:   [ ccm.instance, './components/user.js' ]

  },

  /**
   * @summary waitlist of init callbacks from own instances that wait for loaded youtube iframe api
   * @description This property will be removed by <i>ccm</i> after initialisation.
   * @memberOf ccm.components.youtube
   * @type {function[]}
   */
  waiter: [],

  /*-------------------------------------------- public component methods --------------------------------------------*/

  /**
   * @summary initialize <i>ccm</i> component
   * @memberOf ccm.components.youtube
   * @description
   * Called one-time when this <i>ccm</i> component is registered and before any ccm instance is created out of this component.
   * There is no guarantee that a asynchron operation in this init function is finished before the call of own instance init functions.
   * This method will be removed by <i>ccm</i> after the one-time call.
   * @param {function} callback - callback when this instance is initialized
   */
  init: function ( callback ) {

    /**
     * reference to this component
     * @type {ccm.component}
     */
    var self = this;

    // set global ready callback of youtube iframe api
    window.onYouTubeIframeAPIReady = function () {

      // finish initialisation of waiting own instances
      for ( var i = 0; i < self.waiter.length; i++ )
        self.waiter[ i ]();

      // delete waitlist property
      delete self.waiter;

      // perform callback
      if ( callback ) callback();

    };

    // load youtube iframe api
    jQuery.getScript( 'https://www.youtube.com/iframe_api' );

  },

  /*-------------------------------------------- public component classes --------------------------------------------*/
  
  /**
   * @summary constructor for creating <i>ccm</i> instances out of this component
   * @alias ccm.components.youtube.Youtube
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
     * @summary [youtube player]{@link https://developers.google.com/youtube/iframe_api_reference#Playback_controls}
     * @type {object}
     */
    this.player = null;

    /*------------------------------------------- public instance methods --------------------------------------------*/

    /**
     * @summary initialize <i>ccm</i> instance
     * @description
     * Called one-time when this <i>ccm</i> instance is created, all dependencies are solved and before dependent <i>ccm</i> components, instances and datastores are initialized.
     * This method will be removed by <i>ccm</i> after the one-time call.
     * @param {function} callback - callback when this instance is initialized
     */
    this.init = function ( callback ) {

      // loading of youtube iframe api not finished? => wait for finish
      if ( self.component.waiter ) self.component.waiter.push( callback ); else callback();

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

      // get dataset for rendering
      ccm.helper.dataset( self, function ( dataset ) {

        /**
         * id of the website area for own content
         * @type {string}
         */
        var id = ccm.helper.getElementID( self );

        /**
         * player event listener
         * @type {object}
         */
        var events = {};

        // set player event listener
        if ( self.onReady                 ) { events.onReady                 = self.onReady;                 delete self.onRead;                  }
        if ( self.onStateChange           ) { events.onStateChange           = self.onStateChange;           delete self.onStateChange;           }
        if ( self.onPlaybackQualityChange ) { events.onPlaybackQualityChange = self.onPlaybackQualityChange; delete self.onPlaybackQualityChange; }
        if ( self.onPlaybackRateChange    ) { events.onPlaybackRateChange    = self.onPlaybackRateChange;    delete self.onPlaybackRateChange;    }
        if ( self.onError                 ) { events.onError                 = self.onError;                 delete self.onError;                 }
        if ( self.onApiChange             ) { events.onApiChange             = self.onApiChange;             delete self.onApiChange;             }

        // render main html structure
        element.html( ccm.helper.html( self.html.main, { id: id } ) );

        // embed youtube player
        self.player = new YT.Player( id + '_iframe', {

          height:     self.height,
          width:      self.width,
          videoId:    dataset.id || dataset.key,
          playerVars: self.vars,
          events:     events

        } );

        // perform callback
        if ( callback ) callback();

      } );

    };

  }
  
  /*------------------------------------------------ type definitions ------------------------------------------------*/

  /**
   * @namespace ccm.components.youtube
   */

  /**
   * @summary <i>ccm</i> instance configuration
   * @typedef {ccm.config} ccm.components.youtube.config
   * @property {string} classes - css classes for own website area
   * @property {ccm.element} element - own website area
   * @property {ccm.key} key - key of [youtube dataset]{@link ccm.components.youtube.dataset} for rendering
   * @property {ccm.store} store - <i>ccm</i> datastore that contains the [youtube dataset]{@link ccm.components.youtube.dataset} for rendering
   * @property {ccm.style} style - css for own content
   * @property {ccm.instance} user - <i>ccm</i> instance for user authentication
   *
   * @property {number} width - player width (default: 640)
   * @property {number} height - player height (default: 390)
   * @property {object} vars - [player parameter]{@link https://developers.google.com/youtube/player_parameters#Parameters}
   * @property {function} onReady - [onReady]{@link https://developers.google.com/youtube/iframe_api_reference#onReady} callback
   * @property {function} onStateChange - [onStateChange]{@link https://developers.google.com/youtube/iframe_api_reference#onStateChange} callback
   * @property {function} onPlaybackQualityChange - [onPlaybackQualityChange]{@link https://developers.google.com/youtube/iframe_api_reference#onPlaybackQualityChange} callback
   * @property {function} onPlaybackRateChange - [onPlaybackRateChange]{@link https://developers.google.com/youtube/iframe_api_reference#onPlaybackRateChange} callback
   * @property {function} onError - [onError]{@link https://developers.google.com/youtube/iframe_api_reference#onError} callback
   * @property {function} onApiChange - [onApiChange]{@link https://developers.google.com/youtube/iframe_api_reference#onApiChange} callback
   */

  /**
   * @summary chat dataset for rendering
   * @typedef {ccm.dataset} ccm.components.youtube.dataset
   * @property {ccm.key} key - dataset key
   * @property {string} id - youtube video id
   */

} );