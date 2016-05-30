/**
 * @overview <i>ccm</i> component for infinite table
 * @author André Kless <andre.kless@h-brs.de> 2016
 * @copyright Copyright (c) 2016 Bonn-Rhein-Sieg University of Applied Sciences
 * @license The MIT License (MIT)
 */

ccm.component( {

  /*-------------------------------------------- public component members --------------------------------------------*/

  /**
   * @summary component name
   * @memberOf ccm.components.table
   * @type {ccm.name}
   */
  name: 'table',

  /**
   * @summary default instance configuration
   * @memberOf ccm.components.table
   * @type {ccm.components.table.config}
   */
  config: {

    key: 'test',
    store: [ ccm.store, { db: 'redis', store: 'table', url: 'ws://ccm2.inf.h-brs.de/index.js' } ],
    style: [ ccm.load, './css/table.css' ]

  },
  
  /*-------------------------------------------- public component classes --------------------------------------------*/
  
  /**
   * @summary constructor for creating <i>ccm</i> instances out of this component
   * @alias ccm.components.table.Table
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
     * @summary initialize <i>ccm</i> instance
     * @description
     * Called one-time when this <i>ccm</i> instance is created, all dependencies are solved and before dependent <i>ccm</i> components, instances and datastores are initialized.
     * This method will be removed by <i>ccm</i> after the one-time call.
     * @param {function} callback - callback when this instance is initialized
     */
    this.init = function ( callback ) {

      // listen to change event of ccm realtime datastore => update own content
      self.store.onChange = update;

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

        element.html( '' );

        initialCols();

        for ( var i = 0; i < dataset.cols.length; i++ )
          renderCol( dataset.cols[ i ], i );

        // perform callback
        if ( callback ) callback();

        function initialCols() {

          if ( !dataset.cols ) {
            var cols = [];
            if ( dataset.col )
              for ( var ii = 0; ii < dataset.col; ii++ )
                cols.push( {} );
            else
              cols = [ {}, {}, {} ];
            dataset.cols = cols;
          }

        }

        function renderCol( col, i ) {

          element.append( ccm.helper.html( {} ) );

          initialRows();

          function initialRows() {

            if ( !col.rows ) {
              var rows = [];
              if ( dataset.row )
                for ( var jj = 0; jj < dataset.row; jj++ )
                  rows.push( {} );
              else
                rows = [ {}, {}, {} ];
              col.rows = rows;
            }

          }

          for ( var j = 0; j < col.rows.length; j++ )
            renderRow( col.rows[ j ], j );

          function renderRow( row, j ) {

            element.find( '> div:last' ).append( ccm.helper.html( {

              class: row.not || col.not ? 'not' : undefined,
              //id: 'ccm-' + self.index + '_' + ( row.key || ( row.key = ccm.helper.generateKey() ) ),
              inner: row.val || { tag: 'span' },
              onclick: row.not || col.not ? undefined : edit

            } ) );

            function edit() {

              var cell = jQuery( this );

              if ( ccm.helper.tagExists( cell.find( '> input' ) ) ) return;

              var val = cell.text();

              cell.addClass( 'edit' ).html( ccm.helper.html( {

                tag: 'input',
                value: val,
                oninput: function () {

                  var input = jQuery( this );
                  var val = input.val().trim();

                  resize( input );

                  dataset.cols[ i ].rows[ j ].val = val;

                  expand();
                  //shrink();

                  self.store.set( dataset );

                  function expand() {

                    if ( dataset.left   && !ccm.helper.tagExists( cell.prev() ) )          left();
                    if ( dataset.right  && !ccm.helper.tagExists( cell.next() ) )          right();
                    if ( dataset.top    && !ccm.helper.tagExists( cell.parent().prev() ) ) top();
                    if ( dataset.bottom && !ccm.helper.tagExists( cell.parent().next() ) ) bottom();

                    function left() {

                      for ( var i = 0; i < dataset.cols.length; i++ )
                        dataset.cols[ i ].rows.unshift( {} );

                      element.children().prepend( ccm.helper.html( { inner: { tag: 'span' }, onclick: edit } ) );

                    }

                    function right() {

                      for ( var i = 0; i < dataset.cols.length; i++ )
                        dataset.cols[ i ].rows.push( {} );

                      element.children().append( ccm.helper.html( { inner: { tag: 'span' }, onclick: edit } ) );

                    }

                    function top() {

                      var rows_data = [];
                      var rows_elem = ccm.helper.html( {} );

                      for ( var i = 0; i < dataset.cols[ 0 ].rows.length; i++ ) {
                        rows_data.push( {} );
                        rows_elem.append( ccm.helper.html( { inner: { tag: 'span' }, onclick: edit } ) );
                      }

                      dataset.cols.unshift( { rows: rows_data } );
                      element.prepend( rows_elem );

                    }

                    function bottom() {

                      var rows_data = [];
                      var rows_elem = ccm.helper.html( {} );

                      for ( var i = 0; i < dataset.cols[ 0 ].rows.length; i++ ) {
                        rows_data.push( {} );
                        rows_elem.append( ccm.helper.html( { inner: { tag: 'span' }, onclick: edit } ) );
                      }

                      dataset.cols.push( { rows: rows_data } );
                      element.append( rows_elem );

                    }

                  }

                  function shrink() {}

                },
                onblur: function () {

                  var input = jQuery( this );
                  cell.html( input.val().trim() || ccm.helper.html( { tag: 'span' } ) ).removeClass( 'edit' );
                  input.remove();

                }

              } ) );

              var input = cell.find( '> input' );

              resize( input );

              ccm.helper.focusInput( input );

              function resize( input ) {

                input.attr( 'size', input.val().length || 1 );

              }

            }

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

      var input = self.element.find( '> div > div > div > input' );

      // no input field exists? => (re)render own content
      if ( !ccm.helper.tagExists( input ) ) return self.render();

      var id = input.parent().attr( 'id' );

      var val = input.val();

      /**
       * cursor position in input field
       * @type {number}
       */
      var position = ccm.helper.getCursor( input );

      // (re)render own content
      self.render( function () {

        var cell = self.element.find( '#' + id );
        cell.click();
        var input = cell.find( '> input' );
        input.val( val );

        // restore cursor position of input field
        ccm.helper.focusInput( input, position );

      } );

    }

  }
  
  /*------------------------------------------------ type definitions ------------------------------------------------*/

  /**
   * @namespace ccm.components.chat
   */

  /**
   * @summary <i>ccm</i> instance configuration
   * @typedef {ccm.config} ccm.components.chat.config
   * @property {string} classes - css classes for own website area
   * @property {ccm.element} element - own website area
   * @property {Object.<ccm.key, ccm.html>} html - <i>ccm</i> html data templates for own content
   * @property {ccm.key} key - key of chat dataset for rendering
   * @property {ccm.instance} lang - <i>ccm</i> instance for multilingualism
   * @property {ccm.store} store - <i>ccm</i> datastore that contains the [chat dataset]{@link ccm.components.chat.dataset} for rendering
   * @property {ccm.style} style - css for own content
   * @property {string} text_button - caption of send button
   * @property {string} text_placeholder - value for placeholder of input fields
   */

  /**
   * @summary chat dataset for rendering
   * @typedef {ccm.dataset} ccm.components.chat.dataset
   * @property {ccm.key} key - dataset key
   * @property {ccm.components.chat.message[]} messages - chat messages
   */

  /**
   * @summary chat message
   * @typedef {ccm.dataset} ccm.components.chat.message
   * @property {string} text - message text
   */

} );