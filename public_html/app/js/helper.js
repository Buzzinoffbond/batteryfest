'use strict';

var helper = angular.module('helper', []);

//Head manipulations
helper.factory('Head', function () {
    var title = 'Батарея';
    var description = '';
    var keywords = '';
    return {
        getTitle:function(){
            return title;
        },
        getDescription:function(){
            return description;
        },
        getKeywords:function(){
            return keywords;
        },
        setTitle:function(newTitle){
            title = newTitle;
        }
    }
});
helper.controller('Head',
    function($scope,Head){
        $scope.Head = Head;
    });
//Header
helper.controller('Header',
    function($scope){
        $scope.headerCollapsed = true;
        $scope.$on('$routeChangeStart', function(next, current) { 
            $scope.headerCollapsed = true;
        });
});
//Menu
helper.factory('Menu', function () {
    var Menu = [
        {name:'festival',text:'Фестиваль',url:'/',active:false,parent:'',hidden:false},
        //{name:'bands',text:'Группы',url:'http://studband.dev',active:false,parent:'',hidden:false},
        {name:'festindex',text:'Главная',url:'/',active:false,parent:'festival',hidden:true},
        {name:'lineup',text:'Lineup',url:'/lineup',active:false,parent:'festival',hidden:true},
        {name:'tickets',text:'Билеты на фестиваль',url:'/tickets',active:false,parent:'festival',hidden:true},
        {name:'media',text:'Отчеты',url:'/media',active:false,parent:'festival',hidden:true},
        // {name:'festabout',text:'О фестивале',url:'/about',active:false,parent:'festival',hidden:true},
        {name:'contact',text:'Контакты',url:'/contact',active:false,parent:'festival',hidden:true}
    ];
    var ActiveItem = {};    
    return{
        setActive: function(name){
            angular.forEach(Menu, function(item, key) {
                item.active = false;
                if (item.name === name) {
                    item.active = true;
                    ActiveItem = item;
                };
            });
            angular.forEach(Menu, function(item, key) {
                item.hidden=false;
                if (item.name === ActiveItem.parent) {
                    item.active = true;
                }
                else if (item.parent !== '' && item.parent !== ActiveItem.parent) {
                    item.hidden=true;
                };
            });
        },
        getMenu: function(){
            return Menu;
        }
    }
});
helper.controller('Menu',
    function($scope,Menu){
        $scope.Menu = Menu.getMenu();
        $scope.vk_like = true;
    });