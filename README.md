# ccm-components

[![Join the chat at https://gitter.im/mkaul/ccm-components](https://badges.gitter.im/mkaul/ccm-components.svg)](https://gitter.im/mkaul/ccm-components?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## 1. Componentizing the Web

The WWW has yet no well established component model which all browser manufacturers would agree upon, see [ACM: Componentizing the Web - We may be on the cusp of a new revolution in web development.](http://queue.acm.org/detail.cfm?id=2844732), [Mozilla: The state of Web Components](https://hacks.mozilla.org/2015/06/the-state-of-web-components/), [Web Platform Podcast 54: Are Web Components Ready Yet?](https://www.youtube.com/watch?v=oDtpXhMQeew) and [What happened to Web Components?](http://www.2ality.com/2015/08/web-component-status.html), [W3C Web Components specifications](https://github.com/w3c/webcomponents/). 

## 2. Components of the Client Side Component Model (ccm)

The [Client Side Component Model (ccm)](https://github.com/akless/ccm-components/wiki/Einstieg:-Was-ist-ccm%3F) is based on a framework developed by André Kless in his master thesis 2015 at the University of Applied Sciences Bonn-Rhein-Sieg introducing JavaScript+JSON+CSS-components which may be loaded cross-domain cross-platform via [JSONP](https://en.wikipedia.org/wiki/JSONP) and rendered into any div or span on any web page. For introductory tutorials see the Wiki Pages in his [GitHub repository](https://github.com/akless/ccm-components). 

The [W3C WebComponent Custom Element](http://www.w3.org/TR/custom-elements/) can easliy be implemented with the help of ccm as follows (see also the demo in w3c_custom_tag.html):
    
    <ccm-element data-component="name_of_the_ccm_component"></ccm-element>


## 3. Installation

    git clone https://github.com/mkaul/ccm-components.git
    

### 4. Usage: Open a html file in the browser
No server required. Simply open one of the HTML files in the main directory in your browser.

* index.html for an index of all ccm components of this GitHub repository
* demo_mkaul.html for embedding multiple components in a html page and switching languages
* games.html for games only
* tagcloud.html for tagcloud only
* w3c_custom_tag.html as W3C WebComponent Custom Element demo 

## 5. Online Demos
* [Index of components of this repository](http://mkaul.github.io/ccm-components/index_components.html)
* [Demo Page](http://mkaul.github.io/ccm-components/demo_mkaul.html)
* [Demo Game](http://mkaul.github.io/ccm-components/games.html)
* [Demo TagCloud](http://mkaul.github.io/ccm-components/tagcloud.html)
* [W3C WebComponent Custom Element](http://mkaul.github.io/ccm-components/w3c_custom_tag.html)
* [GitHub Homepage of this repository](http://mkaul.github.io/ccm-components)

## 6. Contact
* [Homepage M. Kaul](https://www.h-brs.de/de/inf/prof-dr-manfred-kaul) 