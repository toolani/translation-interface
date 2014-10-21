angular.module('ti.string.directives').
directive('stringControl', [function() {
    return {
        link: function($scope, $element, $attrs) {
            $scope.workingTranslation = null;
            
            if (angular.isDefined($scope.string.translations[$scope.workingLanguage])) {
                $scope.workingTranslation = $scope.string.translations[$scope.workingLanguage].content;
            }
            
            $scope.otherTranslations = {};
            angular.forEach($scope.string.translations, function(t, lang) {
                if (t !== $scope.workingLanguage) {
                    $scope.otherTranslations[lang] = t.content;
                }
            });
        },
        restrict: 'E',
        scope: {
            string: '=',
            workingLanguage: '='
        },
        templateUrl: '/template/string/control.html'
    };
}]);