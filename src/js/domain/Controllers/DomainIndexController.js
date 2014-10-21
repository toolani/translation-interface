angular.module('ti.domain.controllers').
controller('DomainIndexController', ['$scope', '$state', 'DomainService',
    function($scope, $state, DomainService) {
        $scope.state = 'loading';
        $scope.domains = [];
        $scope.selectedDomain = "";
        
        DomainService.query().then(function(domains) {
            $scope.domains = domains;
            $scope.state = 'loaded';
        });
        
        $scope.$watch('selectedDomain', function(newDomain) {
            if (angular.isDefined(newDomain) && newDomain !== "") {
                $state.go('domains.single', {domainName: newDomain});
            }
        });
    }]);