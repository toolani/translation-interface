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
}]);