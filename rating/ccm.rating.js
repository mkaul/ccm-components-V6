/**
 * @overview  <i>ccm</i> component for rating
 * @author Tea Kless <tea.kless@smail.inf.h-brs.de> 2016
 * @copyright Copyright (c) 2016 Bonn-Rhein-Sieg University of Applied Sciences
 * @license The MIT License (MIT)
 */

ccm.component( {

  /*-------------------------------------------- public component members --------------------------------------------*/

  /**
   * @summary component name
   * @memberOf ccm.components.rating
   * @type {ccm.name}
   */
  name: 'rating',

  /**
   * @summary default instance configuration
   * @memberOf ccm.components.rating
   * @type {ccm.components.rating.config}
   */
  config: {
    icons: [ ccm.load,      'https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css' ],
    key:   'demo',
    mode:  'thumbs', //stars or thumbs
    store: [ ccm.store, '../rating/rating.json' ],
    style: [ ccm.load, '../rating/rating.css' ],
    user:  [ ccm.instance, 'http://kaul.inf.h-brs.de/ccm/components/user2.js' ]
  },

  /*-------------------------------------------- public component classes --------------------------------------------*/

  /**
   * @summary constructor for creating <i>ccm</i> instances out of this component
   * @alias ccm.components.rating.Rating
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

    this.init = function ( callback ) {

      // listen to change event of ccm realtime datastore => update own content
      self.store.onChange = function () { self.render(); };

      // perform callback
      callback();

    };

    this.ready = function ( callback ) {

      if ( self.user ) self.user.addObserver( function () { self.render(); } );
      callback();

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

      // render main html structure
      element.html( ccm.helper.html( { class: 'rating' } ) );

      // get dataset for rendering
      ccm.helper.dataset( self, function ( dataset ) {

        if ( self.mode === 'thumbs' ) renderThumbs();

        if ( self.mode === 'stars') renderStars();

        // perform callback
        if ( callback ) callback();

        function renderThumbs() {

          // set default like and dislike property
          if ( !dataset.likes    ) dataset.likes    = {};
          if ( !dataset.dislikes ) dataset.dislikes = {};

          ccm.helper.find( self, '.rating' ).html(
              '<div class="likes fa fa-lg fa-thumbs-up">' +
              '<div>' + ( dataset.likes ? Object.keys( dataset.likes ).length : 0 ) + '</div>' +
              '</div>&nbsp;' +
              '<div class="dislikes fa fa-lg fa-thumbs-down">' +
              ' <div>' + ( dataset.dislikes ? Object.keys( dataset.dislikes ).length : 0 ) + '</div>' +
              '</div>' );

          var rating_div = ccm.helper.find( self, '.rating' );

          // ccm instance for user authentication not exists? => abort
          if ( !self.user ) return;

          /**
           * website area for likes and dislikes
           * @type {{likes: ccm.element, dislikes: ccm.element}}
           */
          var div = {

            likes:    ccm.helper.find( self, rating_div, '.likes'    ),
            dislikes: ccm.helper.find( self, rating_div, '.dislikes' )

          };

          // add class for user specific interactions
          rating_div.addClass( 'user' );

          // user is logged in?
          if ( self.user.isLoggedIn() ) {

            /**
             * username
             * @type {string}
             */
            var user = self.user.data().key;

            // highlight button if already voted
            if ( dataset.likes   [ user ] ) div[ 'likes'    ].addClass( 'selected' );
            if ( dataset.dislikes[ user ] ) div[ 'dislikes' ].addClass( 'selected' );
          }


          // set click events for like and dislike buttons
          click( 'likes', 'dislikes' );
          click( 'dislikes', 'likes' );

          /**
           * set click event for like or dislike button
           * @param {string} index - button index ('likes' or 'dislikes')
           * @param {string} other - opposite of index value
           */
          function click( index, other ) {

            // set click event
            div[ index ].click( function() {

              // login user if not logged in
              self.user.login( function () {

                /**
                 * username
                 * @type {string}
                 */
                var user = self.user.data().key;

                // has already voted?
                if ( dataset[ index ][ user ] ) {

                  // revert vote
                  delete dataset[ index ][ user ];

                }
                // not voted
                else {

                  // proceed voting
                  dataset[ index ][ user ] = true;

                  // revert voting of opposite category
                  delete dataset[ other ][ user ];

                }

                // update dataset for rendering
                self.store.set( dataset, function () { self.render(); } );

              } );

            } );

          }
        }

        function renderStars() {

          // set default like and dislike property
          if ( !dataset.stars     ) dataset.stars     = {};
          if ( !dataset.star_vote ) dataset.star_vote = '0';

          var rating_div = ccm.helper.find( self, '.rating' );
          var star;
          var rating = 0; //dataset.star_vote;

          // user is logged in?
          if ( self.user && self.user.isLoggedIn() ) {
            if ( dataset.stars[ self.user.data().key ] ) {
              rating = dataset.stars[ self.user.data().key ];
            }
          }

          for ( var i = 1; i <= 5; i++ ){

            if ( rating >= i )
              star = jQuery( '<div>&#9733;</div>' );
            else
              star = jQuery( '<div>&#9734;</div>' );

            star.on( 'click', click() );
            rating_div.append( star );
          }

          rating_div.append( '&nbsp;('+ dataset.star_vote +')' );

          function click() {

            return function () {

              var star_selected = jQuery( this ).index();

              if ( self.user ) {

                self.user.login( function () {

                  var user = self.user.data().key;

                  jQuery( this ).addClass( 'selected' );

                  dataset.stars[ user ] = star_selected + 1;

                  //build avarage from stars
                  var votes = 0;
                  for ( var key in dataset.stars )
                    votes += dataset.stars[ key ];
                  dataset.star_vote = Math.round( ( votes / Object.keys( dataset.stars ).length ) * 10 ) / 10;

                  self.store.set( dataset, function () { self.render(); } );

                } );
              }
            }

          }
        }

      } );

    };

  }

  /*------------------------------------------------ type definitions ------------------------------------------------*/

  /**
   * @namespace ccm.components.rating
   */

  /**
   * @summary <i>ccm</i> instance configuration
   * @typedef {ccm.config} ccm.components.rating.config
   * @property {string} classes - css classes for own website area
   * @property {ccm.element} element - own website area
   * @property {Object.<ccm.key, ccm.html>} html - <i>ccm</i> html data templates for own content
   * @property {ccm.key} key - key of [rating dataset]{@link ccm.components.rating.dataset} for rendering
   * @property {ccm.instance} lang - <i>ccm</i> instance for multilingualism
   * @property {ccm.store} store - <i>ccm</i> datastore that contains the [rating dataset]{@link ccm.components.rating.dataset} for rendering
   * @property {ccm.style} style - css for own content
   * @property {ccm.instance} user - <i>ccm</i> instance for user authentication
   */

  /**
   * @summary rating dataset for rendering
   * @typedef {ccm.dataset} ccm.components.rating.dataset
   * @property {ccm.key} key - dataset key
   * ...
   */

} );