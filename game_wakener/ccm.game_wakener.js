/**
 * @overview game_wakener template for ccm components
 * @author mkaul2m <manfred.kaul(at)h-brs.de>, 2015
 * @license The MIT License (MIT)
 */

ccm.component( {

  /*-------------------------------------------- public component members --------------------------------------------*/

  /**
   * component name
   * @type {string}
   * @ignore
   */
  name: 'game_wakener',

  /**
   * @summary default instance configuration
   * @type {ccm.components.game_wakener.config}
   * @ignore
   */
  config: {

    number_range_exponent: 2,
    number_range_max_exponent: 6,
    beep: true,
    style: [ ccm.load,  '../game_wakener/game_wakener.css' ],
    lang:  [ ccm.instance, 'http://mkaul.github.io/ccm-components/dist/lang/lang.js', { store: [ ccm.store, '../game_wakener/game_wakener_lang.json' ] } ]

  },
  
  /*-------------------------------------------- public component classes --------------------------------------------*/
  
  /**
   * @alias ccm.components.game_wakener
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
     * @summary render game_wakener in own website area
     * @param {function} callback - callback when ccm instance is rendered (first parameter is ccm instance)
     */
    this.render = function ( callback ) {
      
      /**
       * website area for own content
       * @type {ccm.element}
       */
      var element = ccm.helper.element( self );

      // render own content
      element.html(
        '<div class="row">' +
          '<h2>lang#task</h2>' +
          '<input class="digit_count" type="range" min="1" max="' +
            self.number_range_max_exponent +
            '" step="1" value="' +
            self.number_range_exponent + '" />' +
          '<span class="digit_count"></span>' +
        '</div>' +
        '<div class="row">' +
          '<button class="left block">lang#even</button>' +
          '<p class="number block"></p>' +
          '<button class="right block">lang#odd</button>' +
        '</div>' +
        '<div class="row">' +
          '<button class="exit">Start</button>' +
        '</div>' +
        '<div class="row result"></div>'
      );

      var digit_count = element.find('input.digit_count');
      var digit_count_value = element.find('span.digit_count');
      digit_count_value.html( digit_count.val() );

      var div_result = element.find('div.result');
      var left_button = element.find('button.left');
      var right_button = element.find('button.right');
      var number_area = element.find('p.number');
      var exit_button = element.find('button.exit');

      var next_number;
      show_next_number();

      var number_of_clicks = 0;
      var number_of_success = 0;
      var last_click_time = 0;

      var digit_count_val = digit_count.val();

      digit_count.on( 'input', function() {
        if (digit_count_val !== digit_count.val()){
          digit_count_val = digit_count.val();
          digit_count_value.html( digit_count_val );
          show_next_number();
        }
      });

      left_button.click(function() {
        number_of_clicks += 1;
        if ( digit_sum(next_number) % 2 == 0 ){
          number_of_success += 1;
        } else {
          number_area.addClass('error');
          beep();
          setTimeout(function(){
            number_area.removeClass('error');
          }, 25);
        }
        show_next_number();
      });

      right_button.click(function() {
        number_of_clicks += 1;
        if ( digit_sum(next_number) % 2 == 1 ){
          number_of_success += 1;
        } else {
          number_area.addClass('error');
          beep();
          setTimeout(function(){
            number_area.removeClass('error');
          }, 25);
        }
        show_next_number();
      });

      var millisec = 0;
      var seconds = 0;
      var timer;


      exit_button.click(function() {

        if ( last_click_time == 0 ) {

          last_click_time = Date.now(); // in milliseconds
          exit_button.html('Stopp');
          show_next_number();
          start_timer();
          display_timer();
          number_of_clicks = 0;
          number_of_success = 0;

        } else {

          clearTimeout(timer);
          var duration = Date.now() - last_click_time;
          var average = duration / number_of_clicks;
          div_result.html( '<p>Erfolgsrate = ' +
            ( number_of_clicks === 0 ? 0 : 100.0 * number_of_success / number_of_clicks ).toFixed(2) + '% in ' +
            (duration/1000).toFixed(2) + ' Sekunden.</p>' +
            '<p>Durchschnittliche Reaktionszeit: ' +
            (number_of_clicks === 0 ? 'N/A' : (average/1000).toFixed(2)) +
            ' Sekunden.</p>');
          exit_button.html('Start');
          last_click_time = 0;
        }

      });


      /* private functions */

      function display_timer(){
        if ( millisec >= 9 ){
          millisec=0;
          seconds+=1
        } else {
          millisec+=1;
        }
        div_result.html( seconds + "," + millisec );
        timer = setTimeout(display_timer, 96); // 100 msec - 4% for JS execution time
      }

      function start_timer(){
        millisec = 0;
        seconds = 0;
      }

      function show_next_number(){
        number_area.html( get_next_number() );
      }

      function get_next_number(){
        next_number = Math.floor(( number_range(digit_count.val()) * Math.random() ) % number_range(digit_count.val()) );
        return next_number;
      }

      function digit_sum(number) {
        var string = number.toString();
        string = string.split('');                 //split into individual characters
        var sum = 0;                               //have a storage ready
        for (var i = 0; i < string.length; i++) {  //iterate through
          sum += parseInt(string[i],10);           //convert from string to int
        }
        return sum;                                //return when done
      }

      /*
      *  maps digit_count into number_range
      *  turns 1 into 10, 2 into 100, 3 into 1000
      **/
      function number_range(digit_count){
        var result = 10;
        for (var i=1; i<digit_count; i++){
          result *= 10;
        }
        return result;
      }

      var snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");

      function beep() {
        if (self.beep) snd.play();
      }

      // translate content of own website area
      if ( self.lang ) self.lang.render();

      // perform callback
      if ( typeof callback === 'function' ) callback();

    }

  }
  
  /*------------------------------------------------ type definitions ------------------------------------------------*/

  /**
   * @summary ccm instance configuration
   * @typedef {ccm.config} ccm.components.game_wakener.config
   * @property {ccm.element} element - website area of ccm instance
   * @property {string} classes - CSS classes for website area
   * @property {ccm.style} style - CSS for website area
   */

} );

