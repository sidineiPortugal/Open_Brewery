var app = angular.module('linx_brewery', ['ngRoute']);

//Configurando as rotas da aplicação
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){

    $locationProvider.hashPrefix('');

    $routeProvider.when('/breweries',{
        templateUrl:"public/templates/home.html",
        controller:'app_controller'
    }).when('/breweries/:id',{
        templateUrl:"public/templates/detail.html",
        controller:'detail_Controller'
    }).otherwise({
        redirectTo:'/breweries'
    });
}]);

//Rotas externas da aplicação
app.service('breweryDB', ['$http', function($http){

    let breweries_url = 'https://api.openbrewerydb.org/breweries';

    let list_breweries = ((filters)=>{
        
        return $http.get(breweries_url+filters);
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
    $scope.by_types = [{
        value:'todos',
        background:'#00d1b2',
        color:'#fff'
    },
    {
        value:'micro',
        background:'#00d1b2',
        color:'#fff'
    },
    {
        value:'nano',
        background:'#00d1b2',
        color:'#fff'
    },
    {
        value:'regional',
        background:'#3273dc',
        color:'#fff'
    },
    {
        value:'brewpub',
        background:'#ffdd57',
        color:'black'
    },{
        value:'large',
        background:'#ffdd57',
        color:'black'
    },{
        value:'planning',
        background:'#3273dc',
        color:'#fff'
    },{
        value:'bar',
        background:'#3273dc',
        color:'#fff'
    },{
        value:'contract',
        background:'#ffdd57',
        color:'black'
    },{
        value:'proprietor',
        background:'#ffdd57',
        color:'black'
    },{
        value:'closed',
        background:'#ffdd57',
        color:'black'
    }];
    $scope.changePagination = function(page){
        if(page != $scope.param.page){
            $scope.param.page = page;
            $scope.list();
        }
    };
    $scope.breweries = [];
    $scope.typeValue = 'todos';
    $scope.param = {
        type: 'todos',
        page: 1
    };
    $scope.list = function(){

        let url_ = ('?page='+$scope.param.page) + ($scope.param.type != 'todos' ? '&by_type='+$scope.param.type : '');

        breweryDB.list_breweries(url_).then((response)=>{
            $scope.breweries = response.data
            console.log(response.data);
        })
    }, function(erros){ console.log(erros);};

    $scope.list();
}]);

app.controller('detail_Controller', ['$scope', '$routeParams', 'breweryDB', function($scope, $routeParams, breweryDB){
    console.log($routeParams.id);
    $scope.brewerie = {};
    $scope.show_detail = function(){
        breweryDB.detail_brewerie($routeParams.id).then((response)=>{
            $scope.brewerie = response.data;
            console.log(response.data);
        })
    }, function(erros){ console.log(erros);};

    $scope.show_detail();
}]);
