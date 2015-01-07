app.controller('loginController', function ($scope, $state, User) {
    
    $scope.user = {
        name: '',
        pwd: '',
        developer:'',
    };

    $scope.errorMessage = '';

    $scope.login = function () {
        var result = User.login($scope.user.name,$scope.user.pwd,$scope.user.developer);
        if(!result) $scope.errorMessage = 'Ops! Credenziali non corrette!';
        else{
            $state.go('scriptUp');
        }
    };
});