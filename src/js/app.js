angular.module('translation-interface', ['ui.router', 
                                         'ti.common', 
                                         'ti.domain', 
                                         'ti.language', 
                                         'ti.string', 
                                         'ti.translation']).

config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/domains');
    
    $stateProvider.
        state('domains', {
            url: '/domains',
            templateUrl: '/template/translation/index.html',
            controller: 'DomainIndexController'
        }).
        state('domains.single', {
            url: '/:domainName/to/:languageCode',
            templateUrl: '/template/domain/list.html',
            controller: 'SingleDomainController'
        });
}]);