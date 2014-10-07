'use strict';
(
function () {
    angular.module( 'ng-scroll', ['ng'] )
        .directive('ngScroll', function ($interval) {
            return {
                restrict: 'A',
                replace: true,
                scope: {
                    ngScroll: '@'
                },
                transclude: true,
                /*jshint multistr: true */
				template: function( element) {
					var tag = element[0].nodeName;
					return "<div  class='ng-scroll-container'>\
                    <"+tag+" class='ng-scroll-content' ng-transclude></"+tag+">\
                    <div class='ng-scroll-trackY'><div class='ng-scroll-floatY'></div></div>\
                    <div class='ng-scroll-trackX'><div class='ng-scroll-floatX'></div></div>\
				</div>";
				},
                link: function (scope, el) {
                    var container = el.children(),
                        trackY = angular.element(container[1]),
                        floatY = angular.element(trackY[0].children[0]),
                        floatYh = 0,
                        floatYt = 0,
                        trackX = angular.element(container[2]),
                        floatX = angular.element(trackX[0].children[0]),
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
                        scrollDir = scope.ngScroll.toLowerCase(),
                        mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel"; //FF doesn't recognize mousewheel as of FF3.x


                    function getStyle(obj, style) {
                        var css = window.getComputedStyle(obj);
                        return css.getPropertyValue(style);
                    }

                    if (getStyle(el[0], 'position') == "static") {
                        el.css({
                            position: "relative"
                        });
                    }

                    bindEvent("scroll", container[0], function () {
                        percY = container[0].scrollTop / (contentH - containerH);
                        percX = container[0].scrollLeft / (contentW - containerW);
                        percY = percY < 0 ? 0 : percY > 1 ? 1 : percY;
                        percX = percX < 0 ? 0 : percX > 1 ? 1 : percX;
                        floatY.css({
                            top: (containerH - floatYh) * percY + 'px'
                        });
                        floatX.css({
                            left: (containerW - floatXw) * percX + 'px'
                        });
                    });

                    function resolveDimensions() {
                        contentH = container[0].scrollHeight;
                        contentW = container[0].scrollWidth;
                        containerH = el[0].offsetHeight;
                        containerW = el[0].offsetWidth;
                        if (scrollDir.indexOf("y") > -1 && contentH > containerH) {
                            floatY.css({
                                display: 'block',
                                opacity: 1
                            });
                            trackY.css({
                                display: 'block',
                                opacity: 1
                            });
                            allowY = true;
                            floatYh = floatY[0].offsetHeight;
                            container[0].scrollTop = (contentH - containerH) * percY;
                        } else {
                            floatY.css({
                                display: 'none',
                                opacity: 0
                            });
                            trackY.css({
                                display: 'none',
                                opacity: 0
                            });
                            allowY = false;
                            container[0].scrollTop = 0;
                        }
                        if (scrollDir.indexOf("x") > -1 && contentW > containerW) {
                            floatX.css({
                                display: 'block',
                                opacity: 1
                            });
                            trackX.css({
                                display: 'block',
                                opacity: 1
                            });
                            allowX = true;
                            floatXw = floatX[0].offsetWidth;
                            container[0].scrollLeft = (contentW - containerW) * percX;
                        } else {
                            floatX.css({
                                display: 'none',
                                opacity: 0
                            });
                            trackX.css({
                                display: 'none',
                                opacity: 0
                            });
                            allowX = false;
                            container[0].scrollLeft = 0;
                        }
                    }
                    resolveDimensions();

                    var stop = $interval(function () {
                        var widthContainer = el[0].offsetWidth,
                            heightContainer = el[0].offsetHeight,
                            widthContent = container[0].scrollWidth,
                            heightContent = container[0].scrollHeight;
                        if (widthContainer !== containerWidth || heightContainer !== containerHeight || widthContent !== contentWidth || heightContent !== contentHeight) {
                            contentWidth = widthContent;
                            contentHeight = heightContent;
                            containerWidth = widthContainer;
                            containerHeight = heightContainer;
                            resolveDimensions();
                        }
                    }, 500);
                    scope.$on('$destroy', function () {
                        if (angular.isDefined(stop)) {
                            $interval.cancel(stop);
                        }
                        stop = undefined;
                    });


                    /* drag handlers */
                    var flag = 0,
                        dragY = 0,
                        dragX = 0,
                        draggableY = floatY[0],
                        draggableX = floatX[0],
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
                        floatYt = floatY[0].offsetTop;
                        floatYOffset = startY - floatYt;
                    });
                    bindEvent("mousedown", draggableX, function (e) {
                        flag = 0, dragX = 1;
                        startX = e.pageX;
                        floatXl = floatX[0].offsetLeft;
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
                            container[0].scrollTop = (contentH - containerH) * percY;
                            floatY.addClass('ng-scroll-dragging');
                            angular.element(document.body).addClass('ng-scroll-scrolling');
                        }
                        if (dragX === 1) {
                            startX = floatXl;
                            endX = e.pageX - floatXOffset;
                            distanceX = endX - startX;
                            endX = floatXl + distanceX;
                            percX = endX / (containerW - floatXw);
                            container[0].scrollLeft = (contentW - containerW) * percX;
                            floatX.addClass('ng-scroll-dragging');
                            angular.element(document.body).addClass('ng-scroll-scrolling');
                        }
                    });
                    bindEvent("mouseup", window, function () {
                        dragY = 0, dragX = 0;
                        floatY.removeClass('ng-scroll-dragging');
                        floatX.removeClass('ng-scroll-dragging');
                        if (flag === 1) {
                            document.onselectstart = function () {
                                return true;
                            };
                            angular.element(document.body).removeClass('ng-scroll-scrolling');
                            flag = 0;
                        }
                    });

                    /* track clicking */
                    bindEvent("click", trackY[0], function (e) {
                        container[0].scrollTop = ((e.pageY - el[0].getBoundingClientRect().top) / containerH * (contentH - containerH));
                    });
                    bindEvent("click", trackX[0], function (e) {
                        container[0].scrollLeft = ((e.pageX - el[0].getBoundingClientRect().left) / containerW * (contentW - containerW));
                    });
                    /* Mouse wheel scrolling */
                    function mouseScroll(e) {
                        var offset = 0.1;
                        if (e.wheelDelta > 0 || e.detail > 0) {
                            offset = offset * -1;
                        }
                        if (scrollDir.indexOf("y") > -1) {
                            container[0].scrollTop = container[0].scrollTop + (contentH - containerH) * offset;
                        } else {
                            container[0].scrollLeft = container[0].scrollLeft + (contentW - containerW) * offset;
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
                    bindEvent(mousewheelevt, container[0], mouseScroll);


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
                                container[0].scrollTop += deltaY;

                            }
                            if (deltaX > 2 || deltaX < -2) {
                                startPos.x = endPos.x;
                                container[0].scrollLeft += deltaX;
                            }
                        }
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                    }

                    /* Touch mobile events */
                    if (typeof window.ontouchstart !== 'undefined') {
                        bindEvent('touchstart', container[0], tap);
                        bindEvent('touchmove', container[0], drag);
                        bindEvent('touchend', window, release);
                    }
                    /*
                    Keyboard events
                    */
                    container[0].setAttribute("tabindex", 0);
                    bindEvent('keydown', container[0], function (e) {

                        switch (e.keyCode) {
                            case 38:
                                //up cursor
                                if (!allowY) return;
                                container[0].scrollTop -= containerH * .1;
                                break;
                            case 40:
                                //down cursor
                                if (!allowY) return;
                                container[0].scrollTop += containerH * .1;
                                break;
                            case 37:
                                //left cursor
                                if (!allowX) return;
                                container[0].scrollLeft -= containerW * .1;
                                break;
                            case 39:
                                //right cursor
                                if (!allowX) return;
                                container[0].scrollLeft += containerW * .1;
                                break;
                            case 33:
                                //page up
                                if (!allowY) return;
                                container[0].scrollTop -= containerH;
                                break;
                            case 34:
                                //page down
                                if (!allowY) return;
                                container[0].scrollTop += containerH;
                                break;
                            case 36:
                                //home
                                if (!allowY) return;
                                container[0].scrollTop = 0;
                                break;
                            case 35:
                                //end
                                if (!allowY) return;
                                container[0].scrollTop = contentH;
                                break;
                        };
                        preventBubble(e);
                    });

                    function bindEvent(ev, elem, fn) {
                        if (elem.addEventListener) {
                            elem.addEventListener(ev, fn, false);
                        } else {
                            elem.attachEvent("on" + ev, fn);
                        }
                    }

                }
            };
        });
}
)();
