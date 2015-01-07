app.controller('listaPacchettiController', function ($scope, $state, $http) {

    $scope.listaPacchetti = [];
    $scope.currentPacchetto = {};
    $scope.isTableRendered = false;

    $scope.tableConfig = {
        ids: ['id', 'nome', 'autore', 'dataInserimento', 'descrizione', 'versione'],
        labels: ['#', 'Nome', 'Autore', 'Data Inserimento', 'Descrizione', 'Versione']
    };

    $scope.getListaPacchetti = function () {
        $http.get("../extLib/json-test/lista-pacchetti.json").success(function (data) {
            $scope.listaPacchetti = data;
            for (var i = 0; i < $scope.listaPacchetti.length; i++) {
                $scope.listaPacchetti[i].dataInserimento = new Date($scope.listaPacchetti[i].dataInserimento);
                $scope.listaPacchetti[i].versioning = false;
            }
            $scope.isTableRendered = true;
        });
    };

    $scope.versiona = function (elm) {
        //qui faccio la post per inserire il versionamento del pacchetto
        console.log(elm);
    };

    $scope.getListaPacchetti();

});