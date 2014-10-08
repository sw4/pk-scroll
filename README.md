pk-scroll
=============

Customized scrollbars written in vanilla JS, complete with jQuery and angular wrappers (where libraries detected, neither are required).

**Licensed under [cc by-sa 3.0](http://creativecommons.org/licenses/by-sa/3.0/) with attribution required**

Tested in Chrome, FF & IE.

[Demo can be seen here](http://sw4.github.io/pk-scroll/)

Usage
====

Firstly, add the attribute `pk-scroll` and set to either `x`, `y`, or `xy` on the relevant element.

Then, there are 3 ways to initiaye pk-scroll.

1. Directly on the DOM node using JavaScript:

e.g: `pk.scroll(document.getElementById('yourEl'));`

2. Using the jQuery method `pkScroll()`:

e.g: `$('yourEl').pkScroll();`

3. Using the `pkScroll` angular.js directive hooked into the `pk-scroll` attribute (automatically applied on elements the attribute is detected on, simply include `pk-scroll` as an application dependancy)

Features
---

* Automatic resize handling (change in dimensions of container or content)

* Mobile touch / drag support

* Keyboard support

* Mouse wheel support

* Relies on native scroll events not positional offsets

* No reliance on external libraries
