myApp.directive('ngScroll', function ($interval) {
return {
                restrict: 'A',
                replace: true,
                scope: {
                    ngScroll: '@'
                },
                transclude: true,
                /*jshint multistr: true */
                template: "<div class='ng-scroll-container'>\
                    <div class='ng-scroll-content' ng-transclude></div>\
                    <div class='ng-scroll-trackY'><div class='ng-scroll-bobY'></div></div>\
                    <div class='ng-scroll-trackX'><div class='ng-scroll-bobX'></div></div>\
                </div>",
                link: function (scope, el) {
                    var container = el.children(),
                        children = container.children(),
                        content = angular.element(children[0]),
                        trackY = angular.element(container[1]),
                        bobY = angular.element(trackY[0].children[0]),
                        bobYh = 0,
                        bobYt = 0,
                        trackX = angular.element(container[2]),
                        bobX = angular.element(trackX[0].children[0]),
                        bobXw = 0,
                        bobXl = 0,
                        percY = 0,
                        percX = 0,
                        contentH = 0,
                        contentW = 0,
                        containerH = 0,
                        containerW = 0,
                        bobYOffset=0,
                        bobXOffset=0,
                        containerWidth,
                        containerHeight,
                        contentWidth,
                        contentHeight,
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
                        bobY.css({
                            top: (containerH - bobYh) * percY + 'px'
                        });
                        bobX.css({
                            left: (containerW - bobXw) * percX + 'px'
                        });
                    });

                    function resolveDimensions() {
                        contentH = container[0].scrollHeight;
                        contentW = container[0].scrollWidth;
                        containerH = el[0].offsetHeight;
                        containerW = el[0].offsetWidth;
                        if (scrollDir.indexOf("y") > -1 && contentH > containerH) {
                            bobY.css({
                                display: 'block',
                                opacity: 1
                            });
                            trackY.css({
                                display: 'block',
                                opacity: 1
                            });
                            bobYh = bobY[0].offsetHeight;
                            container[0].scrollTop = (contentH - containerH) * percY;
                        } else {
                            bobY.css({
                                display: 'none',
                                opacity: 0
                            });
                            trackY.css({
                                display: 'none',
                                opacity: 0
                            });
                            container[0].scrollTop = 0;
                        }
                        if (scrollDir.indexOf("x") > -1 && contentW > containerW) {
                            bobX.css({
                                display: 'block',
                                opacity: 1
                            });
                            trackX.css({
                                display: 'block',
                                opacity: 1
                            });
                            bobXw = bobX[0].offsetWidth;
                            container[0].scrollLeft = (contentW - containerW) * percX;
                        } else {
                            bobX.css({
                                display: 'none',
                                opacity: 0
                            });
                            trackX.css({
                                display: 'none',
                                opacity: 0
                            });
                            container[0].scrollLeft = 0;
                        }
                    }
                    resolveDimensions();
                                var widthContent = container[0].scrollWidth,
                                    heightContent = container[0].scrollHeight;
                                if (widthContent !== contentWidth || heightContent !== contentHeight) {                
                                    contentWidth = widthContent;
                                    contentHeight = heightContent;
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
                        draggableY = bobY[0],
                        draggableX = bobX[0],
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
                        bobYt = bobY[0].offsetTop;
                        bobYOffset = startY - bobYt;
                    });
                    bindEvent("mousedown", draggableX, function (e) {
                        flag = 0, dragX = 1;
                        startX = e.pageX;
                        bobXl = bobX[0].offsetLeft;
                        bobXOffset = startX - bobXl;
                    });

                    bindEvent("mousemove", draggableY, dragging);
                    bindEvent("mousemove", draggableX, dragging);

                    bindEvent("mousemove", window, function (e) {
                        if (dragY === 1) {
                            startY = bobYt;
                            endY = e.pageY - bobYOffset;
                            distanceY = endY - startY;
                            endY = bobYt + distanceY;
                            percY = endY / (containerH - bobYh);
                            container[0].scrollTop = (contentH - containerH) * percY;
                            bobY.addClass('ng-is-scrolling');
                            angular.element(document.body).addClass('ng-scrolling');
                        }
                        if (dragX === 1) {
                            startX = bobXl;
                            endX = e.pageX - bobXOffset;
                            distanceX = endX - startX;
                            endX = bobXl + distanceX;
                            percX = endX / (containerW - bobXw);
                            container[0].scrollLeft = (contentW - containerW) * percX;
                            bobX.addClass('ng-is-scrolling');
                            angular.element(document.body).addClass('ng-scrolling');
                        }
                    });
                    bindEvent("mouseup", window, function () {
                        dragY = 0, dragX = 0;
                        bobY.removeClass('ng-is-scrolling');
                        bobX.removeClass('ng-is-scrolling');
                        if (flag === 1) {
                            document.onselectstart = function () {
                                return true;
                            };
                            angular.element(document.body).removeClass('ng-scrolling');
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
                        if (e.preventDefault) e.preventDefault();
                        if (e.stopPropagation) e.stopPropagation();
                        e.cancelBubble = true; // IE events
                        e.returnValue = false; // IE events
                        return false;
                    }
                    bindEvent(mousewheelevt, container[0], mouseScroll);

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
