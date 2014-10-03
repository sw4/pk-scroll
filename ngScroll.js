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
        <div class='ng-scroll-content'><div class='ng-scroll-area' ng-transclude></div></div>\
            <div class='ng-scroll-trackY'><div class='ng-scroll-bobY'></div></div>\
            <div class='ng-scroll-trackX'><div class='ng-scroll-bobX'></div></div>\
        </div>",
        link: function (scope, el, attrs) {

            var container = el.children(),
                children = container.children(),
                content = angular.element(children[0]),
                trackY = angular.element(container[1]),
                bobY = angular.element(trackY[0].children[0]),
                allowY,
                bobYh = 0,
                bobYt = 0,
                bobYOffset = 0,
                trackX = angular.element(container[2]),
                bobX = angular.element(trackX[0].children[0]),
                bobXw = 0,
                bobXl = 0,
                percY = 0,
                percX = 0,
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
                scrollDir = scope.ngScroll.toLowerCase(),
                mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel"; //FF doesn't recognize mousewheel as of FF3.x

            container[0].addEventListener("scroll", function () {

                var distY = container[0].scrollTop,
                    distX = container[0].scrollLeft;
                percY = distY / (contentH - containerH);
                percX = distX / (contentW - containerW);

                if (percY < 0) {
                    percY = 0;
                } else if (percY > 1) {
                    percY = 1;
                }
                if (percX < 0) {
                    percX = 0;
                } else if (percX > 1) {
                    percX = 1;
                }

                bobY.css({
                    top: (containerH - bobYh) * percY + 'px'
                });
                bobX.css({
                    left: (containerW - bobXw) * percX + 'px'
                });
            });
            if (getStyle(el[0], 'position') == "static") {
                el.css({
                    position: "relative"
                });
            }

            function getStyle(obj, style) {
                var css = window.getComputedStyle(obj);
                return css.getPropertyValue(style);
            }

            function resolveDimensions() {
                contentH = content[0].scrollHeight;
                contentW = content[0].scrollWidth;
                containerH = el[0].offsetHeight;
                containerW = el[0].offsetWidth;
                containerT = el[0].getBoundingClientRect().top;
                contentT = content[0].getBoundingClientRect().top;
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
                    container[0].scrollTop = 0;
                    allowY = false;
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
                    //  content.css({width:'auto'});
                    // allowX = true;
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
                    //     content.css({width:'100%'});
                    // allowX = false;
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
                };
            }, false);
            draggableX.addEventListener("mousedown", function (e) {
                flag = 0, dragX = 1;
                startX = e.pageX;
                bobXl = bobX[0].offsetLeft;
                bobXOffset = startX - bobXl;
            }, false);
            draggableX.addEventListener("mousemove", function () {
                flag = 1;
                document.onselectstart = function () {
                    return false;
                };
            }, false);

            window.addEventListener("mousemove", function (e) {
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
            window.addEventListener("mouseup", function () {
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
            }, false);
            /* track clicking */
            trackY[0].addEventListener("click", function (e) {
                container[0].scrollTop = ((e.pageY - el[0].getBoundingClientRect().top) / containerH * (contentH - containerH));
            });
            trackX[0].addEventListener("click", function (e) {
                container[0].scrollLeft = ((e.pageX - el[0].getBoundingClientRect().left) / containerW * (contentW - containerW));
            });
            /* Mouse wheel scrolling */
            function mouseScroll(e) {
                var top = container[0].scrollTop,
                    left = container[0].scrollLeft,
                    offset = 0.1;
                if (e.wheelDelta > 0 || e.detail > 0) {
                    offset = offset * -1;
                }
                if (scrollDir.indexOf("y") > -1) {
                    container[0].scrollTop = top + (contentH - containerH) * offset;
                } else {
                    container[0].scrollLeft = left + (contentW - containerW) * offset;
                }
                /* Stop wheel propogation (prevent parent scrolling) */
                if (e.preventDefault) e.preventDefault();
                if (e.stopPropagation) e.stopPropagation();
                e.cancelBubble = true; // IE events
                e.returnValue = false; // IE events
                return false;
            }
            if (container[0].attachEvent) //if IE (and Opera depending on user setting)
            container[0].attachEvent("on" + mousewheelevt, mouseScroll);
            else if (container[0].addEventListener) //WC3 browsers
            container[0].addEventListener(mousewheelevt, mouseScroll, false);
        };
});
