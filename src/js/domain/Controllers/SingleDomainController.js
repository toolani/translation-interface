angular.module('ti.domain.controllers').
controller('SingleDomainController', ['$scope', '$stateParams', 'DomainService',
    function($scope, $stateParams, DomainService) {
        $scope.state = 'loading';
        $scope.name = $stateParams.domainName;
        $scope.strings = [];
        $scope.language = $stateParams.languageCode;
        
        DomainService.get($scope.name).then(function(domainData) {
            $scope.strings = domainData.strings;
        });
        
        $scope.saveTranslation = function(stringName, content, isNew) {
            console.log(stringName, content, isNew);
            
            return true;
        };
    }]);