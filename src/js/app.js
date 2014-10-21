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
}]);