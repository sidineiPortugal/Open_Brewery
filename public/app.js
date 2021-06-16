var app = angular.module('linx_brewery', ['ngRoute']);

//Configurando as rotas da aplicação
app.config(['$routeProvider', (($routeProvider)=>{
    $routeProvider.when('/',{
        templateUrl:"public/templates/home.html",
        controller:'app_controller'
    }).otherwise({
        redirectTo:'/notfound',
        templateUrl:"public/templates/detail.html"
    });
})]);

//Rotas externas da aplicação
app.service('breweryDB', ['$http', function($http){

    let breweries_url = 'https://api.openbrewerydb.org/breweries';

    let list_breweries = (()=>{
        return $http.get(breweries_url);
    });
    let detail_brewerie = ((id)=>{
        return $http.get(breweries_url + '/' + id);
    });
    return {
        list_breweries: list_breweries,
        detail_brewerie: detail_brewerie
    };
    
}]);

//Controllers
app.controller('app_controller', ['$scope', 'breweryDB' , function($scope, breweryDB){
    $scope.breweries = [];
    $scope.list = function(){
        breweryDB.list_breweries().then((response)=>{
            $scope.breweries = response.data
            console.log(response.data);
        })
    }, function(erros){ console.log(erros);};

    $scope.list();
}]);
