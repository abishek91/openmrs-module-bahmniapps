module.exports = function(config) {
  config.set({
    basePath: '../..',
    frameworks: ['jasmine'],
    files: [
      'app/components/q/q.js',
      'app/components/jquery/jquery.js',
      'app/components/angular/angular.js',
      'app/components/underscore/underscore.js',
      'app/components/chai/chai.js',
      'app/components/duck-angular/duck-angular.js',
      'test/duck/require.js',
      //'app/components/requirejs-text/text.js',
        //'app/common/config/init.js',
        'app/common/domain/init.js',
        'app/common/domain/models/diagnosis.js',
        //'app/components/angular-bindonce/bindonce.js',
        'app/components/angular-sanitize/angular-sanitize.js',
        //'app/components/ng-clip/src/ngClip.js',
        //'app/components/angular-ui-select2/src/select2.js',
        //
        //'app/common/ui-helper/init.js',
        //'app/common/concept-set/init.js',
        //'app/common/logging/init.js',
        //'app/common/gallery/init.js',
        'app/clinical/init.js',
        'app/clinical/app.js',

        //'app/clinical/*.js',
        'app/clinical/consultation/controllers/diagnosisController.js',
      'test/duck/set-up-duck.js',
      'test/duck/**/*.js'
    ],
    reporters: ['progress'],
    autoWatch: true,
    browsers: ['Chrome']
  });
};