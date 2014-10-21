angular.module('translation-interface', ['ui.router', 'ti.common', 'ti.domain', 'ti.string']).

config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/domains');
    
    $stateProvider.
        state('domains', {
            url: '/domains',
            templateUrl: '/template/translation/index.html'
        }).
        state('domains.single', {
            url: '/:domainName',
            templateUrl: '/template/domain/list.html',
            controller: 'SingleDomainController'
        });
}]);;
angular.module('ti.common',['ti.common.services']);
// Init sub-modules
angular.module('ti.common.services',[]);;
angular.module('ti.domain',['ti.domain.controllers',
                            'ti.domain.directives',
                            'ti.domain.filters',
                            'ti.domain.services']);

// Init sub-modules
angular.module('ti.domain.controllers',[]);
angular.module('ti.domain.directives',[]);
angular.module('ti.domain.filters',[]);
angular.module('ti.domain.services',[]);;
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
    }]);;
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
    }]);;
angular.module('ti.domain.services').
factory('DomainService', ['$http', '$q', function($http, $q) {
    var url = '/api';
    
    return {
        query: function() {
            var deferred = $q.defer();
            
            $http.
                get(url+'/domains').
                success(function(data) {
                    deferred.resolve(data.domains);
                }).
                error(function(data) {
                    deferred.resolve([]);
                });
            
            return deferred.promise;
        },
        get: function(name) {
            var deferred = $q.defer();
            
            $http.
                get(url+'/domains/'+name).
                success(function(data) {
                    deferred.resolve(data);
                }).
                error(function(data) {
                    deferred.resolve({});
                });
            
            return deferred.promise;
        }
    };
}]);;
angular.module('ti.string',['ti.string.directives']);

// Init sub-modules
angular.module('ti.string.directives',[]);
;
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