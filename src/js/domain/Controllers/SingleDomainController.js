angular.module('ti.domain.controllers').
controller('SingleDomainController', ['$scope', '$stateParams', 'DomainService', 'TranslationService',
    function($scope, $stateParams, DomainService, TranslationService) {
        $scope.state = 'loading';
        $scope.name = $stateParams.domainName;
        $scope.strings = [];
        $scope.language = $stateParams.languageCode;
        
        DomainService.get($scope.name).then(function(domainData) {
            $scope.strings = domainData.strings;
        });
        
        $scope.saveTranslation = function(stringName, content, isNew) {
            var t = {
                domainName:   $scope.name,
                stringName:   stringName,
                languageCode: $scope.language,
                content:      content
            };
            
            return TranslationService.save(t);
        };
    }]);