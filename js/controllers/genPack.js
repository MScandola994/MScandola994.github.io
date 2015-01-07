
app.controller('genPackController', function ($scope, $state) {

    $scope.rotta = $state;
    $scope.genByCart = null;
    $scope.copiedText = '';


    $scope.info = {
        author: null,
        descr: null,
        newVer: null,
        minVer: null,
        subVer: null,
        reqVer: null,
        req: null,
        exc: null,
        title: null,
        security: null,
        body: null,
        assemblyVersion: null,
        assemblyName: null,
        fileVersion: null,
        prevVersion: null,
        transazionale: null
    };

    //con questo evento evito che al click del collapse parti il reindirizzament dell'href che altrimenti impatta con la logica dell' ui-view
    $('a[data-toggle="collapse"]').click(function (e) {
        e.preventDefault();
    });


    $scope.getCarts = function(){
        console.log('imbastire la chiamata http');
    };

    $scope.genFile = function () {
        //diversificare per il copia e incolla e per ricerca
        console.log($scope.info);
    };

    $scope.resetForm = function () {
        for (var i in $scope.info) {
            $scope.info[i] = null
        }
        $scope.infoForm.$setPristine();
    };

    $scope.$watch('rotta', function (v) {
        if (!v) return;
        $scope.genByCart = v.current.name.indexOf('cart') != -1 ? true : false;

        if ($scope.genByCart) {
            $scope.getCarts();
        }
    });
});