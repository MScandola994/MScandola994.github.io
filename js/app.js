
var app = angular.module('6degrees', ['ngAnimate', 'ui.router', 'mgcrea.ngStrap', 'ngSanitize']);

app.config(function ($stateProvider, $urlRouterProvider) {

    //definisco lo stato di default
    $urlRouterProvider.otherwise('/home');

    //definisco tutti gli stati di cui ho bisogno
    $stateProvider
    //home
    .state('home', {
        url: '/home',
        templateUrl: 'html/partials/home.html',
        controller: 'homeController'
    })
    //elenco contatti
    .state('contattiElenco', {
        url: '/contacts',
        templateUrl: 'html/partials/contatti-elenco.html',
        controller: 'contattiController'

    })
    //dettaglio contatto
    .state('contattiDettaglio', {
        url: '/contacts/{idContatto:[0-9a-zA-Z]+}',
        templateUrl: 'html/partials/contatti-singolo.html',
        controller: 'contattiController'
    })
    //inserimento nuovo contatto
    .state('contattiNuovo', {
        url: '/new-contact',
        templateUrl: 'html/partials/contatti-nuovo.html',
        controller: 'contattiNuovoController'
    })
    //random images
    .state('rndImg', {
        url: '/random-images',
        templateUrl: 'html/partials/random-images.html',
        controller: 'randomImagesController'
    })

});

app.run(['$timeout', '$urlRouter', '$rootScope', '$state', 'User',
    function ($timeout, $urlRouter, $rootScope, $state, User) {
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            //se apro un modale e poi cambio rotta, il background del modale non viene rimosso dalla dom
            //console.log(toState);
            if ($('.modal-backdrop').length > 0) {
                var am = $('.modal-backdrop');
                for (var i = 0; i < am.length; i++) {
                    am[i].remove();
                }
            }

            /*if (!User.checkUser() && toState.name.toLowerCase() != 'home') {
                //console.log('non sei autenticato');
                event.preventDefault();
                $state.go('home');
            }*/
        });
}]);

app.filter('bool', function () {
    return function (val, trueValue, falseValue) {
        return val ? trueValue : falseValue;
    };
});


app.service('User', function () {
    var user0 = 'admin';
    var pwd0 = 'lipsia';

    var login = function (username, pwd, developer) {
        if (username == user0 && pwd == pwd0) {
            localStorage.setItem('scriptUp-user', developer);
            return true;
        } else {
            return false;
        }

    };

    var logout = function (developer) {
        localStorage.removeItem('scriptUp-user');
        return !(localStorage.getItem('scriptUp-user'))
    };

    var checkUser = function () {
        return (localStorage.getItem('scriptUp-user'));
    };
    

    obj = {
        username: '',
        developer: '',
        login: login,
        logout: logout,
        checkUser: checkUser
    };

    return obj;
});

app.controller('menuController', ['$scope', '$state', 'User',
    function ($scope, $state, User) {
        $scope.stato = $state;
        $scope.user;
        $scope.logout = function () {
            var ris = User.logout();
            if(ris) $state.go('home');
        };
        $scope.$watch('stato.current',function(v){
            if(!v || !v.name) return;
            $scope.user = User.checkUser();
        });
}]);