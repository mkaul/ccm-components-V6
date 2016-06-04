/**
 * @overview side_panel as <i>ccm</i> component
 * @author Manfred Kaul <manfred.kaul(at)h-brs.de> 2016
 * @license The MIT License (MIT)
 */

ccm.component( {

  /*-------------------------------------------- public component members --------------------------------------------*/

  /**
   * @summary component name
   * @memberOf ccm.components.side_panel
   * @type {ccm.name}
   */
  name: 'side_panel',

  /**
   * @summary default instance configuration
   * @memberOf ccm.components.side_panel
   * @type {ccm.components.side_panel.config}
   */
  config: {

    // html template must contain a side_panel, a label div and a content div
    html:  [ ccm.load, '../side_panel/side_panel_html.json' ],

    position: 'right', // or left, top, bottom

    // invoked by click on button
    click_function: function(){

      console.log( document.location );
      console.log( document.referrer );

      var parent = jQuery(this.parentElement.parentElement);
      console.log( parent.find(":input").val() );
      console.log( parent.find("option:selected").val() );
      console.log( parent.find("textarea").val() );

    },

    style: [ ccm.load, '../side_panel/side_panel.css' ]

  },

  /*-------------------------------------------- public component classes --------------------------------------------*/

  /**
   * @summary constructor for creating <i>ccm</i> instances out of this component
   * @alias ccm.components.side_panel.Blank
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
     * @summary whitelist of valid positions for config parameter position
     * @private
     */
    var valid_positions = [ 'top', 'left', 'bottom', 'right' ];
    var rotations = [ 0, -90, 0, -90 ];
    var offsets = [ 0, 1, 0, -1 ];

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
      element.html(
        ccm.helper.html(
          self.html.main, // template must contain a side_panel, a label div and a content div
            {
              click: self.click_function  // template parameter
            }
      ) );

      var panel_div = element.find('div.side_panel');
      var label_div = panel_div.find('div.label');

      panel_div.find('button.close').click(function () {
        if ( self.stop_hover ) {
          panel_div.removeClass('no-hover');
          self.stop_hover = false;
          jQuery(this).html('x');
        } else {
          panel_div.addClass('no-hover');
          self.stop_hover = true;
          jQuery(this).html('O');
        }
      });

      if ( self.position ){
        var idx = valid_positions.indexOf( self.position ); // white list of valid parameters
        var offset;
        if ( idx >= 0 ){

          panel_div.css( 'right', 'auto' );
          panel_div.css( self.position, 0 );

          label_div.css( 'right', 'auto' );
          label_div.css( 'transform', 'rotate(' + ( rotations[idx] ) + 'deg)' );
          label_div.css( self.position, offsets[idx] + 'em' );
        }
      }

      var content_div = panel_div.find('div.content');
      content_div.hide();

      panel_div.hover(

        function(e) {               // mouse over
          if ( self.stop_hover ) return;
          label_div.hide();
          content_div.show();       // show content on hover
        },

        function(e) {               // mouse out
          label_div.show();
          content_div.hide();       // hide content in contracted mode
        }
      );

      // perform callback
      if ( callback ) callback();

    };

  }

  /*------------------------------------------------ type definitions ------------------------------------------------*/

  /**
   * @namespace ccm.components.side_panel
   */

  /**
   * @summary <i>ccm</i> instance configuration
   * @typedef {ccm.config} ccm.components.side_panel.config
   * @property {string} classes - css classes for own website area
   * @property {ccm.element} element - own website area
   * @property {Object.<ccm.key, ccm.html>} html - <i>ccm</i> html data templates for own content. template must contain a side_panel, a label div and a content div
   * @property {ccm.style} style - css for own content
   */



} );