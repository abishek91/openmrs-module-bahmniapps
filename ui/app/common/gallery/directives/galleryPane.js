angular.module('bahmni.common.gallery')
    .directive('bmGalleryPane', ['$rootScope', '$document', function ($rootScope, $document) {

        var $body = $document.find('body');

        $rootScope.$on('$stateChangeStart', function () {
            close();
        });

        var link = function ($scope, element) {
            $scope.galleryElement = element;
            $body.prepend($scope.galleryElement).addClass('gallery-open');

            KeyboardJS.on('right', function () {
                $scope.$apply(function () {
                    $scope.showNext();
                });
            });
            KeyboardJS.on('left', function () {
                $scope.$apply(function () {
                    $scope.showPrev();
                });
            });
        };

        function close() {
            $('body #gallery-pane').remove();
            $body.removeClass('gallery-open');
            KeyboardJS.clear('right');
            KeyboardJS.clear('left');
        }

        var controller = function ($scope) {
            $scope.imageIndex = $scope.imagePosition.index ? $scope.imagePosition.index : 0;
            $scope.imageTag = $scope.imagePosition.tag ? $scope.imagePosition.tag : 'defaultTag';

            $scope.isActive = function (index, tag) {
                return $scope.imageIndex == index && $scope.imageTag == tag;
            };

            var getVisitIndex = function () {
                return _.findIndex($scope.visits, function (visit) {
                    return visit.tag == $scope.imageTag;
                });
            };

            $scope.showPrev = function () {
                var visitIndex = getVisitIndex();
                if ($scope.imageIndex > 0) {
                    --$scope.imageIndex;
                }
                else {
                    if (visitIndex == 0) {
                        visitIndex = $scope.visits.length;
                    }
                    var previousVisit = $scope.visits[visitIndex - 1];
                    if (previousVisit.images.length == 0) {
                        $scope.showPrev(visitIndex - 1);
                    }
                    $scope.imageTag = previousVisit.tag;
                    $scope.imageIndex = previousVisit.images.length - 1;
                }
            };

            $scope.showNext = function () {
                var visitIndex = getVisitIndex();
                if ($scope.imageIndex < $scope.visits[visitIndex].images.length - 1) {
                    ++$scope.imageIndex;
                } else {
                    if (visitIndex == $scope.visits.length - 1) {
                        visitIndex = -1;
                    }
                    var nextVisit = $scope.visits[visitIndex + 1];
                    if (nextVisit.images.length == 0) {
                        $scope.showNext(visitIndex + 1);
                    }
                    $scope.imageTag = nextVisit.tag;
                    $scope.imageIndex = 0;
                }
            };

            $scope.getTotalLength = function () {
                var totalLength = 0;
                angular.forEach($scope.visits, function (visit) {
                    totalLength += visit.images.length;
                });
                return totalLength;
            };

            $scope.getCurrentIndex = function () {
                var currentIndex = 1;
                for (var i = 0; i < getVisitIndex(); i++) {
                    currentIndex += $scope.visits[i].images.length;
                }
                return currentIndex + parseInt($scope.imageIndex);
            };

            $scope.close = function () {
                close($scope);
            };
        };

        return {
            link: link,
            controller: controller,
            templateUrl: '../common/gallery/views/gallery.html'
        }
    }]);
