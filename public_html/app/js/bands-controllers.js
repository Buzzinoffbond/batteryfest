'use strict';

var bandsControllers = angular.module('bandsControllers',[]);

bandsControllers.controller('Band',
    function($scope,Head,Menu){
        Head.setTitle('Группа');
        Menu.setActive('bands');
    });