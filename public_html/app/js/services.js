'use strict';

angular.module('festServices', ['ngResource']).
    factory('Ticket', function($resource){
        return {
            get:
                $resource('http://frontend/v1/ticket/', {}, {
                    check: {method:'POST', isArray:false}
                }),
            post:
                $resource('http://frontend/v1/tickets/:vk_id', {vk_id:'@vk_id'}, {
                    check: {method:'GET', isArray:false}
                })
            }
});
