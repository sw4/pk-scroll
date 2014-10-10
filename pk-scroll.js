var pk = pk || {};
(function (pk) {
    // HELPERS FOR jQUERY+ANGULAR
    if (typeof jQuery !== 'undefined') {
        // jquery available
        jQuery.fn.extend({
            pkScroll: function (axis) {
                pk.scroll({
                    element: this[0],
                    axis: axis
                });
            }
        });
    }
    if (typeof angular !== 'undefined') {
        // angular available
        (

        function () {
            angular.module('pk-scroll', ['ng'])
                .directive('pkScroll', function () {
                return {
                    restrict: 'A',
                    link: function (scope, el) {
                        pk.scroll({
                            element: el[0],
                            axis: el[0].getAttribute('pk-scroll')
                        });
                    }
                };
            });
        })();
    }
    pk.scroll = function (opt) {
        if (!opt.axis) return;
        var el = opt.element;
        // INIT SCROLL STRUCTURE
        pk.addClass(el, 'pk-scroll-container');
        var container = document.createElement(el.nodeName);
        pk.addClass(container, 'pk-scroll-content').innerHTML = el.innerHTML;
        var trackY = document.createElement('div');
        pk.addClass(trackY, 'pk-scroll-trackY');
        var floatY = document.createElement('div');
        pk.addClass(floatY, 'pk-scroll-floatY');
        trackY.appendChild(floatY);
        var trackX = document.createElement('div');
        pk.addClass(trackX, 'pk-scroll-trackX');
        var floatX = document.createElement('div');
        pk.addClass(floatX, 'pk-scroll-floatX');
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
            scrollDir = opt.axis.toLowerCase(),
            mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel"; //FF doesn't recognize mousewheel as of FF3.x  

        if (pk.getStyle(el, 'position') == "static") el.style.position = "relative";

        pk.bindEvent("scroll", container, function () {
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
                pk.addClass(el, 'pk-scroll-enableY');
                floatYh = floatY.offsetHeight;
                container.scrollTop = (contentH - containerH) * percY;
            } else {
                allowY = false;
                pk.removeClass(el, 'pk-scroll-enableY');
                container.scrollTop = 0;
            }
            if (scrollDir.indexOf("x") > -1 && contentW > containerW) {
                allowX = true;
                pk.addClass(el, 'pk-scroll-enableX');
                floatXw = floatX.offsetWidth;
                container.scrollLeft = (contentW - containerW) * percX;
            } else {
                allowX = false;
                pk.removeClass(el, 'pk-scroll-enableX');
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

        if(allowY){
            pk.draggable({
                element: floatY,
                move: {
                    y: true
                },
                container: {
                    element: trackY
                },
                listeners: {
                    dragging: function () {
                        container.scrollTop = (contentH - containerH) * (floatY.offsetTop / (trackY.offsetHeight - floatY.offsetHeight));
                    }
                }
            });
        }
        if(allowX){
            pk.draggable({
                element: floatX,
                move: {
                    x: true
                },
                container: {
                    element: trackX
                },
                listeners: {
                    dragging: function () {
    
                        container.scrollLeft = (contentW - containerW) * (floatX.offsetLeft / (trackX.offsetWidth - floatY.offsetWidth));
                    }
                }
            });
        }
        pk.bindEvent("click", floatY, function (e) {
            pk.preventBubble(e);
        });
        pk.bindEvent("click", floatX, function (e) {
            pk.preventBubble(e);
        });

        // TRACK CLICKING HANDLERS
        pk.bindEvent("click", trackY, function (e) {
            container.scrollTop = ((e.pageY - el.getBoundingClientRect().top) / containerH * (contentH - containerH));
        });
        pk.bindEvent("click", trackX, function (e) {
            container.scrollLeft = ((e.pageX - el.getBoundingClientRect().left) / containerW * (contentW - containerW));
        });

        // MOUSE WHEEL HANDLERS
        function mouseScroll(e) {
            var offset = 0.1;
            if (e.wheelDelta > 0 || e.detail > 0) {
                offset = offset * -1;
            }
            if (allowY) {
                container.scrollTop = container.scrollTop + (contentH - containerH) * offset;
            } else {
                container.scrollLeft = container.scrollLeft + (contentW - containerW) * offset;
            }
            /* Stop wheel propogation (prevent parent scrolling) */
            pk.preventBubble(e);
        }

        pk.bindEvent(mousewheelevt, container, mouseScroll);

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
            pk.bindEvent('touchstart', container[0], tap);
            pk.bindEvent('touchmove', container[0], drag);
            pk.bindEvent('touchend', window, release);
        }

        // KEYBOARD HANDLERS    
        container.setAttribute("tabindex", 0);
        pk.bindEvent('keydown', container, function (e) {
            if(allowY){                
                switch (e.keyCode) {
                    case 38: //up cursor
                        container.scrollTop -= containerH * 0.1;
                        break;
                    case 40: //down cursor
                    case 32: //spacebar
                        container.scrollTop += containerH * 0.1;
                        break;
                    case 33: //page up
                        container.scrollTop -= containerH;
                        break;
                    case 34: //page down
                        container.scrollTop += containerH;
                        break;
                    case 36: //home
                        container.scrollTop = 0;
                        break;
                    case 35: //end
                        container.scrollTop = contentH;
                        break;
                }                
            }
            if(allowX){                
                switch (e.keyCode) {
                    case 37: //left cursor
                        container.scrollLeft -= containerW * 0.1;
                        break;
                    case 39: //right cursor
                        container.scrollLeft += containerW * 0.1;
                        break;
                }                
            }
            pk.preventBubble(e);
        });
    };
    return pk;
})(pk);
