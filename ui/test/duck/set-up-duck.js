var duckFactory = duckCtor(_, angular, Q, $);
var builder = duckFactory.ContainerBuilder;
var buildContainerFor = function (moduleName, module, appLevelDependencies, textPluginPath, templatesToCache, isMultipleControllerSupportEnabled) {
    //textPluginPath = textPluginPath || "app/components/require-text/text";
    isMultipleControllerSupportEnabled = isMultipleControllerSupportEnabled || false;
    templatesToCache = templatesToCache || {};
    var bl = builder.withDependencies(appLevelDependencies)
        .cacheTemplates(module, templatesToCache);
    return bl
        .then(function (bldr) {
            return bldr.build(moduleName, module,
                {baseUrl: "/base", textPluginPath: textPluginPath, multipleControllers: isMultipleControllerSupportEnabled});
        });
};

var buildContainerForClinical = function (appLevelDependencies, templatesToCache) {
    var appLevelDependencies = {'bahmni.common.config' : {}};
    return buildContainerFor("bahmni.clinical", Bahmni.Clinical, appLevelDependencies);
};

var setupDuckForClinical = function (controllerName, viewPath, appLevelDependencies, controllerDependencies, templatesToCache, viewProcessors, options) {
    console.log("inside");
    return buildContainerForClinical(appLevelDependencies, templatesToCache || {})
        .then(function (container) {
            console.log("Inside setup");
            console.log(container);
            container.addViewProcessors(viewProcessors || []);
            return container.domMvc(controllerName, viewPath, controllerDependencies, options);
        });
};
