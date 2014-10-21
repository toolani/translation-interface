angular.module('ti.domain.controllers').
controller('SingleDomainController', ['$scope', '$stateParams', 'DomainService',
    function($scope, $stateParams, DomainService) {
        $scope.state = 'loading';
        $scope.name = $stateParams.domainName;
        $scope.strings = [];
        $scope.language = 'de';
        
        DomainService.get($scope.name).then(function(domainData) {
            $scope.strings = domainData.strings;
        });
    }]);