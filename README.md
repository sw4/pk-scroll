
pk-scroll
========

[![Build Status](https://travis-ci.org/sw4/pk-scroll.svg?branch=master)](https://travis-ci.org/sw4/pk-scroll)
[![Coverage Status](https://coveralls.io/repos/sw4/pk-scroll/badge.png)](https://coveralls.io/r/sw4/pk-scroll)
[![Dependencies Status](https://david-dm.org/sw4/pk-scroll.png)](https://david-dm.org/sw4/pk-scroll)
[![Dev Dependencies Status](https://david-dm.org/sw4/pk-scroll/dev-status.svg)](https://david-dm.org/sw4/pk-scroll)
[![Repo Size](https://reposs.herokuapp.com/?path=sw4/pk-scroll)]()

Customized scrollbars written in vanilla JS, complete with jQuery and angular wrappers (where libraries detected, neither are required).

**Licensed under [cc by-sa 3.0](http://creativecommons.org/licenses/by-sa/3.0/) with attribution required**

#####[Demo](http://sw4.github.io/pk-scroll/)


###Requires

`pk-base.js` and `pk-base.css` as well as `pk-draggable.js` and `pk-draggable.css` as a precursor

###Features

- Automatic resize handling (change in dimensions of container or content)
- Mobile touch / drag support
- Keyboard support
- Mouse wheel support
- Relies on native scroll events not positional offsets

###Usage


#####Plain Javascript

`pk.scroll({element:document.getElementById('yourEl'), axis:'xy'});`*

*<sup>You can use any means to retrieve a DOM node to pass to `pk.scroll()`</sup>

#####jQuery

`$('yourEl').pkScroll('xy');`

#####Angular

Simply include `pk-scroll` as an application dependancy, add the attribute `pk-scroll` and set to either `x`, `y`, or `xy` on the relevant element and the `pkScroll` directive will automatically apply.
