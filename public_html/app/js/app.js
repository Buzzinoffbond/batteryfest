'use strict';

VK.init({
    apiId: 4850071 //4845552
});
VK.Widgets.Like("vk_like", {type: "full", height: 20, width:280, pageUrl:"http://batteryfest.ru/", pageImage:"/app/img/batteryfest-social.jpg"});

var fest = angular.module('fest', [
    'ngRoute',
    'ngAnimate',
    'helper',
    'festControllers',
    'festServices',
    'bandsControllers',
    'masonry',
    'magnificPopup',
    'ymaps'
]);

fest.config(['$routeProvider', '$locationProvider',
    function($routeProvider,$locationProvider) {
        $locationProvider.html5Mode(true);
        $routeProvider.
            when('/tickets', {
                title: 'Билеты',
                templateUrl: 'app/templates/tickets/get.html',
                controller: 'Tickets'}).
            when('/about', {
                templateUrl: 'app/templates/about/about.html', 
                controller: 'About'
            }).
            when('/contact', {
                templateUrl: 'app/templates/contact/contact.html', 
                controller: 'Contact'
            }).
            when('/participate', {
                templateUrl: 'app/templates/participate/form.html', 
                controller: 'Participate'
            }).
            when('/band',{
                templateUrl: 'app/templates/band/band.html',
                controller: 'Band'
            }).
            when('/media',{
                templateUrl: 'app/templates/media/media.html',
                controller: 'Media'
            }).
            when('/lineup',{
                templateUrl: 'app/templates/lineup/lineup.html',
                controller: 'Lineup'
            }).
            when('/', {
                templateUrl: 'app/templates/index/index.html', 
                controller: 'Index'
            });
            // otherwise({
            //     redirectTo: '/'
            // });
    }]);