angular.module('bahmni.common.uiHelper')
    .directive('bmGallery', ['$location', '$rootScope', '$compile', '$document', function ($location, $rootScope, $compile, $document) {

        var controller = function ($scope) {
            $scope.visits = [];
            $scope.imagePosition = {
                tag: undefined,
                index: 0
            };
            this.image = function (record) {
                return {
                    src: Bahmni.Common.Constants.documentsPath + '/' + record.imageObservation.value,
                    title: record.concept.name,
                    desc: record.imageObservation.comment,
                    date: record.imageObservation.observationDateTime,
                    uuid: record.imageObservation.uuid
                };
            };

            this.addImageObservation = function (record, tag) {
                return this.addImage(this.image(record, tag));
            };

            this.addImage = function (image, tag) {
                var visit = _.find($scope.visits, function (visit) {
                    if(visit.tag === tag){
                        visit.images.push(image);
                        return true;
                    }
                });
                if(!visit){
                    var newVisit = {
                        tag: tag,
                        images: [image]
                    };
                    $scope.visits.push(newVisit);
                }
                return $scope.visits[tag].images.length - 1;
            };

            this.setIndex = function (tag, index) {
                $scope.imagePosition.tag = tag;
                $scope.imagePosition.index = index;
            };

            this.open = function () {
                $compile("<div bm-gallery-pane id='gallery-pane'></div>")($scope);
            };
        };

        return {
            controller: controller,
            scope: {
                patient: "="
            }
        }
    }])
    .directive('bmGalleryItem', function () {
        var link = function ($scope, element, attrs, imageGalleryController) {
            var image = {
                src: $scope.image.encodedValue,
                title: $scope.image.concept ? $scope.image.concept.name : "",
                date: $scope.image.obsDatetime,
                uuid: $scope.image.obsUuid
            };
            var tag = image.visitUuid;
            imageGalleryController.addImage(image, tag);

            element.click(function (e) {
                e.stopPropagation();
                imageGalleryController.setIndex(tag, $scope.index);
                imageGalleryController.open();
            });
        };
        return {
            link: link,
            scope: {
                image: '=',
                prepend: "=?",
                index: "@"
            },
            require: '^bmGallery'
        };
    })
    .directive('bmImageObservationGalleryItem', function () {
        var link = function (scope, element, attrs, imageGalleryController) {
            scope.imageIndex = imageGalleryController.addImageObservation(scope.observation, 'defaultTag');
            element.click(function (e) {
                e.stopPropagation();
                imageGalleryController.setIndex('defaultTag', scope.imageIndex);
                imageGalleryController.open();
            });
        };
        return {
            link: link,
            scope: {
                observation: '='
            },
            require: '^bmGallery'
        };
    })
    .directive('bmObservationGalleryItem', function () {
        var link = function (scope, element, attrs, imageGalleryController) {
            scope.imageObservation = new Bahmni.Clinical.ImageObservation(scope.observation, scope.observation.concept);
            scope.imageIndex = imageGalleryController.addImageObservation(scope.imageObservation, 'defaultTag');
            element.click(function (e) {
                e.stopPropagation();
                imageGalleryController.setIndex('defaultTag', scope.imageIndex);
                imageGalleryController.open();
            });
        };
        return {
            link: link,
            scope: {
                observation: '='
            },
            require: '^bmGallery'
        };
    })
    .directive("bmImageObservationGalleryItems", function () {
        var link = function (scope, elem, attrs, imageGalleryController) {
            angular.forEach(scope.list, function (record) {
                imageGalleryController.addImageObservation(record, 'defaultTag');
            });

            $(elem).click(function () {
                imageGalleryController.open();
            });
        };
        return {
            link: link,
            scope: {
                list: "="
            },
            require: '^bmGallery'
        }
    })
    .directive("bmLazyImageObservationGalleryItems", function () {
        var link = function (scope, elem, attrs, imageGalleryController) {
            scope.promise.then(function (response) {
                angular.forEach(response, function (record) {
                    var index = imageGalleryController.addImageObservation(record, 'defaultTag');
                    if (scope.currentObservation && scope.currentObservation.imageObservation.uuid == record.imageObservation.uuid) {
                        imageGalleryController.setIndex('defaultTag', index);
                    }
                });

                $(elem).click(function () {
                    imageGalleryController.open();
                });
            });
        };
        return {
            link: link,
            scope: {
                promise: "=",
                currentObservation: "=?index"
            },
            require: '^bmGallery'
        }
    });