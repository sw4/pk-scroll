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
                allowX = false,
                allowY = false,
                bobYH = 0,
                bobYT = 0,
                bobYOffset = 0,
                trackX = angular.element(children[3]),
                bobX = angular.element(children[4]),
                bobXW = 0,
                bobXL = 0,
                bobXOffset = 0,
                contentH = 0,
                contentW = 0,
                containerH = 0,
                containerW = 0,
                containerT = 0,
                contentT = 0,
                elWidth,
                elHeight,
                mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel"; //FF doesn't recognize mousewheel as of FF3.x

            function resolveDimensions() {
                bobYH = bobY[0].offsetHeight;
                bobXW = bobX[0].offsetWidth;
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
                    allowX = true;
                } else {
                    bobX.css({
                        display: 'none',
                        opacity: 0
                    });
                    trackX.css({
                        display: 'none',
                        opacity: 0
                    });
                    allowX = false;
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
                    allowY = false;
                }
            }
            resolveDimensions();
            var stop = $interval(function () {
                var width = el[0].offsetWidth,
                    height = el[0].offsetHeight;
                if ((width !== elWidth) || (height !== elHeight)) {
                    elWidth = width;
                    elHeight = height;
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

            function scrollContentY(percY) {
                if (!allowY) {
                    return;
                }
                if (percY < 0) {
                    percY = 0;
                } else if (percY > 1) {
                    percY = 1;
                }
                bobY.css({
                    top: (containerH - bobYH) * percY + 'px'
                });
                content.css({
                    top: ((contentH - containerH) * percY) * -1 + 'px'
                });
            }

            function scrollContentX(percX) {
                if (percX < 0) {
                    percX = 0;
                } else if (percX > 1) {
                    percX = 1;
                }
                bobX.css({
                    left: (containerW - bobXW) * percX + 'px'
                });
                content.css({
                    left: ((contentW - containerW) * percX) + 'px'
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
                bobYT = bobY[0].offsetTop;
                bobYOffset = startY - bobYT;
            }, false);
            draggableY.addEventListener("mousemove", function (e) {
                flag = 1;
                document.onselectstart = function () {
                    return false;
                }
                angular.element(document.body).addClass('ng-scrolling');
            }, false);

            draggableX.addEventListener("mousedown", function (e) {
                flag = 0, dragX = 1;
                startX = e.pageX;
                bobXL = bobX[0].offsetLeft;
                bobXOffset = startX - bobXL;
            }, false);
            draggableX.addEventListener("mousemove", function (e) {
                flag = 1;
                document.onselectstart = function () {
                    return false;
                }
                angular.element(document.body).addClass('ng-scrolling');
            }, false);

            dragarea.addEventListener("mousemove", function (e) {
                if (dragY === 1) {
                    startY = bobYT;
                    endY = e.pageY - bobYOffset;
                    distanceY = endY - startY;
                    endY = bobYT + distanceY;
                    percY = endY / (containerH - bobYH);
                    scrollContentY(percY);
                    bobY.addClass('ng-is-scrolling');
                }
                if (dragX === 1) {
                    startX = bobXL;
                    endX = e.pageX - bobXOffset;
                    distanceX = endX - startX;
                    endX = bobXL + distanceX;
                    percX = endX / (containerW - bobXW);
                    scrollContentX(percX);
                    bobX.addClass('ng-is-scrolling');
                }
            });
            dragarea.addEventListener("mouseup", function (e) {
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

            /* Mouse wheel scrolling */
            function mouseScroll(e) {
                var style = window.getComputedStyle(content[0]),
                    top = parseInt(style.getPropertyValue('top')) / (contentH - containerH) * -1,
                    offset = 0.1;
                if (e.wheelDelta > 0 || e.detail > 0) {
                    offset = offset * -1;
                }
                scrollContentY(top + offset);
            }
            if (container[0].attachEvent) //if IE (and Opera depending on user setting)
            container[0].attachEvent("on" + mousewheelevt, mouseScroll);
            else if (container[0].addEventListener) //WC3 browsers
            container[0].addEventListener(mousewheelevt, mouseScroll, false);

        }
    };
});
