/**
 * @overview <i>ccm</i> component for multiple_choice
 * @author André Kless <andre.kless@h-brs.de> 2016
 * @copyright Copyright (c) 2016 Bonn-Rhein-Sieg University of Applied Sciences
 * @license The MIT License (MIT)
 */

ccm.component( {

  /*-------------------------------------------- public component members --------------------------------------------*/

  /**
   * @summary component name
   * @memberOf ccm.components.multiple_choice
   * @type {ccm.name}
   */
  name: 'multiple_choice',

  /**
   * @summary default instance configuration
   * @memberOf ccm.components.multiple_choice
   * @type {ccm.components.multiple_choice.config}
   */
  config: {

    key: 'leistungen',
    //lang: [ ccm.instance, './components/lang.js', { store: [ ccm.store, './json/multiple_choice_lang.json' ] } ],
    store: [ ccm.store, './json/klr_quizzes.json' ],
    style: [ ccm.load, './css/multiple_choice.css' ]

  },

  /*-------------------------------------------- public component classes --------------------------------------------*/

  /**
   * @summary constructor for creating <i>ccm</i> instances out of this component
   * @alias ccm.components.multiple_choice.MultipleChoice
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

      // get dataset for rendering
      ccm.helper.dataset( self, function ( dataset ) {

        var html = { tag: 'form', onsubmit: submit, inner: [ { inner: [] }, { tag: 'input', type: 'submit', value: 'Abschicken' } ] };

        var table = html.inner[ 0 ].inner;

        table.push( { inner: [ {} ] } );
        for ( var i = 0; i < dataset.answers.length; i++ )
          table[ 0 ].inner.push( { inner: dataset.answers[ i ] } );

        for ( var j = 0; j < dataset.questions.length; j++ ) {
          table.push( { inner: [ { inner: dataset.questions[ j ].text } ] } );
          inputs( dataset.questions[ j ].correct, j + 1 );
        }

        element.html( ccm.helper.html( html ) );

        // translate own content
        if ( self.lang ) self.lang.render();

        // perform callback
        if ( callback ) callback();

        function inputs( correct, j ) {

          var row = table[ j ].inner;

          if ( Array.isArray( correct ) ) {

            if ( typeof correct[ 0 ] === 'boolean' || typeof correct[ 0 ] === 'number' ) checkboxes();
            else if ( typeof correct[ 0 ] === 'string' ) texts();

          }
          else if ( typeof correct === 'number' ) radios();

          function checkboxes() {

            for ( var i = 1; i <= dataset.answers.length; i++ )
              row.push( { inner: { tag: 'input', type: 'checkbox', name: j + '-' + i } } );

          }

          function radios() {

            for ( var i = 1; i <= dataset.answers.length; i++ )
              row.push( { inner: { tag: 'input', type: 'radio', name: j, value: i } } );

          }

          function texts() {

            for ( var i = 1; i <= dataset.answers.length; i++ )
              row.push( { inner: { tag: 'input', type: 'number', name: j + '-' + i } } );

          }

        }

        function submit() {

          var results = ccm.helper.formData( jQuery( this ) );
          console.log( 'results', results );

          for ( var i = 0; i < dataset.questions.length; i++ ) {

            var correct = dataset.questions[ i ].correct;

            if ( Array.isArray( correct ) ) {

              if ( typeof correct[ 0 ] === 'boolean' || typeof correct[ 0 ] === 'number' ) validateCheckboxes( correct, i + 1 );
              else if ( typeof correct[ 0 ] === 'string' ) validateStrings( correct, i + 1 );

            }
            else if ( typeof correct === 'number' ) validateRadios( correct, i + 1 );

          }

          var result = ccm.helper.find( self, 'form > div' );
          element.html( ccm.helper.html( [ { class: 'result' }, { class:'neustart', inner: { tag: 'button', inner: 'Neustart', onclick: function () { self.render(); } } } ] ) );
          ccm.helper.find( self, '.result' ).html( result );

          return false;

          function validateCheckboxes( correct, question ) {

            var cell, result, solution;

            if ( typeof correct[ 0 ] === 'boolean' )
              for ( var answer = 1; answer <= dataset.answers.length; answer++ ) {

                cell = ccm.helper.find( self, 'input[name="'+question+'-'+answer+'"]').parent();
                result = !!results[ question + '-' + answer ];
                solution = correct[ answer - 1 ];

                cell.addClass( result === solution ? 'right' : 'wrong' );

              }

            else if ( typeof correct[ 0 ] === 'number' )
              for ( var answer = 1; answer <= dataset.answers.length; answer++ ) {

                cell = ccm.helper.find( self, 'input[name="'+question+'-'+answer+'"]').parent();
                result = !!results[ question + '-' + answer ];
                solution = false;

                for ( var i = 0; i < correct.length; i++ )
                  if ( correct[ i ] === answer - 1 )
                    solution = true;

                cell.addClass( result === solution ? 'right' : 'wrong' );

              }

          }

          function validateStrings( correct, question ) {

            var cell, result, solution;

            for ( var answer = 1; answer <= dataset.answers.length; answer++ ) {

              cell = ccm.helper.find( self, 'input[name="'+question+'-'+answer+'"]' ).parent();
              result = results[ question + '-' + answer ];
              solution = correct[ answer - 1 ];

              cell.addClass( result === solution ? 'right' : 'wrong' );

            }

          }

          function validateRadios( correct, question ) {

            var cell, result, solution;

            for ( var answer = 1; answer <= dataset.answers.length; answer++ ) {

              cell = ccm.helper.find( self, 'input[name="'+question+'"][value="'+answer+'"]').parent();
              result = results[ question ];
              solution = correct + 1;

              cell.addClass( result == solution ? 'right' : 'wrong' );

            }

          }

        }

      } );

    };

  }

  /*------------------------------------------------ type definitions ------------------------------------------------*/

  /**
   * @namespace ccm.components.multiple_choice
   */

  /**
   * @summary <i>ccm</i> instance configuration
   * @typedef {ccm.config} ccm.components.multiple_choice.config
   * @property {string} classes - css classes for own website area
   * @property {ccm.element} element - own website area
   * @property {Object.<ccm.key, ccm.html>} html - <i>ccm</i> html data templates for own content
   * @property {ccm.key} key - key of multiple choice dataset for rendering
   * @property {ccm.instance} lang - <i>ccm</i> instance for multilingualism
   * @property {ccm.store} store - <i>ccm</i> datastore that contains the [multiple choice dataset]{@link ccm.components.chat.dataset} for rendering
   * @property {ccm.style} style - css for own content
   */

  /**
   * @summary multiple choice dataset for rendering
   * @typedef {ccm.dataset} ccm.components.multiple_choice.dataset
   * @property {ccm.key} key - dataset key
   */

} );