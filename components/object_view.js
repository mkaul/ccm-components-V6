/**
 * @overview object_view as ccm component
 * @author mkaul2m <Manfred.Kaul@h-brs.de>, 2015
 * @license The MIT License (MIT)
 */

ccm.component( {

  /*-------------------------------------------- public component members --------------------------------------------*/

  /**
   * component name
   * @type {string}
   * @ignore
   */
  name: 'object_view',

  /**
   * @summary default instance configuration
   * @type {ccm.components.object_view.config}
   * @ignore
   */
  config: {

    title: 'Title',

    object: { a: 'a', b: 'b' }  // object to be rendered

  },
  
  /*-------------------------------------------- public component classes --------------------------------------------*/
  
  /**
   * @alias ccm.components.object_view
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
     * @summary render object_view in own website area
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
        (self.title ? '<h2>' + self.title + '</h2>' : '') +
        '<div class="dump"></div>'
      );

      var dump_area = element.find('div.dump');

      var query = null;

      // simple query overwriting object
      if ( self.id_query ){
        query = { _id: {
          $regex: self.id_query,
          $options: 'i' }
        }
      }

      // complex query overwriting simple query
      if ( self.query ){
        query = self.query;
      }

      if ( query ){
        ccm.dataset(
          {
            db: 'mongodb',
            store: self.store,
            url: self.store_url
          },
          query,
          function( result_object ) {
            dump_area.html(
              '<pre>' +
              (self.json_stringify ? JSON.stringify( result_object, null, 4 ) : dump( result_object, 'none' ) ) +
              '</pre>'
            );
          },
          self.user,
          self.user.data().token
        );
      } else {
        dump_area.html(
          '<pre>' +
          (self.json_stringify ? JSON.stringify( self.object, null, 4 ) : dump( self.object, 'none' ) ) +
          '</pre>' );
      }

      /*
       *
       * http://stackoverflow.com/questions/603987/what-is-the-javascript-equivalent-of-var-dump-or-print-r-in-php
       *
       * To show the contents of the variable in an alert window: dump(variable)
       * To show the contents of the variable in the web page: dump(variable, 'body')
       * To just get a string of the variable: dump(variable, 'none')
       *
       */

      /*
       dump() displays the contents of a variable like var_dump() does in PHP. dump() is
       better than typeof, because it can distinguish between array, null and object.

       @param v:              The variable
       @param howDisplay:     "none", "body", "alert" (default)
       @param recursionLevel: Number of times the function has recursed when entering nested objects or arrays. Each level of recursion adds extra space to the output to indicate level. Set to 0 by default.

       @return A string of the variable's contents

       Limitations:

       Can't pass an undefined variable to dump().
       dump() can't distinguish between int and float.
       dump() can't tell the original variable type of a member variable of an object.
       These limitations can't be fixed because these are *features* of JS. However, dump()
       */
      function dump(v, howDisplay, recursionLevel) {
        howDisplay = (typeof howDisplay === 'undefined') ? "alert" : howDisplay;
        recursionLevel = (typeof recursionLevel !== 'number') ? 0 : recursionLevel;


        var vType = typeof v;
        var out = vType;

        switch (vType) {
          case "number":
          /* there is absolutely no way in JS to distinguish 2 from 2.0
           so 'number' is the best that you can do. The following doesn't work:
           var er = /^[0-9]+$/;
           if (!isNaN(v) && v % 1 === 0 && er.test(3.0))
           out = 'int';*/
          case "boolean":
            out += ": " + v;
            break;
          case "string":
            out += "(" + v.length + '): "' + v + '"';
            break;
          case "object":
            //check if null
            if (v === null) {
              out = "null";

            }
            //If using jQuery: if ($.isArray(v))
            //If using IE: if (isArray(v))
            //this should work for all browsers according to the ECMAScript standard:
            else if (Object.prototype.toString.call(v) === '[object Array]') {
              out = 'array(' + v.length + '): {\n';
              for (var i = 0; i < v.length; i++) {
                out += repeatString('   ', recursionLevel) + "   [" + i + "]:  " +
                  dump(v[i], "none", recursionLevel + 1) + "\n";
              }
              out += repeatString('   ', recursionLevel) + "}";
            }
            else { //if object
              sContents = "{\n";
              cnt = 0;
              for (var member in v) {
                //No way to know the original data type of member, since JS
                //always converts it to a string and no other way to parse objects.
                sContents += repeatString('   ', recursionLevel) + "   " + member +
                  ":  " + dump(v[member], "none", recursionLevel + 1) + "\n";
                cnt++;
              }
              sContents += repeatString('   ', recursionLevel) + "}";
              out += "(" + cnt + "): " + sContents;
            }
            break;
        }

        if (howDisplay === 'body') {
          var pre = document.createElement('pre');
          pre.innerHTML = out;
          document.body.appendChild(pre)
        }
        else if (howDisplay === 'alert') {
          alert(out);
        }

        return out;
      }

      /*
       * repeatString() returns a string which has been repeated a set number of times
       */
      function repeatString(str, num) {
        out = '';
        for (var i = 0; i < num; i++) {
          out += str;
        }
        return out;
      }

      // translate content of own website area
      if ( self.lang ) self.lang.render();

      // perform callback
      if ( callback ) callback();

    }

  }
  
  /*------------------------------------------------ type definitions ------------------------------------------------*/

  /**
   * @summary ccm instance configuration
   * @typedef {ccm.config} ccm.components.object_view.config
   * @property {ccm.element} element - website area of ccm instance
   * @property {string} classes - CSS classes for website area
   * @property {ccm.style} style - CSS for website area
   */

} );

