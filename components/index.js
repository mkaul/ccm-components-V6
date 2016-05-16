/**
 * @overview index of ccm components in this GitHub Repository for demos
 * @author Manfred Kaul <manfred.kaul@h-brs.de> 2016
 * @license The MIT License (MIT)
 */

ccm.component( {

  /*-------------------------------------------- public component members --------------------------------------------*/

  /**
   * @summary component name
   * @memberOf ccm.components.index
   * @type {ccm.name}
   */
  name: 'index',

  /**
   * @summary default instance configuration
   * @memberOf ccm.components.index
   * @type {ccm.components.index.config}
   */
  config: {

    html:  [ ccm.load, './json/index_html.json' ],  // html template
    key:   'index',                                  // key in ccm.store
    store: [ ccm.store, './json/index.json' ],      // data store
    style: [ ccm.load, './css/index.css' ], 

    // *** import subcomponents ***
    lang:     [ ccm.instance,  'http://mkaul.github.io/ccm-components/lib/components/lang.js', { store: [ ccm.store, './json/index_lang.json' ] } ],
    langmenu: [ ccm.instance,  'http://mkaul.github.io/ccm-components/lib/components/langmenu.js', { element: jQuery('#langmenu'), context: false, selected: 'en' } ],
    menu:     [ ccm.component, './components/menu.js' ]

  },

  /*-------------------------------------------- public component classes --------------------------------------------*/

  /**
   * @summary constructor for creating <i>ccm</i> instances out of this component
   * @alias ccm.components.index.index
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

      // render main html structure
      element.html( ccm.helper.html( self.html.main ) );

      render_menu();

      // render language selection
      if ( self.langmenu ) self.langmenu.render();

      // translate own content
      if ( self.lang ) self.lang.render();

      // perform callback
      if ( callback ) callback();

      function render_menu(){

        // get dataset for rendering
        ccm.helper.dataset( self, function ( dataset ) {

          // dataset is an object with indices 0,1,2,3, ... and string values
          // convert dataset into an array of strings
          var array_of_components = Object.keys(dataset).reduce(function(collector,index) {

              collector.push(dataset[index]);
              return collector;
            },
            [] // initial empty collector
          ); // end of array_of_components construction


          // compute menu config from dataset
          self.menu.render( {

            element: element.find('> #menu'),

            entries:

              array_of_components.reduce( function( all_config_elements, next_component ) {

                  all_config_elements.push(
                    {
                      label:   next_component,
                      content: [ ccm.proxy, './components/' + next_component + '.js' ],
                      lang:     [ ccm.instance,  './components/lang.js', { store: [ ccm.store, './json/' + next_component + '_lang.json' ] } ],
                      actions: [ function () {
                        // TODO langmenu_component.addObserver( this.render );
                      } ]
                    }
                  );
                  return all_config_elements;
                },

                [] // empty initial all_config_elements
              )
          } );

        } );

      }

    };

  }

  /*------------------------------------------------ type definitions ------------------------------------------------*/

  /**
   * @namespace ccm.components.index
   */

  /**
   * @summary <i>ccm</i> instance configuration
   * @typedef {ccm.config} ccm.components.index.config
   * @property {string} classes - css classes for own website area
   * @property {ccm.element} element - own website area
   * @property {Object.<ccm.key, ccm.html>} html - <i>ccm</i> html data templates for own content
   * @property {ccm.key} key - key of [index dataset]{@link ccm.components.index.dataset} for rendering
   * @property {ccm.store} store - <i>ccm</i> datastore that contains the [index dataset]{@link ccm.components.index.dataset} for rendering
   * @property {ccm.style} style - css for own content
   * ...
   */

  /**
   * @summary index dataset for rendering
   * @typedef {ccm.dataset} ccm.components.index.dataset
   * @property {ccm.key} key - dataset key
   * ...
   */

  // ...

} );