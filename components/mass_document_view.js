/**
 * @overview mass_document_view
 * @author Manfred Kaul <manfred.kaul(at)h-brs.de> 2016
 * @license The MIT License (MIT)
 */

ccm.component( {

  /*-------------------------------------------- public component members --------------------------------------------*/

  /**
   * @summary component name
   * @memberOf ccm.components.mass_document_view
   * @type {ccm.name}
   */
  name: 'mass_document_view',

  /**
   * @summary default instance configuration
   * @memberOf ccm.components.mass_document_view
   * @type {ccm.components.mass_document_view.config}
   */
  config: {

    key:   'themen',
    html:  [ ccm.load, './json/mass_document_view_html.json' ],     // schema
    style:  [ ccm.load, './css/mass_document_view.css' ],     // layout
    store: [ ccm.store, './json/mass_document_view.json' ], // values for schema
    prepare: function( dataset, nr ){

      Object.keys(dataset).map(function (index) {
        if ( index === "key"){
          dataset[index] = nr + '. ' + dataset[index];
        }

        if ( jQuery.isArray( dataset[index] ) ){
          dataset[index] = dataset[index].reduce(function (a,b) {
            return a + '<br><a href="' + b + '" target="_blank">' + b +
              '</a>';
          },'');
        }
      });

      return dataset;
    }

  },

  /*-------------------------------------------- public component classes --------------------------------------------*/

  /**
   * @summary constructor for creating <i>ccm</i> instances out of this component
   * @alias ccm.components.mass_document_view.mass_document_view
   * @class
   */
  Instance: function () {

    /*------------------------------------- private and public instance members --------------------------------------*/

    /**
     * @summary own context
     * @private
     */
    var self = this;

    // ...

    /*------------------------------------------- public instance methods --------------------------------------------*/

    /**
     * @summary initialize <i>ccm</i> instance
     * @description
     * Called one-time when this <i>ccm</i> instance is created, all dependencies are solved and before dependent <i>ccm</i> components, instances and datastores are initialized.
     * This method will be removed by <i>ccm</i> after the one-time call.
     * @param {function} callback - callback when this instance is initialized
     */
    this.init = function ( callback ) {

      // ...

      // perform callback
      callback();

    };

    /**
     * @summary when <i>ccm</i> instance is ready
     * @description
     * Called one-time when this <i>ccm</i> instance and dependent <i>ccm</i> components, instances and datastores are initialized and ready.
     * This method will be removed by <i>ccm</i> after the one-time call.
     * @param {function} callback - callback when this instance is ready
     */
    this.ready = function ( callback ) {

      // ...

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
      var element = ccm.helper.element( self ).html( '' );

      // get dataset for rendering
      ccm.helper.dataset( self, function ( dataset ) {

        var nr = 0;

        Object.keys(dataset).map( function ( index ) {

          nr += 1;

          // render main html structure
          element.append( ccm.helper.html( self.html.main,  self.prepare( dataset[index], nr ) ) );

        });

        // translate own content
        if ( self.lang ) self.lang.render();

        // perform callback
        if ( callback ) callback();

      } );

    };

  }

  /*------------------------------------------------ type definitions ------------------------------------------------*/

  /**
   * @namespace ccm.components.mass_document_view
   */

  /**
   * @summary <i>ccm</i> instance configuration
   * @typedef {ccm.config} ccm.components.mass_document_view.config
   * @property {string} classes - css classes for own website area
   * @property {ccm.element} element - own website area
   * @property {Object.<ccm.key, ccm.html>} html - <i>ccm</i> html data templates for own content
   * @property {ccm.key} key - key of [mass_document_view dataset]{@link ccm.components.mass_document_view.dataset} for rendering
   * @property {ccm.instance} lang - <i>ccm</i> instance for multilingualism
   * @property {ccm.store} store - <i>ccm</i> datastore that contains the [mass_document_view dataset]{@link ccm.components.mass_document_view.dataset} for rendering
   * @property {ccm.style} style - css for own content
   * @property {ccm.instance} user - <i>ccm</i> instance for user authentication
   * ...
   */

  /**
   * @summary mass_document_view dataset for rendering
   * @typedef {ccm.dataset} ccm.components.mass_document_view.dataset
   * @property {ccm.key} key - dataset key
   * ...
   */

  // ...

} );