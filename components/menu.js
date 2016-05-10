/**
 * @overview ccm component for menu
 * @author Andre Kless <andre.kless@h-brs.de> 2015
 * @license The MIT License (MIT)
 */

ccm.component( {

  /*-------------------------------------------- public component members --------------------------------------------*/

  /**
   * component name
   * @type {string}
   * @ignore
   */
  name: 'menu',

  /**
   * @summary default instance configuration
   * @type {ccm.components.menu.config}
   * @ignore
   */
  config: {

    style: [ ccm.load, './css/menu.css' ],
    entries: [

      {
        label: 'teambuild',
        content: [ ccm.proxy, './components/teambuild.js' ],
        actions: [ function () { console.log( 'a' ); }, function () { console.log( 'b' ); } ]
      },

      {
        label: 'chat',
        content: [ ccm.proxy, './components/chat.js' ],
        actions: [ function () { console.log( '1' ); }, function () { console.log( '2' ); } ]
      },

      {
        label: 'checklist',
        content: [ ccm.proxy, './components/checklist.js' ],
        actions: [ function () { console.log( 'x' ); }, function () { console.log( 'y' ); } ]
      }

    ]

  },

  /*-------------------------------------------- public component classes --------------------------------------------*/

  /**
   * @alias ccm.components.menu
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

      // iterate over menu entries content
      for ( var i = 0; i < self.entries.length; i++ ) {

        /**
         * menu entry content
         * @type {ccm.components.menu.entry}
         */
        var entry = self.entries[ i ];

        // set ccm instance website area
        if ( ccm.helper.isInstance( entry.content ) )
          entry.content.element = self.element.find( '.menu_content' );

      }

      if ( callback ) callback();

    };

    /**
     * @summary render content in own website area
     * @param {function} [callback] - callback when ccm instance is rendered (first parameter is ccm instance)
     */
    this.render = function ( callback ) {

      /**
       * website area for own content
       * @type {ccm.element}
       */
      var element = ccm.helper.element( self );

      /**
       * website area for menu entries
       * @type {ccm.element}
       */
      var entries_div = jQuery( '<div class="menu_entries"></div>' );

      /**
       * website area for menu entries content
       * @type {ccm.element}
       */
      var content_div = jQuery( '<div class="menu_content"></div>' );

      // iterate over menu entries => render menu entries
      for ( var i = 0; i < self.entries.length; i++ )
        renderMenuEntry( self.entries[ i ], i );

      // render website area for menu entries and menu entries content in own website area
      element.html( entries_div ).append( content_div );

      // use multilingualism? => translate content of own website area
      if ( self.lang ) self.lang.render();

      // perform callback
      if ( callback ) callback();

      /**
       * render menu entry
       * @param {ccm.components.menu.entry} entry - menu entry dataset
       * @param {number} index - menu entry array index
       */
      function renderMenuEntry( entry, index ) {

        /**
         * website area for menu entry
         * @type {ccm.element}
         */
        var entry_div = jQuery( '<div class="menu_entry"></div>' );

        entry_div.html( ccm.helper.val( entry.label ) );

        // set menu entry click event
        entry_div.click( function ( event ) {

          // no click action for specific inner elements
          //if ( jQuery( this ).find( '.noclick' ).find( event.target ).length > 0 ) { event.preventDefault(); return; }
          //var target = jQuery( event.target );
          //if ( target.is( '.noclick' ) || target.closest( '.noclick' ).length > 0 ) { event.preventDefault(); return; }

          // highlight selected menu entry
          element.find( '.menu_entry' ).removeClass( 'menu_selected' );
          jQuery( this ).addClass( 'menu_selected' );

          // clear website area for menu entry content
          content_div.html( '' );

          // render menu entry content
          if ( entry.content ) {

            // content is ccm instance? => render content by ccm instance
            if ( ccm.helper.isInstance( entry.content ) ) entry.content.render();

            // content is ccm html data? => render content by ccm html data
            else if ( typeof ( entry.content ) === 'object' ) return content_div.html( ccm.helper.html( entry.content ) );

            // render content
            else content_div.html( ccm.helper.val( entry.content ) );

          }

          // perform menu entry action(s)
          if ( entry.actions )
            if ( typeof ( entry.actions ) === 'function' )
              entry.actions( self, index );
            else
              for ( var i = 0; i < entry.actions.length; i++ )
                ccm.helper.action( entry.actions[ i ], index );

        } ).find( '.noclick' ).click( function ( event ) { event.stopPropagation(); } );

        // append website area for menu entry to website area for menu entries
        entries_div.append( entry_div );

      }

    }

  }

  /*------------------------------------------------ type definitions ------------------------------------------------*/

  /**
   * @summary ccm instance configuration
   * @typedef {ccm.config} ccm.components.menu.config
   * @property {ccm.element} element - website area of ccm instance
   * @property {string} classes - CSS classes for website area
   * @property {ccm.style} style - CSS for website area
   * @property {ccm.components.menu.lang} lang - instance for multilingualism
   * @property {ccm.components.menu.entry[]} entries - menu entries
   */

  /**
   * @summary menu entry dataset
   * @typedef {object} ccm.components.menu.entry
   * @property {string} label - menu entry label
   * @property {string|ccm.html|ccm.instance} content - menu entry content
   * @property {ccm.action[]} actions - menu entry actions
   */

  /**
   * @summary expected interfaces of ccm instance for multilingualism
   * @typedef {ccm.instance} ccm.components.menu.lang
   * @property {function} render - render content of own website area in current language
   */

} );