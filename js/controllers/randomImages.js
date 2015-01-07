app.controller('randomImagesController', function ($scope, $state, $http) {

    function shuffle(o) { //v1.0
        for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    };

    function randomString(length, chars) {
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
        return result;
    }
    var charsList = ' 0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

    $scope.imagesList = [];
    $scope.categories = ['business', 'sports', 'city', 'food', 'abstract', 'animals', 'transport', 'technics', 'nature'];
    var catTmp = $scope.categories;
    $scope.mode = "grid" //grid || list

    $scope.refreshImages = function () {
        $scope.imagesList = [];
        catTmp = shuffle(catTmp);
        for (var i = 0; i < 9; i++) {
            $scope.imagesList[i] = {
                title: randomString(Math.floor(Math.random() * 10) + 5, charsList),
                source: 'http://lorempixel.com/960/480/' + catTmp[i] + '/'+i,
                sourceBig:'http://lorempixel.com/1440/720/' + catTmp[i] + '/'+i,
                descr: randomString(Math.floor(Math.random() * 10) + 5, charsList) + ' ' + randomString(Math.floor(Math.random() * 10) + 5, charsList) + ' ' + randomString(Math.floor(Math.random() * 10) + 5, charsList) + ' ' + randomString(Math.floor(Math.random() * 10) + 5, charsList) + ' ',
            }
        }
    };
    
    $scope.selectedFile={};
    $scope.showDet=function(file){
        $scope.selectedFile=file;
        $('#trigger-modal').click();
    };

    $scope.refreshImages();
    
    

});