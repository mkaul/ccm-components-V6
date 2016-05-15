/**
 * @overview <i>ccm</i> component for quizz
 * @author André Kless <andre.kless@h-brs.de> 2015-2016
 * @copyright Copyright (c) 2015-2016 Bonn-Rhein-Sieg University of Applied Sciences
 * @license The MIT License (MIT)
 */

ccm.component( {

  /*-------------------------------------------- public component members --------------------------------------------*/

  /**
   * @summary component name
   * @memberOf ccm.components.quizz
   * @type {ccm.name}
   */
  name: 'quizz',

  /**
   * @summary default instance configuration
   * @memberOf ccm.components.quizz
   * @type {ccm.components.quizz.config}
   */
  config: {

    html:          [ ccm.load, './json/quizz_html.json' ],
    key:           'example',
    lang:          [ ccm.instance, './components/lang.js', { store: [ ccm.store, './json/quizz_lang.json' ] } ],
    onAnswer:      function ( result ) { console.log( result ); },
    onFinish:      function ( result ) { console.log( result ); result.quizz.render(); return false; },
    store:         [ ccm.store, './json/quizz.json' ],
    style:         [ ccm.load, './css/quizz.css' ],
    text_answer:   'lang#answer',
    text_correct:  'lang#correct',
    text_finish:   'lang#finish',
    text_next:     'lang#next',
    text_question: 'lang#question',
    text_result:   'lang#result'

  },

  /*-------------------------------------------- public component classes --------------------------------------------*/

  /**
   * @summary constructor for creating <i>ccm</i> instances out of this component
   * @alias ccm.components.quizz.Quizz
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
     * @summary <i>ccm</i> datastore that contains the [quizz dataset]{@link ccm.components.quizz.dataset} for rendering
     * @type {ccm.store}
     * @private
     */
    var store;

    /**
     * @summary key of quizz dataset for rendering
     * @type {ccm.key}
     * @private
     */
    var key;

    /**
     * @summary callback when question is answered
     * @type {ccm.components.quizz.onFinish}
     * @private
     */
    var onAnswer;

    /**
     * @summary callback when quizz is finished
     * @type {ccm.components.quizz.onFinish}
     * @private
     */
    var onFinish;

    /*------------------------------------------- public instance methods --------------------------------------------*/

    /**
     * @summary initialize <i>ccm</i> instance
     * @description
     * Called one-time when this <i>ccm</i> instance is created, all dependencies are solved and before dependent <i>ccm</i> components, instances and datastores are initialized.
     * This method will be removed by <i>ccm</i> after the one-time call.
     * @param {function} callback - callback when this instance is initialized
     */
    this.init = function ( callback ) {

      // privatize security relevant config members
      store    = self.store;    delete self.store;
      key      = self.key;      delete self.key;
      onAnswer = self.onAnswer; delete self.onAnswer;
      onFinish = self.onFinish; delete self.onFinish;

      // perform callback
      if ( callback ) callback();

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
      ccm.helper.dataset( { store: store, key: key }, function ( dataset ) {

        /**
         * quizz results
         * @type {{questions: number, correct: number, details: ccm.components.quizz.detail[]}}
         */
        var results = { questions: dataset.questions.length, correct: 0, details: [] };

        // render main html structure
        element.html( ccm.helper.html( self.html.main ) );

        // render quizz title
        renderTitle();

        // render quizz description
        renderDescription();

        // render first question
        renderQuestion( 1 );

        // perform callback
        if ( callback ) callback();

        /**
         * render quizz title
         */
        function renderTitle() {

          if ( dataset.title )
            ccm.helper.find( self, '.title' ).html( ccm.helper.html( { inner: ccm.helper.val( dataset.title ) } ) );

        }

        /**
         * render quizz description
         */
        function renderDescription() {

          if ( dataset.description )
            ccm.helper.find( self, '.description' ).html( ccm.helper.html( { inner: ccm.helper.val( dataset.description ) } ) );

        }

        /**
         * render quizz question
         * @param {number} nr - question number
         */
        function renderQuestion( nr ) {

          /**
           * current question dataset
           * @type {ccm.components.quizz.question}
           */
          var question = dataset.questions[ nr - 1 ];

          // miss some property in question dataset? => use default from quizz dataset
          if ( undefined === question.answers )     question.answers     = dataset.answers;
          if ( undefined === question.correct )     question.correct     = dataset.correct;
          if ( undefined === question.encode  )     question.encode      = dataset.encode;
          if ( undefined === question.input   )     question.input       = dataset.input;
          if ( undefined === question.no_feedback ) question.no_feedback = dataset.no_feedback;

          // render question html structure
          ccm.helper.find( self, '.current_question' ).html( ccm.helper.html( self.html.question, {

            // replace placeholder
            question: ccm.helper.val( self.text_question ),          // first word of the prefix of the question text
            nr: nr,                                                  // question number
            text: ccm.helper.val( question.text, question.encode ),  // question text
            caption: ccm.helper.val( self.text_answer ),             // caption of the answer button
            onsubmit: submit                                         // callback when quizz is finished

          } ) );

          // render question comment
          renderComment();

          // render current question answers
          for ( var i = 0; i < question.answers.length; i++ )
            renderAnswer( question.answers[ i ], i );

          // translate own content
          self.lang.render();

          /**
           * render question comment
           */
          function renderComment() {

            if ( question.comment )
              ccm.helper.find( self, '.comment' ).html( ccm.helper.html( { inner: ccm.helper.val( question.comment ) } ) );

          }

          /**
           * render a current question answer
           * @param {string|ccm.component.quizz.answer} answer - a current question answer text or dataset
           * @param {number} i - array index of current question answer
           */
          function renderAnswer( answer, i ) {

            /**
             * answer id in dom
             * @type {string}
             */
            var id = self.index + '-' + nr + '-' + i;

            // miss some property in answer dataset? => use default from question dataset
            if ( typeof answer === 'string' ) answer = { text: answer };
            if ( answer.encode === undefined ) answer.encode = question.encode;

            // render answer html structure
            ccm.helper.find( self, '.answers' ).append( ccm.helper.html( self.html.answer, {

              // replace placeholder
              text: ccm.helper.val( answer.text, answer.encode ),  // answer text
              id:   id                                             // answer id

            } ) );

            // prepend answer input field
            ccm.helper.find( self, '.answer:last .input' ).html( ccm.helper.html( getInput( question.input ) ) );

            /**
             * returns needed type of input field
             * @param {string|array|ccm.html} input - input field for question answers
             * @returns {ccm.html}
             */
            function getInput( input ) {

              var attributes, type;
              if ( Array.isArray( input ) ) {
                attributes = input[ 1 ];
                type = input[ 0 ];
              }
              else
                type = input;
              input = { tag: 'input', type: type || 'checkbox', name: nr + '-' + i, id: id };
              if ( type === 'radio' ) {
                input.name = nr;
                input.value = i;
              }
              ccm.helper.integrate( attributes, input );
              if ( self.onInput ) input.oninput = function() { self.onInput( self, jQuery( this ) ); };
              return input;

            }

          }

          /**
           * callback when quizz is finished
           */
          function submit() {

            var form = jQuery( this );
            if ( self.onValidation ) if ( !self.onValidation( self, form ) ) return false;
            var data = ccm.helper.formData( form );
            var result = { input: [], solution: [], passed: true };
            var answers_div = ccm.helper.find( self, '.answers' );
            var has_next = nr < dataset.questions.length;
            var name, answer_div, input, solution, type;
            if ( Array.isArray( question.input ) )
              type = question.input[ 0 ];
            else
              type = question.input;
            if ( type === 'radio' ) {
              name = nr;
              answer_div = ccm.helper.find( self, 'input[name="' + name + '"]' ).closest( '.answer' );
              input = parseInt( data[ name ] );
              solution = question.correct;
              result.input = input;
              result.solution = solution;
              result.passed = input === solution;
              answer_div.addClass( result.passed ? 'right' : 'wrong' );
            }
            for ( var i = 0; i < question.answers.length; i++ ) {
              if ( type === 'radio' )
                answer_div = ccm.helper.find( self, 'input[name="' + name + '"][value="' + i + '"]' ).closest( '.answer' );
              else {
                name = nr + '-' + i;
                answer_div = ccm.helper.find( self, 'input[name="' + name + '"]' ).closest( '.answer' );
                if ( type === 'text' )
                  input = data[ name ];
                else if ( type === 'number' )
                  input = data[ name ];
                else
                  input = !!data[ name ];
                if ( Array.isArray( question.correct ) ) {
                  if ( typeof question.correct[ 0 ] === 'number' ) {
                    solution = false;
                    for ( var j = 0; j < question.correct.length; j++ )
                      if ( question.correct[ j ] === i )
                        solution = true;
                  }
                  else
                    solution = question.correct[ i ];
                }
                else
                  solution = undefined;
                result.input.push( input );
                result.solution.push( solution );
                if ( input !== solution ) result.passed = false;
                answer_div.addClass( input === solution ? 'right' : 'wrong' );
              }
              if ( question.answers[ i ].comment ) renderComment( answer_div, question.answers[ i ].comment );
              else if ( type === 'text' || type === 'number' ) renderComment( answer_div, '<span>' + self.text_correct + '</span>: ' + solution );
            }
            if ( result.passed ) results.correct++;
            results.details.push( result );
            ccm.helper.find( self, 'form' ).replaceWith( ccm.helper.html( {
              class: 'result',
              inner: { inner: {
                tag: 'button',
                inner: has_next ? self.text_next : self.text_finish,
                onclick: has_next ? function () { renderQuestion( nr + 1 ); } : function () { if ( onFinish ) onFinish( ccm.helper.integrate( { quizz: self, dataset: ccm.helper.clone( dataset ) }, results ) ); }
              } }
            } ) );
            ccm.helper.find( self, '.result' ).prepend( answers_div );
            ccm.helper.find( self, 'input' ).attr( 'disabled', true );
            self.lang.render();
            if ( onAnswer ) onAnswer( ccm.helper.integrate( { quizz: self, dataset: ccm.helper.clone( dataset ), nr: nr }, result ) );
            if ( question.no_feedback ) ccm.helper.find( self, 'button' ).click();
            return false;

            function renderComment( answer_div, text ) {

              ccm.helper.find( self, answer_div, '.comment' ).html( ccm.helper.html( { inner: ccm.helper.val( text ) } ) );

            }

          }

        }

      } );

    };

  }

  /*------------------------------------------------ type definitions ------------------------------------------------*/

  /**
   * @namespace ccm.components.quizz
   */

  /**
   * @summary <i>ccm</i> instance configuration
   * @typedef {ccm.config} ccm.components.quizz.config
   * @property {string} classes - css classes for own website area
   * @property {ccm.element} element - own website area
   * @property {Object.<ccm.key, ccm.html>} html - <i>ccm</i> html data templates for own content
   * @property {ccm.key} key - key of [quizz dataset]{@link ccm.components.quizz.dataset} for rendering
   * @property {ccm.instance} lang - <i>ccm</i> instance for multilingualism
   * @property {ccm.components.quizz.onAnswer} onAnswer - callback when a question is answered
   * @property {ccm.components.quizz.onFinish} onFinish - callback when quizz is finished
   * @property {ccm.components.quizz.onInput} onInput - callback when value of an input field has changed
   * @property {ccm.components.quizz.onValidation} onValidation - callback who checks if a input field has a valid value
   * @property {ccm.store} store - <i>ccm</i> datastore that contains the [quizz dataset]{@link ccm.components.quizz.dataset} for rendering
   * @property {ccm.style} style - css for own content
   * @property {string} text_answer - caption of the answer button
   * @property {string} text_finish - caption of the finish button
   * @property {string} text_next - caption of the next button
   * @property {string} text_question - first word of the prefix of the question text
   */

  /**
   * @summary quizz dataset
   * @typedef {ccm.dataset} ccm.components.quizz.dataset
   * @property {Array.<string|ccm.components.quizz.answer>} answers - default question answers (see [question dataset]{@link ccm.components.quizz.question})
   * @property {number|number[]|boolean[]|string[]} correct - default correct answer(s) (see [question dataset]{@link ccm.components.quizz.question})
   * @property {string} description - quizz description
   * @property {boolean} encode - true: answer texts are html encoded
   * @property {string|array} input - default input field (see [question dataset]{@link ccm.components.quizz.question})
   * @property {boolean} no_feedback - default setting for visual feedback after answering (see [question dataset]{@link ccm.components.quizz.question})
   * @property {ccm.components.quizz.question[]} questions - [question dataset]{@link ccm.components.quizz.question}s
   * @property {string} title - quizz title
   */

  /**
   * @summary question dataset
   * @typedef {object} ccm.components.quizz.question
   * @property {Array.<string|ccm.components.quizz.answer>} answers - answer texts and/or [dataset]{@link ccm.components.quizz.answer}s
   * @property {string} comment - question comment
   * @property {number|number[]|boolean[]|string[]} correct - correct answer(s)
   * @property {boolean} encode - true: answer texts are html encoded
   * @property {string|array} input - input field
   * @property {boolean} no_feedback - no visual feedback after answering
   * @property {string} text - question text
   * @example input: 'checkbox', correct: [ 0, 1 ]              // multiple choice (checkboxes), first and second answer is correct
   * @example input: 'checkbox', correct: [ true, true, false ] // multiple choice (checkboxes), first and second answer is correct
   * @example input: 'radio',    correct: 0                     // single choice (radio buttons), first answer is correct
   * @example input: 'text',     correct: [ "foo", "", "" ]     // text inputs, first text input must be "foo" and the others blank
   * @example input: 'number',   correct: [ "", "20", "" ]      // number inputs, second text input must be "20" and the others blank
   * @example input: [ 'number', { min: 0, max: 10, value 5 } ] // number inputs, input must be between 0 and 10 and default value is 5
   */

  /**
   * @summary answer dataset
   * @typedef {object} ccm.components.quizz.answer
   * @property {string} comment - comment on answer correctness
   * @property {boolean} encode - true: answer text is html encoded
   * @property {string} text - answer text
   */

  /**
   * @summary question result
   * @typedef {object} ccm.components.quizz.question_result
   * @property {ccm.instance} quizz - quizz instance
   * @property {ccm.components.quizz.dataset} dataset - quizz dataset
   * @property {number} nr - question number
   * @property {boolean|number|string} input - input value(s)
   * @property {boolean|number|string} solution - question solution(s)
   * @property {boolean} passed - true if input value(s) matches the question solution(s)
   */

  /**
   * @summary quizz result
   * @typedef {object} ccm.components.quizz.quizz_result
   * @property {ccm.instance} quizz - quizz instance
   * @property {ccm.components.quizz.dataset} dataset - quizz dataset
   * @property {number} questions - number of questions
   * @property {number} correct - number of correct answered questions
   * @param {ccm.components.quizz.detail[]} details - details of each question result
   */

  /**
   * @summary details of a question result
   * @typedef {ccm.dataset} ccm.components.quizz.detail
   * @property {boolean|number|string} input - input value(s)
   * @property {boolean|number|string} solution - question solution(s)
   * @property {boolean} passed - true if input value(s) matches the question solution(s)
   */

  /**
   * @summary callback when a question is answered
   * @callback ccm.components.quizz.onAnswer
   * @param {ccm.components.quizz.question_result} result - question result
   */

  /**
   * @summary callback when quizz is finished
   * @callback ccm.components.quizz.onFinish
   * @param {ccm.components.quizz.quizz_result} result - quizz result
   */

  /**
   * @summary callback when value of an input field has changed
   * @callback ccm.components.quizz.onInput
   * @param {ccm.instance} instance - quizz instance
   * @param {ccm.element} input - input field
   */

  /**
   * @summary callback who checks if a input field has a valid value
   * @callback ccm.components.quizz.onValidation
   * @param {ccm.instance} instance - quizz instance
   * @param {ccm.element} form - form tag
   * @returns {boolean}
   */

} );