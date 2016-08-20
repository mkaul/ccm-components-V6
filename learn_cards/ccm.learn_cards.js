/**
 * @overview learn_cards
 * @author Manfred Kaul 2016
 * @license The MIT License (MIT)
 */

ccm.component( /** @lends ccm.components.learn_cards */ {

  /*-------------------------------------------- public component members --------------------------------------------*/

  /**
   * @summary unique component name
   * @type {ccm.type.name}
   */
  name: 'learn_cards',
  
  /**
   * @summary default instance configuration
   * @type {ccm.components.learn_card.config}
   * @ignore
   */
  config: {
    
    key: 'macro',
    store: [ ccm.store, '../learn_cards/learn_cards.json' ],
    style: [ ccm.load, '../learn_cards/learn_cards.css' ]
    
  },

  /*-------------------------------------------- public component classes --------------------------------------------*/

  /**
   * @summary constructor for creating <i>ccm</i> instances out of this component
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
     * @summary render content in own website area
     * @param {function} [callback] - callback when content is rendered
     */
    this.render = function ( callback ) {
  
      // Array Remove - By John Resig (MIT Licensed)
      Array.prototype.remove = function(from, to) {
        var rest = this.slice((to || from) + 1 || this.length);
        this.length = from < 0 ? this.length + from : from;
        return this.push.apply(this, rest);
      };

      // set content of own website area
      /**
       * website area for own content
       * @type {ccm.element}
       */
      var $element = ccm.helper.element( self ).html(
        '<h2>Nennen Sie den passenden Begriff zu folgender Umschreibung:</h2>' +
        '<div class="card">' +
          '<div class="question"></div>' +
          '<button class="answer">Zeige Antwort</button>' +
          '<div class="answer"></div>' +
          '<div class="source"></div>' +
        '</div>' +
        '<div class="next">' +
        '<button id="known" class="next">gewusst</button>' +
        '<button id="unknown" class="next">nicht gewusst</button>' +
        '</div>' );
      
      var question_div = $element.find('div.question');
      var answer_div = $element.find('div.answer');
      
      function toggle_answer(display){
        $element.find('div.answer').toggle(display);
        $element.find('div.source').toggle(display);
        $element.find('div.next').toggle(display);
      }
  
      // initially hide answer area
      toggle_answer();
  
      $element.find('button.answer').click(function () {
        toggle_answer();
      });
  
      // get dataset for rendering
      ccm.helper.dataset( self, function ( dataset ) {
        
        /**
         * index of next question
         * @type {int}
         */
        var index = 0;

        /**
         * array of indices of all unknown questions
         * initially all questions
         * therefore set unknown = array [0,1,2,3, ... ]
         * @type {Array}
         */
        var unknown = Array.apply(null, {length: dataset.length}).map(Number.call, Number);
  
        /**
         * render next random unkown question
         */
        function next_question(){
          // choose index randomly
          index = Math.floor( unknown.length * Math.random() );
          var data = dataset[unknown[index]];
          question_div.html( data.question );
          answer_div.html( data.answer );
          if (data.source){
            $element.find('div.source').html(
              '<a href="' +
              data.source +
              '" target="_blank">' +
              data.source.replace(/^https?\:\/\//i, "") +
              '</a>'
            );
          } else {
            $element.find('div.source').html('');
          }
        }
        
        next_question();
        
        $element.find('button.next').click(function () {
  
          if ( jQuery(this).attr('id') === 'known' ){
            unknown.remove(index);
            if (unknown.length === 0){
              $element.find('div.card').html('<h1>Herzlichen Glückwunsch!</h1> <h1>Alles gewusst!</h1>');
              $element.find('h2').hide();
              $element.find('div.next').hide();
              return;
            }
          }
  
          toggle_answer(false); // display === false means, hide in any case
  
          next_question();

        });
  
        // perform callback
        if ( callback ) callback();
        
      } );

    }

  }

  /*------------------------------------------------ type definitions ------------------------------------------------*/

  /**
   * @namespace ccm.components.learn_card
   */

  /**
   * @external ccm.types
   * @see {@link http://akless.github.io/ccm-developer/api/ccm/ccm.types.html}
   */

} );