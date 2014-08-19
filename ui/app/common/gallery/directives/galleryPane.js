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

            $scope.showPrev = function (visitIndex) {
                if ($scope.imageIndex > 0) {
                    --$scope.imageIndex;
                }
                else {
                    if (visitIndex == 0) {
                        visitIndex = $scope.visits.length;
                    }
                    var previousVisit = $scope.visits[visitIndex - 1];
                    $scope.imageTag = previousVisit.tag;
                    $scope.imageIndex = previousVisit.images.length - 1;
                }
            };

            $scope.showNext = function (visitIndex, visitImageSize) {
                if ($scope.imageIndex < $scope.visits[visitIndex].images.length - 1) {
                    ++$scope.imageIndex;
                } else {
                    if (visitIndex == $scope.visits.length - 1) {
                        visitIndex = -1;
                    }
                    var nextVisit = $scope.visits[visitIndex + 1];
                    $scope.imageTag = nextVisit.tag;
                    $scope.imageIndex = 0;
                }
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
