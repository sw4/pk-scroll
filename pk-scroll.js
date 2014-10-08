// HELPERS FOR jQUERY+ANGULAR
if (typeof jQuery !== 'undefined') {
    // jquery available
    jQuery.fn.extend({
        pkScroll: function () {
            pk.scroll(this[0]);
        }
    });
}
if (typeof angular !== 'undefined') {
    // angular available
    'use strict';
    (
    function () {
        angular.module('pk-scroll', ['ng'])
            .directive('pkScroll', function () {
            return {
                restrict: 'A',
                link: function (scope, el) {
                    pk.scroll(el[0]);
                }
            };
        });
    })();
}
// MAIN PK SCROLL DECLARATION
var pk = pk || {};
(function (pk) {
    pk.scroll = function (el) {
        if (!el.getAttribute('pk-scroll')) return;

        // HELPER FUNCTIONS

        function getStyle(obj, style) {
            var css = window.getComputedStyle(obj);
            return css.getPropertyValue(style);
        }

        function addClass(thisEl, cssClass) {
            var cssClasses = thisEl.getAttribute('class');
            cssClasses = cssClasses || '';
            if (cssClasses && cssClasses.indexOf(cssClass) > -1) return;
            thisEl.setAttribute('class', (cssClasses ? cssClasses + ' ' : '') + cssClass);
            return thisEl;
        };

        function removeClass(thisEl, cssClass) {
            var cssClasses = thisEl.getAttribute('class');
            if (!cssClasses) return;
            thisEl.setAttribute('class', cssClasses.replace(cssClass, ''));
            return thisEl;
        };

        function bindEvent(ev, thisEl, fn) {
            if (thisEl.addEventListener) {
                thisEl.addEventListener(ev, fn, false);
            } else {
                thisEl.attachEvent("on" + ev, fn);
            }
        }
        // INIT SCROLL STRUCTURE
        addClass(el, 'pk-scroll-container');
        var container = document.createElement(el.nodeName);
        addClass(container, 'pk-scroll-content').innerHTML = el.innerHTML;
        var trackY = document.createElement('div');
        addClass(trackY, 'pk-scroll-trackY');
        var floatY = document.createElement('div');
        addClass(floatY, 'pk-scroll-floatY');
        trackY.appendChild(floatY);
        var trackX = document.createElement('div');
        addClass(trackX, 'pk-scroll-trackX');
        var floatX = document.createElement('div');
        addClass(floatX, 'pk-scroll-floatX');
        trackX.appendChild(floatX);
        el.innerHTML = '';
        el.appendChild(container);
        el.appendChild(trackY);
        el.appendChild(trackX);

        // INIT VARIABLES

        var
        floatYh = 0,
            floatYt = 0,
            floatXw = 0,
            floatXl = 0,
            allowY = false,
            allowX = false,
            percY = 0,
            percX = 0,
            contentH = 0,
            contentW = 0,
            containerH = 0,
            containerW = 0,
            floatYOffset = 0,
            floatXOffset = 0,
            contentWidth = 0,
            contentHeight = 0,
            containerWidth = 0,
            containerHeight = 0,
            scrollDir = el.getAttribute('pk-scroll').toLowerCase(),
            mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel"; //FF doesn't recognize mousewheel as of FF3.x  

        if (getStyle(el, 'position') == "static") el.style.position = "relative";

        bindEvent("scroll", container, function () {
            percY = container.scrollTop / (contentH - containerH);
            percX = container.scrollLeft / (contentW - containerW);
            percY = percY < 0 ? 0 : percY > 1 ? 1 : percY;
            percX = percX < 0 ? 0 : percX > 1 ? 1 : percX;
            floatY.style.top = (containerH - floatYh) * percY + 'px';
            floatX.style.left = (containerW - floatXw) * percX + 'px';
        });

        function resolveDimensions() {
            contentH = container.scrollHeight;
            contentW = container.scrollWidth;
            containerH = el.offsetHeight;
            containerW = el.offsetWidth;
            if (scrollDir.indexOf("y") > -1 && contentH > containerH) {
                allowY = true;
                addClass(el, 'pk-scroll-enableY');
                floatYh = floatY.offsetHeight;
                container.scrollTop = (contentH - containerH) * percY;
            } else {
                allowY = false;
                removeClass(el, 'pk-scroll-enableY');
                container.scrollTop = 0;
            }
            if (scrollDir.indexOf("x") > -1 && contentW > containerW) {
                allowX = true;
                addClass(el, 'pk-scroll-enableX');
                floatXw = floatX.offsetWidth;
                container.scrollLeft = (contentW - containerW) * percX;
            } else {
                allowX = false;
                removeClass(el, 'pk-scroll-enableX');
                container.scrollLeft = 0;
            }
        }
        resolveDimensions();

        var resizeMonitor = setInterval(function () {
            var widthContainer = el.offsetWidth,
                heightContainer = el.offsetHeight,
                widthContent = container.scrollWidth,
                heightContent = container.scrollHeight;
            if (widthContainer !== containerWidth || heightContainer !== containerHeight || widthContent !== contentWidth || heightContent !== contentHeight) {
                contentWidth = widthContent;
                contentHeight = heightContent;
                containerWidth = widthContainer;
                containerHeight = heightContainer;
                resolveDimensions();
            }
        }, 500);



        // DRAG HANDLERS
        var flag = 0,
            dragY = 0,
            dragX = 0,
            draggableY = floatY,
            draggableX = floatX,
            startY = 0,
            endY = 0,
            distanceY = 0,
            startX = 0,
            endX = 0,
            distanceX = 0;

        function dragging() {
            flag = 1;
            document.onselectstart = function () {
                return false;
            };
        }
        bindEvent("mousedown", draggableY, function (e) {
            flag = 0, dragY = 1;
            startY = e.pageY;
            floatYt = floatY.offsetTop;
            floatYOffset = startY - floatYt;
        });
        bindEvent("mousedown", draggableX, function (e) {
            flag = 0, dragX = 1;
            startX = e.pageX;
            floatXl = floatX.offsetLeft;
            floatXOffset = startX - floatXl;
        });

        bindEvent("mousemove", draggableY, dragging);
        bindEvent("mousemove", draggableX, dragging);
        bindEvent("mousemove", window, function (e) {
            if (dragY === 1) {
                startY = floatYt;
                endY = e.pageY - floatYOffset;
                distanceY = endY - startY;
                endY = floatYt + distanceY;
                percY = endY / (containerH - floatYh);
                container.scrollTop = (contentH - containerH) * percY;
                addClass(floatY, 'pk-scroll-dragging');
            }
            if (dragX === 1) {
                startX = floatXl;
                endX = e.pageX - floatXOffset;
                distanceX = endX - startX;
                endX = floatXl + distanceX;
                percX = endX / (containerW - floatXw);
                container.scrollLeft = (contentW - containerW) * percX;
                addClass(floatX, 'pk-scroll-dragging');
                addClass(document.body, 'pk-scroll-scrolling');
            }
        });
        bindEvent("mouseup", window, function () {
            dragY = 0, dragX = 0;
            removeClass(floatY, 'pk-scroll-dragging');
            removeClass(floatX, 'pk-scroll-dragging');
            if (flag === 1) {
                document.onselectstart = function () {
                    return true;
                };
                removeClass(document.body, 'pk-scroll-scrolling');
                flag = 0;
            }
        });

        // TRACK CLICKING HANDLERS
        bindEvent("click", trackY, function (e) {
            container.scrollTop = ((e.pageY - el.getBoundingClientRect().top) / containerH * (contentH - containerH));
        });
        bindEvent("click", trackX, function (e) {
            container.scrollLeft = ((e.pageX - el.getBoundingClientRect().left) / containerW * (contentW - containerW));
        });

        // MOUSE WHEEL HANDLERS
        function mouseScroll(e) {
            var offset = 0.1;
            if (e.wheelDelta > 0 || e.detail > 0) {
                offset = offset * -1;
            }
            if (scrollDir.indexOf("y") > -1) {
                container.scrollTop = container.scrollTop + (contentH - containerH) * offset;
            } else {
                container.scrollLeft = container.scrollLeft + (contentW - containerW) * offset;
            }
            /* Stop wheel propogation (prevent parent scrolling) */
            preventBubble(e);
        }

        function preventBubble(e) {
            if (e.preventDefault) e.preventDefault();
            if (e.stopPropagation) e.stopPropagation();
            e.cancelBubble = true; // IE events
            e.returnValue = false; // IE events
            return false;
        }
        bindEvent(mousewheelevt, container, mouseScroll);

        // TOUCH EVENT HANDLERS

        function getXy(e) {
            // touch event
            if (e.targetTouches && (e.targetTouches.length >= 1)) {
                return {
                    x: e.targetTouches[0].clientX,
                    y: e.targetTouches[0].clientY
                };
            }
            // mouse event
            return {
                x: e.clientX,
                y: e.clientY
            };
        }

        var pressed = false,
            startPos = {};

        function tap(e) {
            pressed = true;
            startPos = getXy(e);
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        function release(e) {
            pressed = false;
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        function drag(e) {
            var endPos, deltaX, deltaY;
            if (pressed) {
                endPos = getXy(e);
                deltaY = startPos.y - endPos.y;
                deltaX = startPos.x - endPos.x;
                if (deltaY > 2 || deltaY < -2) {
                    startPos.y = endPos.y;
                    container.scrollTop += deltaY;

                }
                if (deltaX > 2 || deltaX < -2) {
                    startPos.x = endPos.x;
                    container.scrollLeft += deltaX;
                }
            }
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        if (typeof window.ontouchstart !== 'undefined') {
            bindEvent('touchstart', container[0], tap);
            bindEvent('touchmove', container[0], drag);
            bindEvent('touchend', window, release);
        }

        // KEYBOARD HANDLERS    
        container.setAttribute("tabindex", 0);
        bindEvent('keydown', container, function (e) {

            switch (e.keyCode) {
                case 38:
                    //up cursor
                    if (!allowY) return;
                    container.scrollTop -= containerH * .1;
                    break;
                case 40:
                    //down cursor
                    if (!allowY) return;
                    container.scrollTop += containerH * .1;
                    break;
                case 37:
                    //left cursor
                    if (!allowX) return;
                    container.scrollLeft -= containerW * .1;
                    break;
                case 39:
                    //right cursor
                    if (!allowX) return;
                    container.scrollLeft += containerW * .1;
                    break;
                case 33:
                    //page up
                    if (!allowY) return;
                    container.scrollTop -= containerH;
                    break;
                case 34:
                    //page down
                    if (!allowY) return;
                    container.scrollTop += containerH;
                    break;
                case 36:
                    //home
                    if (!allowY) return;
                    container.scrollTop = 0;
                    break;
                case 35:
                    //end
                    if (!allowY) return;
                    container.scrollTop = contentH;
                    break;
            };
            preventBubble(e);
        });
    }
    return pk;
})(pk);
