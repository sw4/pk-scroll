myApp.directive('ngScroll', function ($interval) {
return {
        restrict: 'A',
        replace: false,
        scope: {
            ngScroll: '@'
        },
        transclude: true,
        template: "<div class='ng-scroll-container'>\
        <div ng-transclude class='ng-scroll-content'></div>\
            <div class='ng-scroll-trackY'></div>\
            <div class='ng-scroll-bobY'></div>\
            <div class='ng-scroll-trackX'></div>\
            <div class='ng-scroll-bobX'></div>\
        </div>",
        link: function (scope, el, attrs) {
            var container = el.children(),
                children = container.children(),
                content = angular.element(children[0]),
                trackY = angular.element(children[1]),
                bobY = angular.element(children[2]),
                allowY = false,
                bobYh = 0,
                bobYt = 0,
                bobYOffset = 0,
                trackX = angular.element(children[3]),
                bobX = angular.element(children[4]),
                bobXw = 0,
                bobXl = 0,
                percY = 0,
                percX=0,
                bobXOffset = 0,
                contentH = 0,
                contentW = 0,
                containerH = 0,
                containerW = 0,
                containerT,
                contentT,
                containerWidth,
                containerHeight,
                contentWidth,
                contentHeight,
                mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel"; //FF doesn't recognize mousewheel as of FF3.x
            if (getStyle(el[0], 'position') == "static") {
                el.css({ position: "relative" });
            };
            function resolveDimensions() {
                contentH = content[0].offsetHeight;
                contentW = content[0].offsetWidth;
                containerH = container[0].offsetHeight;
                containerW = container[0].offsetWidth;
                containerT = el[0].getBoundingClientRect().top;
                contentT = content[0].getBoundingClientRect().top;
                var scrollDir = scope.ngScroll.toLowerCase();
                if (scrollDir.indexOf("x") > -1 && contentW > containerW) {;
                    bobX.css({
                        display: 'block',
                        opacity: 1
                    });
                    trackX.css({
                        display: 'block',
                        opacity: 1
                    });
                    bobXw = bobX[0].offsetWidth;
                    scrollContentY(percX);
                } else {
                    bobX.css({
                        display: 'none',
                        opacity: 0
                    });
                    trackX.css({
                        display: 'none',
                        opacity: 0
                    });
                    scrollContentX(0);
                }
                if (scrollDir.indexOf("y") > -1 && contentH > containerH) {;
                    bobY.css({
                        display: 'block',
                        opacity: 1
                    });
                    trackY.css({
                        display: 'block',
                        opacity: 1
                    });
                    bobYh = bobY[0].offsetHeight;
                    scrollContentY(percY);

                    allowY = true;
                } else {
                    bobY.css({
                        display: 'none',
                        opacity: 0
                    });
                    trackY.css({
                        display: 'none',
                        opacity: 0
                    });
                    scrollContentY(0);
                    allowY = false;
                }
                
                
            }
            resolveDimensions();
            var stop = $interval(function () {
                var widthContainer = el[0].offsetWidth,
                    heightContainer = el[0].offsetHeight,
                    widthContent = content[0].offsetWidth,
                    heightContent = content[0].offsetHeight;
                if ((widthContainer !== containerWidth) || (heightContainer !== containerHeight) || (widthContent !== contentWidth) || (heightContent !== contentHeight)) {
                    containerWidth = widthContainer;
                    containerHeight = heightContainer;
                    contentWidth = widthContent;
                    contentHeight = heightContent;
                    resolveDimensions();
                    scope.$eval(attrs.taOnResize);
                }
            }, 500);
            scope.$on('$destroy', function () {
                if (angular.isDefined(stop)) {
                    $interval.cancel(stop);
                }
                stop = undefined;
            });

            function scrollContentY(scrollPerc) {
                if (!allowY) {
                    return;
                }
                if (scrollPerc < 0) {
                    scrollPerc = 0;
                } else if (scrollPerc > 1) {
                    scrollPerc = 1;
                }
                percY = scrollPerc;
                bobY.css({
                    top: (containerH - bobYh) * scrollPerc + 'px'
                });
                content.css({
                    top: ((contentH - containerH) * scrollPerc) * -1 + 'px'
                });
            }

            function scrollContentX(scrollPerc) {
                
                if (scrollPerc < 0) {
                    scrollPerc = 0;
                } else if (scrollPerc > 1) {
                    scrollPerc = 1;
                }
                percX = scrollPerc;
                bobX.css({
                    left: (containerW - bobXw) * scrollPerc + 'px'
                });
                content.css({
                    left: ((contentW - containerW) * scrollPerc) + 'px'
                });
            }

            /* drag handlers */
            var flag = 0,
                dragY = 0,
                dragX = 0,
                draggableY = bobY[0],
                draggableX = bobX[0],
                dragarea = window,
                startY = 0,
                endY = 0,
                distanceY = 0,
                startX = 0,
                endX = 0,
                distanceX = 0;


            draggableY.addEventListener("mousedown", function (e) {
                flag = 0, dragY = 1;
                startY = e.pageY;
                bobYt = bobY[0].offsetTop;
                bobYOffset = startY - bobYt;
            }, false);
            draggableY.addEventListener("mousemove", function () {
                flag = 1;
                document.onselectstart = function () {
                    return false;
                }
                angular.element(document.body).addClass('ng-scrolling');
            }, false);

            draggableX.addEventListener("mousedown", function (e) {
                flag = 0, dragX = 1;
                startX = e.pageX;
                bobXl = bobX[0].offsetLeft;
                bobXOffset = startX -bobXl;
            }, false);
            draggableX.addEventListener("mousemove", function () {
                flag = 1;
                document.onselectstart = function () {
                    return false;
                }
                angular.element(document.body).addClass('ng-scrolling');
            }, false);

            dragarea.addEventListener("mousemove", function (e) {
                if (dragY === 1) {
                    startY = bobYt;
                    endY = e.pageY - bobYOffset;
                    distanceY = endY - startY;
                    endY = bobYt + distanceY;
                    percY = endY / (containerH - bobYh);
                    scrollContentY(percY);
                    bobY.addClass('ng-is-scrolling');
                }
                if (dragX === 1) {
                    startX = bobXl;
                    endX = e.pageX - bobXOffset;
                    distanceX = endX - startX;
                    endX = bobXl + distanceX;
                    percX = endX / (containerW - bobXw);
                    scrollContentX(percX);
                    bobX.addClass('ng-is-scrolling');
                }
            });
            dragarea.addEventListener("mouseup", function () {
                dragY = 0, dragX = 0;
                bobY.removeClass('ng-is-scrolling');
                bobX.removeClass('ng-is-scrolling');
                if (flag === 1) {
                    document.onselectstart = function () {
                        return true;
                    }
                    angular.element(document.body).removeClass('ng-scrolling');
                    flag = 0;
                }
            }, false);

            /* track clicking */
            trackY[0].addEventListener("click", function (e) {
                scrollContentY((e.pageY - el[0].getBoundingClientRect().top) / containerH);
            });
            trackX[0].addEventListener("click", function (e) {
                scrollContentX((e.pageX - el[0].getBoundingClientRect().left) / containerW);
            });
            function getStyle(obj, style) {
                var css = window.getComputedStyle(obj);
                return css.getPropertyValue(style);
            }
            /* Mouse wheel scrolling */
            function mouseScroll(e) {

                var top = parseInt(getStyle(content[0], 'top')) / (contentH - containerH) * -1,
                offset = 0.1;
                if (e.wheelDelta > 0 || e.detail > 0) {
                    offset = offset * -1;
                }
                scrollContentY(top + offset);

                if (e.preventDefault) e.preventDefault();
                if (e.stopPropagation) e.stopPropagation();
                e.cancelBubble = true;  // IE events
                e.returnValue = false;  // IE events
                return false;
            }
            if (container[0].attachEvent) //if IE (and Opera depending on user setting)
                container[0].attachEvent("on" + mousewheelevt, mouseScroll);
            else if (container[0].addEventListener) //WC3 browsers
                container[0].addEventListener(mousewheelevt, mouseScroll, false);

        }
    };
});
