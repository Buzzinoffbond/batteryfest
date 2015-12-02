'use strict';

VK.init({
    apiId: 4845552 //4845552 4850071
});
VK.Widgets.Like("vk_like", {type: "full", height: 20, width:280, pageUrl:"http://batteryfest.ru/", pageImage:"/app/img/batteryfest-social.jpg"});

var fest = angular.module('fest', [
    'ngRoute',
    'ngAnimate',
    'filters',
    'helper',
    'masonry',
    'magnificPopup',
    'ymaps',
    'festServices',
    'festControllers'
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
            when('/personal_agreement', {
                templateUrl: 'app/templates/pages/personal_agreement.html', 
                controller: 'Agreement'
            }).
            when('/contact', {
                templateUrl: 'app/templates/contact/contact.html', 
                controller: 'Contact'
            }).
            when('/participate', {
                templateUrl: 'app/templates/participate/form.html', 
                controller: 'Participate'
            }).
            when('/band/:bandId',{
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
            }).
            otherwise({
                redirectTo: '/'
            });
    }]);