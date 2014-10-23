angular.module('ti.string.directives').
directive('stringControl', [function() {
    return {
        link: function($scope, $element, $attrs) {
            $scope.isNew = true;
            $scope.workingTranslation = null;
            
            if (angular.isDefined($scope.string.translations[$scope.workingLanguage])) {
                $scope.isNew = false;
                $scope.workingTranslation = $scope.string.translations[$scope.workingLanguage].content;
            }
            
            $scope.lastSavedTranslation = $scope.workingTranslation;
            
            $scope.otherTranslations = {};
            angular.forEach($scope.string.translations, function(t, lang) {
                if (t !== $scope.workingLanguage) {
                    $scope.otherTranslations[lang] = t.content;
                }
            });
            
            $scope.addNew = function() {
                $scope.workingTranslation = "";
            };
            
            $scope.cancelChange = function() {
                $scope.workingTranslation = $scope.lastSavedTranslation;
            };
            
            $scope.saveTranslation = function() {
                var t = {stringName: $scope.string.name, content: $scope.workingTranslation, isNew: $scope.isNew};
                
                $scope.disable = true;
                $scope.errorMessage = null;
                
                $scope.save(t).then(function(result) {
                    $scope.lastSavedTranslation = $scope.workingTranslation;
                    $scope.disable = false;
                },
                function(error) {
                    $scope.errorMessage = error;
                    $scope.disable = false;
                });
            };
        },
        restrict: 'E',
        scope: {
            string: '=',
            workingLanguage: '=',
            save: '&saveHandler'
        },
        templateUrl: '/template/string/control.html'
    };
}]);