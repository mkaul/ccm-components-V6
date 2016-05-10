/**
 * @overview cloud client app - your personal apps in the cloud
 * @author mkaul2m <Manfred.Kaul@h-brs.de>, 2015
 * derived from se1_final_app.js by mkaul2m and akless2m Andre Kless <andre.kless@h-brs.de>, 2015
 * @license The MIT License (MIT)
 */

ccm.component( {

  /*-------------------------------------------- public component members --------------------------------------------*/

  /**
   * component name
   * @type {string}
   * @ignore
   */
  name: 'cloud_client_app',

  /**
   * @summary default instance configuration
   * @type {ccm.components.cloud_client_app.config}
   * @ignore
   */
  config: {

    style: [ ccm.load, './css/cloud_client_app.css' ],
    user:  [ ccm.instance, './components/user.js', {

      lang: [ ccm.instance, './components/lang.js' ],
      style: null,
      text_logout: '&#9032;'

    } ],
    bigdata: [ ccm.instance, './components/bigdata.js' ],
    store: [ ccm.store, { store: 'user', url: 'https://ccm.inf.h-brs.de:8888/index.js' } ],
    store2: [ ccm.store, { store: 'user', url: 'https://kaul.inf.h-brs.de/data/points.php' } ]
    // see givePoints and givePoints2 function below

  },

  /*-------------------------------------------- public component classes --------------------------------------------*/

  /**
   * @alias ccm.components.cloud_client_app
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

      ccm.load(

        ccm.loading_icon,
        './components/content.js',
        './components/issue.js',
        './components/menu.js',
        './components/fontresizer.js',
        './json/lang_issue.json',
        './json/lang_fontresizer.json'

      );

      if ( callback ) callback();

    };

    /**
     * @summary render web app in own website area
     * @param {function} [callback] - callback when instance is rendered
     */
    this.render = function ( callback ) {

      /**
       * website area for own content
       * @type {ccm.element}
       */
      var element = ccm.helper.element( self );

      // render web app
      ccm.render( './components/content.js', {

        parent:      self,
        element:     element,
        user:        self.user,
        issue:       [ ccm.instance, './components/issue.js', {

          lang: [ ccm.instance, './components/lang.js', { store: [ ccm.store, './json/lang_issue.json' ] } ]

        } ],
        menu:        [ ccm.instance, './components/menu.js', {

          style: null,
          classes: 'cloud_client_app_menu1',
          entries: [

            {
              label: 'WE',
              content: todo('WE app')
            },

            {
              label: 'KLR',
              content: todo('KLR app')
            },

            {
              label: 'AppStore', // =============   AppStore   =============
              content: todo('AppStore app: use Market Place of components and apps via drag and drop'),
              actions: function () {}
            },

            {
              label: 'Einstellungen', // =============   Einstellungen   =============
              content: todo(' Persönliche Einstellungen des <i>cca</i> '),
              actions: function () {}
            }
          ]

        } ],
        fontresizer: [ ccm.instance, './components/fontresizer.js', {

          lang: [ ccm.instance, 'components/lang.js', { store: [ ccm.store, './json/lang_fontresizer.json' ] } ]

        } ],

        // ============================================== Header Buttons ==============================================
        content: [

          '<div class="cloud_client_app_right">' +
          '<div id="content#user"></div>' +
          '<div id="content#issue"></div>' +
          '<div id="content#fontresizer"></div>' +
          '</div>' +
          '<div class="cloud_client_app_title">CLOUD CLIENT APP (CCA)</div>' +
          '<div id="content#menu"></div>' +
          '<div><img src="http://kaul.inf.h-brs.de/ccm/img/cca.jpg"></div>'

        ]

      } );

      // perform callback
      if ( callback ) callback();

      function todo( key ) {
        return [ ccm.proxy, './components/content.js', { content: '<h2>ToDo: ' + key + '</h2>' } ];
      }

      /*
       * function for composing contents directly
       * @param args = arbitrary number of contents components or strings
       * */
      function contents( args ) {
        var contents_config = {};
        var contents_divs = '';

        // iterate over all contents arguments
        for (var i = 0; i < arguments.length; i++) {
          var key = 'key_' + i;
          var key_or_content = arguments[i];

          if ( typeof key_or_content === 'object' ){

            contents_config[key] = key_or_content;
            contents_divs += '<div id="content#' + key + '"></div>';

          } else if (key_or_content.indexOf('<') === 0) {

            // typeof key_or_content === 'string'
            // key_or_content is the HTML content itself
            contents_divs += key_or_content;

          } else {

            // key_or_content is the key in the JSON file
            contents_config[key] = [ ccm.proxy, './components/content.js',
              [ ccm.dataset, './json/se1.json', key_or_content ] ];
            contents_divs += '<div id="content#' + key + '"></div>';
          }
        }
        contents_config['content'] = contents_divs;
        return [ ccm.proxy, './components/content.js', contents_config ];
      }



      /**
       * generate form dependency
       * @param {ccm.key} key - form dataset key
       * @returns {Array} generated form dependency
       */
      function form( key, points, deadline ) {

        return [ ccm.proxy, './components/form.js', {

          classes: 'ccm-form cloud_client_app_form',
          key: key,
          points: points,
          deadline: deadline,
          form_elements: [ ccm.store, './json/se1.json' ], // Flat File
          // form_store: [ ccm.store, { db: 'mongodb', store: 'form', url: 'http://ccm.inf.h-brs.de:8080/index.js' } ] // MongoDB
          // form_store: [ ccm.store, { db: 'redis', store: 'form', url: 'http://ccm.inf.h-brs.de:8080/index.js' } ] // Redis
          form_store: [ ccm.store, { store: 'form',
            url: 'https://ccm.inf.h-brs.de:8888/index.js'      // MongoDB
            // url: 'https://kaul.inf.h-brs.de/data/store.php' // MySQL
          } ],
          submit_callback: function( instance, value_hash ){
            if ( points && points > 0 && not_empty( value_hash ) ) {
              givePoints2( key, points );
            }
          },

          style: [ ccm.load, './css/form.css' ],
          user: null,
          lang: [ ccm.instance, './components/lang.js', { store: [ ccm.store, './json/lang_form.json' ] } ],
          rawdeflate: [ ccm.load, './lib/rawdeflate.js' ],
          helper: [ ccm.load, './lib/helper_mkaul.js' ]

        } ];

      }

    }

  }

  /*------------------------------------------------ type definitions ------------------------------------------------*/

  /**
   * @summary ccm instance configuration
   * @typedef {ccm.config} ccm.components.cloud_client_app.config
   * @property {ccm.element} element - website area of ccm instance
   * @property {string} classes - CSS classes for website area
   * @property {ccm.style} style - CSS for website area
   * @property {ccm.components.cloud_client_app.user} user - instance for user
   */

  /**
   * @summary user instance
   * @typedef {ccm.dataset} ccm.components.cloud_client_app.user
   * @property {ccm.key} key - user dataset key
   */

} );