angular.module('ti.language.services').
factory('LanguageService', ['$http', '$q', function($http, $q) {
    var url = '/api';
    
    return {
        query: function() {
            var deferred = $q.defer();
            
            $http.
                get(url+'/languages').
                success(function(data) {
                    deferred.resolve(data);
                }).
                error(function(data) {
                    deferred.resolve([]);
                });
            
            return deferred.promise;
        }
    };
}]);