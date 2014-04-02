basePath = '../';

files = [
  JASMINE,
  JASMINE_ADAPTER,
    '../app/components/angular/angular.js',
    '../app/components/angular-route/angular-route.js',
    '../app/components/angular-mocks/angular-mocks.js',
    '../app/components/ngInfiniteScroll/ng-infinite-scroll.js',
    '../app/components/d3/d3.min.js',
    '../app/components/nvd3/nv.d3.min.js',
    '../app/components/angularjs-nvd3-directives/dist/*.js',
    '../app/components/moment/moment.js',
    '../app/components/angular-ui-router/release/angular-ui-router.js',
    '../app/common/constants.js',
    '../app/**/init.js',
    '../app/**/constants.js',
    '../app/common/**/*.js',
    '../app/adt/**/*.js',
    '../app/clinical/**/*.js',
    '../app/document-upload/**/*.js',
    '../app/orders/**/*.js',
    '../app/home/**/*.js',
    '../app/registration/**/*.js',
    '../app/trends/**/*.js',
    'support/**/*.js',
    'unit/**/*.js'
];

autoWatch = true;
browsers = ['Chrome'];

reporters = ['dots', 'junit'];
junitReporter = {
  outputFile: 'output/unit.xml',
  suite: 'unit'
};
