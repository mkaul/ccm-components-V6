/**
 * @overview clock as ccm component
 * @author mkaul2m <Manfred.Kaul@h-brs.de>, 2015, 2016
 * @author Andre Kless <andre.kless@h-brs.de>, 2015
 * @license The MIT License (MIT)
 */

ccm.component( {

  /*-------------------------------------------- public component members --------------------------------------------*/

  /**
   * component name
   * @type {string}
   * @ignore
   */
  name: 'clock',

  /**
   * @summary default instance configuration
   * @type {ccm.components.clock.config}
   * @ignore
   */
  config: {

    beep: true, // configure whether clock should beep during setting procedure
    browser_overhead: 11, // time in milliseconds used by browser to execute 1 second clock loop, i.e. 1000 msec
    // depends on the browser. 11 msec is for Chrome.
    style: [ ccm.load, './css/clock.css' ],
    lang:  [ ccm.instance, 'http://mkaul.github.io/ccm-components/lib/components/lang.js', { store: [ ccm.store, './json/clock_lang.json' ] } ] // multi-lingual

  },

  /*-------------------------------------------- public component classes --------------------------------------------*/

  /**
   * @alias ccm.components.clock
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

    /**
     * public clock object accessible by other components
     * @type {object}
     */
    self.digital_clock = (function(){
      // encapsulate object via function scope via IIFE pattern
      // see https://en.wikipedia.org/wiki/Immediately-invoked_function_expression

      /** private variables **/
      var element; // jQuery object into which this clock should be rendered

      /* four states as private constants */
      var DISPLAY_TIME = 0;
      var SET_HOURS = 1;
      var SET_MINUTES = 2;
      var SET_SECONDS = 3;

      /* clock private variables */
      var hours = 0;
      var minutes = 0;
      var seconds = 0;
      var state = DISPLAY_TIME; // start state

      /* private functions */
      function beep() {
        if (self.beep) new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=").play();
      }

      function two_chars( num ){
        return ( "0" + num ).slice(-2);
      }

      var that = {   /* public functions */
        hours: function(){
          return hours;
        },
        minutes: function(){
          return minutes;
        },
        clear: function(){
          hours = 0;
          minutes = 0;
          seconds = 0;
          state = DISPLAY_TIME;
          element.find("span.hours").html( two_chars( hours ) );
          element.find("span.minutes").html( two_chars( minutes ) );
          element.find("span.seconds").html( two_chars( seconds ) );
        },
        set: function(){
          state = ( state + 1 ) % 4;
          beep();
        },
        inc: function(){
          if ( state === SET_HOURS ){
            hours = ( hours + 1 ) % 24;
            beep();
            element.find("span.hours").html( two_chars( hours ) );
          } else if ( state === SET_MINUTES ){
            minutes = ( minutes + 1 ) % 60;
            beep();
            element.find("span.minutes").html( two_chars( minutes ) );
          } else if ( state === SET_SECONDS ){
            seconds = ( seconds + 1 ) % 60;
            beep();
            element.find("span.seconds").html( two_chars( seconds ) );
          }
        },
        start: function( inject_element ){ // dependency injection
          element = inject_element;
          seconds = ( seconds + 1 ) % 60;
          element.find("span.seconds").html( two_chars( seconds ) );
          if (seconds == 0) {
            minutes = ( minutes + 1 ) % 60;
            element.find("span.minutes").html( two_chars( minutes ) );
            if (minutes == 0){
              hours = ( hours + 1 ) % 24;
              element.find("span.hours").html( two_chars( hours ) );
            }
          }
          setTimeout(function(){
            that.start( element );
          }, 1000 - self.browser_overhead ); // 1000 msec is too long because of browser overhead
        }
      };
      return that;
    })();

    /*------------------------------------------- public instance methods --------------------------------------------*/

    /**
     * @summary render clock in own website area
     * @param {function} callback - callback when ccm instance is rendered (first parameter is ccm instance)
     */
    this.render = function ( callback ) {

      /**
       * website area for own content
       * @type {ccm.element}
       */
      var element = ccm.helper.element( self );

      // render own content
      // write HTML code directly into element
      element.html(
        '<div class="digital_clock">' +
        '<span class="hours">00</span> : ' +
        '<span class="minutes">00</span> : ' +
        '<span class="seconds">00</span> <br> ' +
        '<button class="clear">lang#clear</button> ' +
        '<button class="set">lang#set</button> ' +
        '<button class="inc">lang#inc</button> ' +
        '</div>'
      );

      element.find('button.clear').click(self.digital_clock.clear);
      element.find('button.set').click(self.digital_clock.set);
      element.find('button.inc').click(self.digital_clock.inc);

      // render digital_clock into element
      self.digital_clock.start( element );

      // translate content of own website area
      if ( self.lang ) self.lang.render();

      // perform callback
      if ( typeof callback === 'function' ) callback();

    }

  }

  /*------------------------------------------------ type definitions ------------------------------------------------*/

  /**
   * @summary ccm instance configuration
   * @typedef {ccm.config} ccm.components.clock.config
   * @property {ccm.element} element - website area of ccm instance
   * @property {ccm.style} style - CSS for website area
   * @property {ccm.component} lang - ccm component for switching language
   */

} );

