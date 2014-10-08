pk-scroll
=============

Customized scrollbars written in vanilla JS, complete with jQuery and angular wrappers (where libraries detected, neither are required).

**Licensed under [cc by-sa 3.0](http://creativecommons.org/licenses/by-sa/3.0/) with attribution required**

Tested in Chrome, FF & IE.

[Demo can be seen here](http://sw4.github.io/pk-scroll/)

Usage
====

Firstly, add the attribute `pk-scroll` and set to either `x`, `y`, or `xy` on the relevant element.

Then, there are 3 ways to initiate pk-scroll.


#####Plain Javascript

`pk.scroll(document.getElementById('yourEl'));`*

*<sup>You can use any means to retrieve a DOM node to pass to `pk.scroll()`</sup>

#####jQuery

`$('yourEl').pkScroll();`

#####Angular

Simply include `pk-scroll` as an application dependancy and the `pkScroll` directive will automatically apply.


Features
---

* Automatic resize handling (change in dimensions of container or content)

* Mobile touch / drag support

* Keyboard support

* Mouse wheel support

* Relies on native scroll events not positional offsets

* No reliance on external libraries
