angular.module('ti.translation.services').
factory('TranslationService', ['$http', '$q', function($http, $q) {
    var url = '/api';
    
    return {
        save: function(translation) {
            var deferred = $q.defer();
            
            $http.
                post(url+'/domains/'+translation.domainName+'/strings/'+translation.stringName+'/translations/'+translation.languageCode, {content: translation.content}).
                success(function(data) {
                    if (angular.isDefined(data.result) && data.result === 'ok') {
                        deferred.resolve(true);
                    } else {
                        deferred.resolve(false);
                    }
                }).
                error(function(data) {
                    deferred.reject(data);
                });
            
            return deferred.promise;
        }
    };
}]);