/**
 * @overview ccm component for simple realtime checklist
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
  name: 'checklist',

  /**
   * @summary default instance configuration
   * @type {ccm.components.checklist.config}
   * @ignore
   */
  config: {

    key: 'demo',
    html: [ ccm.load, '../checklist/checklist_html.json' ],
    store: [ ccm.store, { db: 'redis', store: 'checklist', url: 'ws://ccm2.inf.h-brs.de/index.js' } ],
    text_placeholder: 'Hier neue Aufgabe eingeben...',
    text_delete: 'Entfernen'

  },
  
  /*-------------------------------------------- public component classes --------------------------------------------*/
  
  /**
   * @alias ccm.components.checklist
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
     * @summary initialize ccm instance
     * @description when instance is created, all dependencies are solved and before dependent instances are initialized
     * @ignore
     */
    this.init = function ( callback ) {

      // listen to checklist ccm realtime datastore change event
      self.store.onChange = function () {

        // own website area no more exists? => abort
        if ( !ccm.helper.tagExists( self.element.find( '> #' + ccm.helper.getElementID( self ) ) ) ) return;

        // (re)render content of own website area
        self.render();

      };

      if ( callback ) callback();

    };

    /**
     * @summary render content in own website area
     * @param {function} callback - callback when ccm instance is rendered (first parameter is ccm instance)
     */
    this.render = function ( callback ) {

      /**
       * website area for own content
       * @type {ccm.element}
       */
      var element = ccm.helper.element( self );

      // get checklist dataset
      self.store.get( self.key, function ( dataset ) {

        // dataset not exists? => create new checklist dataset
        if ( dataset === null ) return self.store.set( { key: self.key }, function ( dataset ) { self.key = dataset.key; self.render(); } );

        // no tasks property? => add empty list of tasks
        if ( !dataset.tasks ) dataset.tasks = [];

        // clean website area for own content
        element.html( '' );

        // render tasks
        for ( var i = 0; i < dataset.tasks.length; i++ ) renderTask( i );

        // add empty task
        addEmptyTask();

        // hide all task buttons
        element.find( 'button' ).hide();

        // perform callback
        if ( callback ) callback();

        // log event
        if ( self.bigdata ) self.bigdata.log( 'render', self.key );

        /**
         * render checklist task
         * @param {number} i - task array index
         */
        function renderTask( i ) {

          /**
           * task dataset
           * @type {object}
           */
          var task = dataset.tasks[ i ];

          /**
           * task ccm html data template
           * @type {object}
           */
          var task_html = self.html.task;

          /**
           * checklist task entry
           * @type {ccm.element}
           */
          var entry = ccm.helper.html(

            task_html,              // task ccm html data template
            function () {

              // hide all checklist buttons
              element.find( 'button' ).hide();

              // is last button? => abort
              if ( i === dataset.tasks.length - 1 ) return;

              // show only buttons from this task entry
              jQuery( this ).find( 'button' ).show();

            },      // task entry onmouseenter event
            task.completed,         // task checkbox status
            function () {

              // mark task as completed
              task.completed = !task.completed;

              // update checklist dataset
              self.store.set( dataset, function () {

                // log event
                if ( self.bigdata ) self.bigdata.log( 'checkbox', { key: self.key, task: task } );

              } );

            },      // task checkbox onchange event
            task.text || '',        // task input text
            self.text_placeholder,  // task input placeholder text
            function () {

              /**
               * input element
               * @type {ccm.element}
               */
              var input = jQuery( this );

              // change task text
              dataset.tasks[ i ].text = input.val().trim();

              // update size of input field
              changeSize( input );

              // is last task?
              if ( i === dataset.tasks.length - 1 ) {

                // show delete button
                entry.find( 'button' ).show();

                // add new empty task
                addEmptyTask();

              }

              // update checklist dataset
              self.store.set( dataset, function () {

                // log event
                if ( self.bigdata ) self.bigdata.log( 'input', { key: self.key, task: task } );

              } );

            },      // task input oninput event
            self.text_delete,       // task button caption
            function () {

              // delete task
              dataset.tasks.splice( i, 1 );

              // update checklist dataset
              self.store.set( dataset, function () {

                // log event
                if ( self.bigdata ) self.bigdata.log( 'delete', { key: self.key, task: task } );

                // (re)render content of own website area
                self.render();

              } );

            }       // task button onclick event

          );

          // change size of task text input field
          changeSize( entry.find( 'input[type="text"]' ) );

          // add task entry to checklist
          element.append( entry );

          /**
           * updates size of task text input field
           * @param {ccm.element} input - input element
           */
          function changeSize( input ) {

            /**
             * value of input field
             * @type {string}
             */
            var value = input.val();

            /**
             * value length + 1 (from input field)
             * @type {number}
             */
            var value_size = value.length + 1;

            /**
             * placeholder length + 1 (from input field)
             * @type {number}
             */
            var placeholder_size = input.attr( 'placeholder' ).length + 1;

            // change input field size
            input.attr( 'size', value === '' && placeholder_size > value_size ? placeholder_size : value_size );

          }

        }

        /**
         * add empty task to checklist
         */
        function addEmptyTask() {

          /**
           * last task dataset
           * @type {object}
           */
          var task = dataset.tasks.length === 0 ? null : dataset.tasks[ dataset.tasks.length - 1 ];

          // last task is not empty?
          if ( !task || ( task.text && task.text.trim() !== '' ) ) {

            // add new empty task
            dataset.tasks.push( {} );

            // render new empty task
            renderTask( dataset.tasks.length - 1 );

          }

        }

      } );

    }

  }
  
  /*------------------------------------------------ type definitions ------------------------------------------------*/

  /**
   * @summary ccm instance configuration
   * @typedef {ccm.config} ccm.components.checklist.config
   * @property {ccm.element} element - website area of ccm instance
   * @property {string} classes - CSS classes for website area
   * @property {ccm.style} style - CSS for website area
   * @property {ccm.store} store - ccm datastore for checklists
   * @property {ccm.instance} bigdata - ccm instance for big data
   * @property {string} text_placeholder - placeholder for input fields
   * @property {string} text_delete - value for delete buttons
   * @property {ccm.key} key - checklist dataset key
   */

} );