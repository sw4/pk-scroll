ngScroll
=============

Native Angular / vanilla JS custom scrollbars.

**Licensed under [cc by-sa 3.0](http://creativecommons.org/licenses/by-sa/3.0/) with attribution required**

Usage
====

Simply add the attribute `ng-scroll` to the element you wish to apply custom scrollbars to. Note that the element must have a position defined (relative, absolute, static, fixed..) and either specified dimensions or be restrictive enough to cause its inner content to overflow.

Depending on the desired direction of scroll, set `ng-scroll` to either `x`, `y`, or `xy`

The directive supports element resizing (so if the elements dimensions change, the scrollbars automatically update) and mouse wheel movements.
