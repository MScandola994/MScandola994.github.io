app.controller('contattiController', function ($scope, $state, $http) {
	
	$scope.form={};
	
	$scope.elencoContatti = [];
	$scope.filterContatti = '';
	$scope.editMode = false;
	$scope.colConfigElenco = ['name', 'surname', 'email', 'registered', 'category'];
	$scope.colConfigContatto = ['name', 'surname', 'birthday','email','phone','state','city','address','addressNumber','company','registered', 'category'];
	
	$scope.contatto = {};
	$scope.addressLong = '';
	$scope.columnName = 'index';
	var oldColumnName = 'index';
	$scope.reverseOrder = false;

	$scope.getElencoContatti = function () {
		$http.get("../extLib/json-test/elenco-utenti.json").success(function (data) {
			$scope.elencoContatti = data;
			for(var i=0;i<$scope.elencoContatti.length;i++){
				$scope.elencoContatti[i].registered = new Date($scope.elencoContatti[i].registered);
			}
		});
	};
	
	$scope.getSingoloContatto = function(id){
		$http.get("../extLib/json-test/elenco-utenti.json").success(function (data) {
			$scope.contatto = {};
			for(var i=0;i<data.length;i++){
				if(data[i]._id == id){
					$scope.contatto = data[i];
					$scope.contatto.registered = new Date($scope.contatto.registered);
					$scope.contatto.birthday = new Date($scope.contatto.birthday);
					break;
				}
			}
			if(!$scope.contatto._id){
				$state.go('contattiElenco');				
			}
		});
	};
	
	$scope.sortCol=function(colName){
		oldColumnName=$scope.columnName;
		$scope.columnName=colName;
		$scope.reverseOrder = (oldColumnName == $scope.columnName) ? !$scope.reverseOrder : false;
	};
	
	if (!$state.params.idContatto) {
		$scope.getElencoContatti();
	}
	else{
		$scope.getSingoloContatto($state.params.idContatto)
	}
	
	$scope.openEdit = function(){
		$scope.editMode = true;
		$scope.form = angular.extend({},$scope.contatto);
	};
	
	$scope.modContatto=function(){
		$scope.contatto = angular.extend({},$scope.form);
		$scope.editMode = false;
	};
	
});