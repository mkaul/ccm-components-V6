/**
 * @overview <i>ccm</i> component for inputs
 * @author André Kless <andre.kless@h-brs.de> 2015
 * @copyright Copyright (c) 2015 Bonn-Rhein-Sieg University of Applied Sciences
 * @license The MIT License (MIT)
 */

ccm.component( {

  /*-------------------------------------------- public component members --------------------------------------------*/

  /**
   * @summary component name
   * @memberOf ccm.components.input
   * @type {ccm.name}
   */
  name: 'input',

  /**
   * @summary default instance configuration
   * @memberOf ccm.components.input
   * @type {ccm.components.input.config}
   */
  config: {

    key: 'demo',
    submit: function ( result ) { console.log( result ); },
    store: [ ccm.store, './json/input.json' ],
    style: [ ccm.load, './css/input.css' ]

  },

  /*-------------------------------------------- public component classes --------------------------------------------*/

  /**
   * @summary constructor for creating instances out of this component
   * @alias ccm.components.input.Input
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

      var element = ccm.helper.element( self );

      self.store.get( self.key, function ( dataset ) {

        if ( dataset === null ) return self.store.set( { key: self.key }, function ( dataset ) { self.key = dataset.key; element.remove(); self.render(); } );

        var html = [ { tag: 'table', inner: [] } ];

        if ( dataset.inputs )
          if ( Array.isArray( dataset.inputs ) )
            for ( var i = 0; i < dataset.inputs.length; i++ )
              addInput( dataset.inputs[ i ] );
          else
            addInput( dataset.inputs );

        if ( dataset.fieldset ) {
          html = { tag: 'fieldset', inner: html };
          if ( typeof dataset.fieldset === 'string' )
            html.inner.unshift( { tag: 'legend', inner: dataset.fieldset } );
        }

        if ( dataset.form ) {
          if ( dataset.form === true ) dataset.form = { button: true };
          html = { tag: 'form', onsubmit: dataset.form.onsubmit, inner: html };
          if ( dataset.form.button ) {
            var button = { tag: 'input', type: 'submit', value: dataset.form.button };
            if ( button.value === true ) delete button.value;
            if ( dataset.fieldset )
              html.inner.inner.push( button );
            else
              html.inner.push( button );
          }
        }

        element.html( ccm.helper.html( html, function () {

          self.submit( ccm.helper.formData( jQuery( this ) ) );
          return false;

        } ) );

        if ( callback ) callback();

        function addInput( input ) {

          var label = input.label || input.name;
          delete input.label;

          switch ( input.input ) {
            case 'select':
            case 'textarea':
              input.tag = input.input;
              break;
            default:
              input.tag = 'input';
              input.type = input.input;
          }

          if ( input.input === 'radio' ) {
            for ( var i = 0; i < input.values.length; i++ ) {
              input.values[ i ].tag = input.tag;
              input.values[ i ].type = input.type;
              input.values[ i ].name = input.name;
              input.values[ i ] = {
                tag: 'label',
                inner: [
                  input.values[ i ],
                  {
                    "tag": "span",
                    "inner": "&nbsp;"
                  },
                  {
                    "tag": "span",
                    "inner": input.values[ i ].caption || input.values[ i ].value
                  },
                  {
                    "tag": "br"
                  }
                ]
              };
              delete input.values[ i ].inner[ 0 ].caption;
            }
            input = input.values;
          }

          if ( input.input === 'checkbox' ) {
            if ( input.values ) {
              for ( var i = 0; i < input.values.length; i++ ) {
                input.values[ i ].tag = input.tag;
                input.values[ i ].type = input.type;
                input.values[ i ].value = input.values[ i ].value || input.values[ i ].name;
                input.values[ i ] = {
                  tag: 'label',
                  inner: [
                    input.values[ i ],
                    {
                      "tag": "span",
                      "inner": "&nbsp;"
                    },
                    {
                      "tag": "span",
                      "inner": input.values[ i ].caption || input.values[ i ].value
                    },
                    {
                      "tag": "span",
                      "inner": "&nbsp;&nbsp;&nbsp;"
                    }
                  ]
                };
                delete input.values[ i ].inner[ 0 ].caption;
              }
              input = input.values;
            }
            else {
              input.id = self.index + '-' + input.name;
              label = { tag: 'label', for: input.id, inner: label };
              input = [
                input,
                {
                  "tag": "span",
                  "inner": "&nbsp;"
                },
                {
                  "tag": "span",
                  "inner": input.caption
                }
              ];
              delete input[ 0 ].caption;
            }
          }

          if ( input.input === 'select' ) {
            input.inner = input.options;
            delete input.options;
            for ( var i = 0; i < input.inner.length; i++ ) {
              input.inner[ i ].tag = 'option';
              input.inner[ i ].inner = input.inner[ i ].caption || input.inner[ i ].value;
              delete input.inner[ i ].caption;
            }
          }

          if ( input.input === 'range' ) {
            input.oninput = function () { jQuery( this ).next().next().text( jQuery( this ).val() ) };
            input = [
              input,
              {
                tag: 'span',
                inner: '&nbsp;'
              },
              {
                tag: 'span',
                inner: input.value || ( ( parseInt( input.min ) || 0 ) + ( parseInt( input.max ) || 100 ) / 2 )
              }
            ];
          }

          delete input.input;

          html[ 0 ].inner.push( {

            tag: 'tr',
            inner:
            [
              {
                tag: 'td',
                inner: label
              },
              {
                tag: 'td',
                inner: input
              }
            ]

          } );

        }

      } );

    }

  }

  /*------------------------------------------------ type definitions ------------------------------------------------*/

  /**
   * @namespace ccm.components.input
   */

  /**
   * @summary <i>ccm</i> instance configuration
   * @typedef {ccm.config} ccm.components.input.config
   * @property {string} classes - CSS classes for own website area
   * @property {ccm.element} element - own website area
   * @property {ccm.key} key - key of input dataset for rendering
   * @property {function} onsubmit - form submit event
   * @property {ccm.store} store - <i>ccm</i> datastore that contains the [input dataset]{@link ccm.components.input.dataset} for rendering
   * @property {ccm.style} style - CSS for own content
   */

  /**
   * @summary input dataset
   * @typedef {ccm.dataset} ccm.components.input.dataset
   * @property {boolean|string} fieldset - wrap inputs in a fieldset<br>
   * <br>
   * <code>falsy</code>: inputs without a fieldset around<br>
   * <code>true</code>: wrap inputs in a fieldset without a legend<br>
   * <code>string</code>: wrap inputs in a fieldset with given string as legend
   * @property {boolean|object} form - wrap inputs with a form<br>
   * <br>
   * <code>falsy</code>: inputs without a form around,<br>
   * <code>true</code>: wrap inputs with a form that has default submit button and default onsubmit event<br>
   * <code>object</code>:
   * @property {boolean|string} form.button - caption of submit button<br>
   * <br>
   * <code>falsy</code>: no submit button,<br>
   * <code>true</code>: submit button with default caption,<br>
   * <code>string</code>: submit button with given string as caption
   * @property {function} form.onsubmit - form submit event
   * @property {ccm.components.input.element[]} inputs - collection of input elements<br>
   * @property {ccm.key} key - dataset key
   */

  /**
   * @summary input element - TODO: explain all possible properties of input element data
   * @typedef {object} ccm.components.input.element
   * @property {string} input - type of input field: text, password, radio, checkbox, select, textarea, number, date, color, range, month, week, time, datetime, datetime-local, email, search, tel or url
   * @property {string} label - label of input element
   * @property {string} name -  value for html input attribute 'name'
   */

} );