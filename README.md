ngScroll
=============

Native Angular / vanilla JS custom scrollbars.

**Licensed under [cc by-sa 3.0](http://creativecommons.org/licenses/by-sa/3.0/) with attribution required**

Code is not optimised.

Tested in Chrome, FF & IE9.

[Demo can be seen here](http://sw4.github.io/ngScroll/)

Usage
====

Simply add the attribute `ng-scroll` to the element you wish to apply custom scrollbars to. Note that the element must have a position defined (relative, absolute, static, fixed..) and either specified dimensions or be restrictive enough to cause its inner content to overflow.

Depending on the desired direction of scroll, set `ng-scroll` to either `x`, `y`, or `xy`

Features
---

* Automatic resize handling (change in dimensions of container or content)

* Mouse wheel support

* Relies on native scroll events not positional offsets

* No reliance on external libraries
