(function () {
    'use strict';
 
    var app = angular
        .module('app', ['ui.router'])
        .config(config)
        .run(run);

    // Quick fix on angular >1.5.9 producing "possible unhandled rejection error
    app.config(['$qProvider', function ($qProvider) {
        $qProvider.errorOnUnhandledRejections(false);
    }]);

    function config($stateProvider, $urlRouterProvider) {
        //$urlRouterProvider.hashPrefix = '!';
        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'home/index.html',
                controller: 'Home.IndexController',
                controllerAs: 'vm',
                data: {activeTab: 'home'}
            })
            .state('account', {
                url: '/account',
                templateUrl: 'account/index.html',
                controller: 'Account.IndexController',
                controllerAs: 'vm',
                data: {activeTab: 'account'}
            })
            .state('light', {
                url: '/light',
                templateUrl: 'light/index.html',
                controller: 'Light.IndexController',
                controllerAs: 'vm',
                data: {activeTab: 'light'}
            })

    }

    function run($http, $rootScope, $window) {
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;

        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            $rootScope.activeTab = toState.data.activeTab;
            console.log(event, toState, toParams, fromState, fromParams);
        })
    }

    
    // get JWT token from server
    $.get('/app/token', function (token) {
        window.jwtToken = token;
        angular.bootstrap(document, ['app']);
    });

    $(function () {
    });
})();