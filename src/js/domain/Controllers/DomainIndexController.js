angular.module('ti.domain.controllers').
controller('DomainIndexController', ['$scope', '$q', '$state', 'DomainService', 'LanguageService',
    function($scope, $q, $state, DomainService, LanguageService) {
        $scope.state = 'loading';
        $scope.domains = [];
        $scope.languages = [];
        $scope.selectedDomain = "";
        $scope.selectedLanguage = "";
        
        var allowToLoad = [];
        
        allowToLoad.push(DomainService.query().then(function(domains) {
            $scope.domains = domains;
        }));
        
        allowToLoad.push(LanguageService.query().then(function(languages) {
            $scope.languages = languages;
        }));
        
        $q.all(allowToLoad).then(function() {
            $scope.state = 'loaded';
        });
        
        $scope.$watch('selectedDomain', function(newDomain) {
            setWorkingDomain(newDomain, $scope.selectedLanguage);
        });
        
        $scope.$watch('selectedLanguage', function(newLanguage) {
            setWorkingDomain($scope.selectedDomain, newLanguage);
        });
        
        var setWorkingDomain = function(domainName, languageCode) {
            if (!(angular.isDefined(domainName) && domainName !== "")) {
                return;
            }
            
            if (!(angular.isDefined(languageCode) && languageCode !== "")) {
                return;
            }
            
            $state.go('domains.single', {domainName: domainName, languageCode: languageCode});
        };
        
        $scope.hasSelectedDomain = function() {
            return $scope.selectedDomain !== "";
        };
        
        $scope.hasSelectedLanguage = function() {
            return $scope.selectedLanguage !== "";
        };
    }]);