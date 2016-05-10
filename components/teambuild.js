/**
 * @overview <i>ccm</i> component for team building
 * @author André Kless <andre.kless@h-brs.de> 2015-2016
 * @copyright Copyright (c) 2015-2016 Bonn-Rhein-Sieg University of Applied Sciences
 * @license The MIT License (MIT)
 */

ccm.component( {

  /*-------------------------------------------- public component members --------------------------------------------*/

  /**
   * @summary component name
   * @memberOf ccm.components.teambuild
   * @type {ccm.name}
   */
  name: 'teambuild',

  /**
   * @summary default instance configuration
   * @memberOf ccm.components.teambuild
   * @type {ccm.components.teambuild.config}
   */
  config: {

    html: [ ccm.load, './json/teambuild_html.json' ],
    icons: [ ccm.load, 'https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css' ],
    icon:  {
      team: 'group',
      member: 'user'
    },
    key:   'demo',
    lang:  [ ccm.instance, './components/lang.js', { store: [ ccm.store, './json/teambuild_lang.json' ] } ],
    store: [ ccm.store, { db: 'redis', store: 'team', url: 'wss://ccm.inf.h-brs.de:8888/index.js' } ],
    style: [ ccm.load, './css/teambuild.css' ],
    text:  {
      free:  'lang#free',
      join:  'lang#join',
      leave: 'lang#leave',
      team:  'lang#team'
    },
    user:  [ ccm.instance, './components/user.js', { element: 'name' } ]

  },

  /*-------------------------------------------- public component classes --------------------------------------------*/

  /**
   * @summary constructor for creating <i>ccm</i> instances out of this component
   * @alias ccm.components.teambuild.Teambuild
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
     * @summary when <i>ccm</i> instance is ready
     * @description
     * Called one-time when this <i>ccm</i> instance and dependent <i>ccm</i> components, instances and datastores are initialized and ready.
     * This method will be removed by <i>ccm</i> after the one-time call.
     * @param {function} callback - callback when this instance is ready
     */
    this.ready = function ( callback ) {

      // listen to ccm realtime datastore change event
      self.store.onChange = update;

      // listen to login/logout event
      if ( self.user ) self.user.addObserver( update );

      // log event
      if ( self.bigdata ) self.bigdata.log( 'ready' );

      // perform callback
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

      // get dataset for rendering
      ccm.helper.dataset( self, function ( dataset ) {

        // team building dataset has no teams? => add empty team
        if ( !dataset.teams ) dataset.teams = [];

        // render main html structure
        element.html( ccm.helper.html( self.html.main ) );

        // render team entries
        renderTeams();

        // translate own content
        if ( self.lang ) self.lang.render();

        // perform callback
        if ( callback ) callback();

        /**
         * render team entries
         */
        function renderTeams() {

          // render team entries
          for ( var i = 0; i < dataset.teams.length; i++ )
            renderTeam( dataset.teams[ i ], i + 1 );

          // number of teams is limited? => add missing empty team entries
          if ( dataset.max_teams )
            while ( dataset.max_teams > ccm.helper.find( self, '.team' ).length )
              addEmptyTeam();

          // number of teams is unlimited, last team is not empty and teams are joinable? => add empty team entry
          else if ( ( dataset.teams.length === 0 || !isEmptyTeam( dataset.teams[ dataset.teams.length - 1 ] ) ) && joinableTeams() ) addEmptyTeam();

          /**
           * render team entry
           * @param {ccm.components.teambuild.team} team - team dataset
           * @param {number} [nr] - team number (default is number of existing teams)
           */
          function renderTeam( team, nr ) {

            // generate team number if necessary
            if ( !nr ) nr = dataset.teams.length;

            /**
             * team name
             * @type {string}
             */
            var name = team.name ? team.name : self.text.team + ( self.lang ? '#' : ' ' ) + nr;

            /**
             * team entry
             * @type {ccm.element}
             */
            var team_div = ccm.helper.html( self.html.team, {

              icon: ccm.helper.val( self.icon.team ),
              name: ccm.helper.val( name )

            } );

            /**
             * maximum number of team members
             * @type {number}
             */
            var max_members = team.max_members || dataset.max_members;

            /**
             * user dataset
             * @type {object}
             */
            var user;

            /**
             * user team number
             * @type {number}
             */
            var user_team_nr;

            // allow value '-1' for unlimited number of team members
            if ( max_members === -1 ) max_members = null;

            // user is logged in?
            if ( self.user && self.user.isLoggedIn() ) {

              // remember username
              user = self.user.data();

              // remember user team number
              user_team_nr = getUserTeamNr();

              // user is team member?
              if ( isMember( team ) ) {

                // team name is editable? => make team name editable
                if ( isEditable( 'rename' ) ) makeEditable();

                // is leavable team? => render leave button
                if ( isEditable( 'leave' ) ) renderLeaveButton();

              }

              // is joinable team? => render join button
              else if ( isJoinable() ) renderJoinButton();

            }

            // render team members
            renderMembers();

            // render team entry
            ccm.helper.find( self, '.teams' ).append( team_div );

            /**
             * checks if user is a team member of a specific team
             * @param {ccm.components.teambuild.team} team - team dataset
             * @returns {boolean}
             */
            function isMember( team ) {

              return !!team.members[ user.key ];

            }

            /**
             * checks if a specific action for editing is allowed
             * @param {string} action - 'join', 'leave', or 'rename'
             * @returns {boolean}
             */
            function isEditable( action ) {

              if ( team.editable === undefined )
                return !( dataset.editable === false || ( typeof dataset.editable === 'object' && dataset.editable[ action ] === false ) );
              else
                return !( team.editable === false || ( typeof team.editable === 'object' && team.editable[ action ] === false ) );

            }

            /**
             * make team name editable
             */
            function makeEditable() {

              // make team name editable and set input event
              team_div.find( '> .header > .name' ).prop( 'contenteditable', true ).on( 'input', function () {

                // show loading icon
                loading( true );

                /**
                 * renamed team name
                 * @type {string}
                 */
                var value = jQuery( this ).val().trim();

                // change team name in team dataset
                dataset.teams[ nr - 1 ].name = ccm.helper.val( value );

                // update team building dataset
                self.store.set( dataset, function () {

                  // hide loading icon
                  loading( false );

                  // log event
                  if ( self.bigdata ) self.bigdata.log( 'rename', { key: team.key, name: team.name } );

                } );

              } );

            }

            /**
             * render leave button
             */
            function renderLeaveButton() {

              // render button html structure
              ccm.helper.find( self, team_div, '.button' ).html( ccm.helper.html( self.html.button, {

                caption: ccm.helper.val( self.text.leave ),
                click:   leave

              } ) );

              /**
               * leave team
               */
              function leave() {

                // show loading icon
                loading( true );

                // remove user from member list
                delete team.members[ user.key ];

                // unlimited number of teams and leaved team is now empty? => remove leaved team
                if ( !dataset.max_teams && isEmptyTeam( team ) ) dataset.teams.splice( nr - 1, 1 );

                // update team building dataset
                self.store.set( dataset, function () {

                  // (re)render own content
                  self.render();

                  // log event
                  if ( self.bigdata ) self.bigdata.log( 'leave', { key: team.key } );

                } );

              }

            }

            /**
             * checks if team is joinable
             * @returns {boolean}
             */
            function isJoinable() {

              // team is not joinable? => negative result
              if ( !isEditable( 'join' ) ) return false;

              // user team is not leavable? => negative result
              if ( user_team_nr && dataset.teams[ user_team_nr - 1 ].editable === false ) return false;

              // unlimited number of teams and this team is the last (always empty) team and not the only one?
              if ( !dataset.max_teams && nr === dataset.teams.length && nr > 1 ) {

                // the user is the only member in the last not empty team? => team is not joinable
                if ( isOnlyMember( dataset.teams[ nr - 2 ] ) ) return false;

              }

              // team is joinable if number of team members is unlimited or maximum number of team members is currently not reached
              return !max_members || Object.keys( team.members ).length < max_members;

              /**
               * checks if the user is the only member in a specific team
               * @param {ccm.components.teambuild.team} team - team dataset
               * @returns {boolean}
               */
              function isOnlyMember( team ) {

                return team.members[ user.key ] && Object.keys( team.members ).length === 1;

              }

            }

            /**
             * render join button
             */
            function renderJoinButton() {

              // render button html structure
              ccm.helper.find( self, team_div, '.button' ).html( ccm.helper.html( self.html.button, {

                caption: ccm.helper.val( self.text.join ),
                click:   join

              } ) );

              /**
               * join team
               */
              function join() {

                // show loading icon
                loading( true );

                // user is a team member?
                if ( user_team_nr ) {

                  /**
                   * leaving team
                   * @type {ccm.components.teambuild.team}
                   */
                  var leaving_team = dataset.teams[ user_team_nr - 1 ];

                  // leave team
                  delete leaving_team.members[ user.key ];

                  // unlimited number of teams and leaved team is now empty? => remove leaved team
                  if ( !dataset.max_teams && isEmptyTeam( leaving_team ) ) dataset.teams.splice( user_team_nr - 1, 1 );

                }

                // join new team
                team.members[ user.key ] = { key: user.key, name: user.name };

                // update team building dataset
                self.store.set( dataset, function () {

                  // (re)render own content
                  self.render();

                  // log event
                  if ( self.bigdata ) self.bigdata.log( 'join', { key: team.key } );

                } );

              }

            }

            /**
             * get user team number
             * @returns {number}
             */
            function getUserTeamNr() {

              // is user a team member? => return team number
              for ( var i = 0; i < dataset.teams.length; i++ )
                if ( dataset.teams[ i ].members[ user.key ] ) return i + 1;

              // user is no team member
              return 0;

            }

            /**
             * show or hide loading icon
             * @param {boolean} show_or_hide - true: show, false: hide
             */
            function loading( show_or_hide ) {

              var status_div = ccm.helper.find( self, team_div, '.status' );
              if ( show_or_hide )
                ccm.helper.loading( status_div );
              else
                status_div.html( '' );

            }

            /**
             * render members of team entry
             */
            function renderMembers() {

              // render team member entries
              for ( var i in team.members )
                renderMember( team.members[ i ] );

              // add missing free team member entries
              while ( max_members > ccm.helper.find( self, team_div, '.member' ).length )
                renderMember();

              /**
               * render team member entry
               * @param {ccm.components.teambuild.member} [member] - team member dataset
               */
              function renderMember( member ) {

                // render member html structure
                ccm.helper.find( self, team_div, '.members' ).append( ccm.helper.html( self.html.member, {

                  icon: ccm.helper.val( self.icon.member ),
                  name: ccm.helper.val( member ? ( member.name && self.user ? member.name : member.key ) : self.text.free ),
                  user: member && user && user.key === member.key ? 'user' : '',
                  free : member ? '' : 'free'

                } ) );

              }

            }

          }

          /**
           * add empty team
           */
          function addEmptyTeam() {

            /**
             * empty team dataset
             * @type {ccm.components.teambuild.team}
             */
            var team = { key: ccm.helper.generateKey(), members: {} };

            // add empty team dataset to other teams
            dataset.teams.push( team );

            // render empty team entry
            renderTeam( team );

          }

          /**
           * checks if a team dataset is empty
           * @param {ccm.components.teambuild.team} team - team dataset
           * @returns {boolean} is unneeded team?
           */
          function isEmptyTeam( team ) {

            return Object.keys( team.members ).length === 0;

          }

          /**
           * checks if teams are joinable
           * @returns {boolean}
           */
          function joinableTeams() {

            return !( dataset.editable === false || ( typeof dataset.editable === 'object' && dataset.editable.join === false ) );

          }

        }

      } );

    };

    /*------------------------------------------- private instance methods -------------------------------------------*/

    /**
     * @summary update own content
     * @private
     */
    function update() {

      // website area for own content no more exists in DOM? => abort
      if ( !ccm.helper.isInDOM( self ) ) return;

      // (re)render own content
      self.render();

    }

  }

  /*------------------------------------------------ type definitions ------------------------------------------------*/

  /**
   * @namespace ccm.components.teambuild
   */

  /**
   * @summary <i>ccm</i> instance configuration
   * @typedef {ccm.config} ccm.components.teambuild.config
   * @property {ccm.instance} bigdata - <i>ccm</i> instance for big data
   * @property {string} classes - css classes for own website area
   * @property {ccm.element} element - own website area
   * @property {Object.<ccm.key, ccm.html>} html - <i>ccm</i> html data templates for own content
   * @property {ccm.key} key - key of [team building dataset]{@link ccm.components.teambuild.dataset} for rendering
   * @property {ccm.instance} lang - <i>ccm</i> instance for multilingualism
   * @property {ccm.store} store - <i>ccm</i> datastore that contains the [team building dataset]{@link ccm.components.teambuild.dataset} for rendering
   * @property {ccm.style} style - css for own content
   * @property {ccm.instance} user - <i>ccm</i> instance for user authentication
   * TODO: text and icon(s)
   */

  /**
   * @summary team building dataset for rendering
   * @typedef {ccm.dataset} ccm.components.teambuild.dataset
   * @property {boolean|{join: boolean, leave: boolean, rename: boolean}} editable - teams are editable (user can join/leave a team and edit team name, default is true)
   * @property {ccm.key} key - dataset key
   * @property {number} max_teams - maximum number of teams (default: unlimited)
   * @property {number} max_members - maximum number of team members (default: unlimited)
   * @property {ccm.components.teambuild.team[]} teams - [team dataset]{@link ccm.components.teambuild.team}s
   */

  /**
   * @summary team dataset
   * @typedef {ccm.dataset} ccm.components.teambuild.team
   * @property {boolean|{join: boolean, leave: boolean, rename: boolean}} editable - team is editable (user can join/leave a team and edit team name, default is true)
   * @property {string} name - team name
   * @property {number} max_members - maximum number of team members (default or -1: unlimited)
   * @property {ccm.components.teambuild.member[]} members - [team member dataset]{@link ccm.components.teambuild.member}s
   */

  /**
   * @summary team member dataset
   * @typedef {ccm.dataset} ccm.components.teambuild.member
   * @property {ccm.key} key - team member dataset key
   * @property {string} name - team member name
   */

} );