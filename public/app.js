var app = angular.module('linx_brewery', ['ngRoute']);

//Configurando as rotas da aplicação
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){

    // Trata a hashbang
    $locationProvider.hashPrefix('');
    //Controle das rotas principais e defaul
    $routeProvider.when('/breweries',{
        templateUrl:"public/templates/home.html",
        controller:'home_controller'
    }).when('/breweries/:id',{
        templateUrl:"public/templates/detail.html",
        controller:'detail_Controller'
    }).otherwise({
        redirectTo:'/breweries'
    });
}]);

//Rotas externas da aplicação
app.service('breweryDB', ['$http', function($http){
    //URL base da API
    let breweries_url = 'https://api.openbrewerydb.org/breweries';
    // Função base para trazer a lista
    let list_breweries = ((filters)=>{
        return $http.get(breweries_url+filters);
    });
    //Recupera os detalhes de um card especifico conforme o seu id
    let detail_brewerie = ((id)=>{
        return $http.get(breweries_url + '/' + id);
    });
    return {
        list_breweries: list_breweries,
        detail_brewerie: detail_brewerie
    };
    
}]);

//Controllers
app.controller('home_controller', ['$scope', 'breweryDB' , function($scope, breweryDB){
    //Lista de filtros possiveis, por type's
    $scope.by_types = [{
        value:'todos'
    },
    {
        value:'micro'
    },
    {
        value:'nano'
    },
    {
        value:'regional'
    },
    {
        value:'brewpub'
    },{
        value:'large'
    },{
        value:'planning'
    },{
        value:'bar'
    },{
        value:'contract'
    },{
        value:'proprietor'
    },{
        value:'closed'
    }];
    //Variaveis para controle da pagina
    $scope.breweries = [];
    $scope.typeValue = 'todos';
    $scope.param = {
        type: 'todos',
        page: 1
    };
    //Lista os cards fazendo tratamento de filtro e paginação
    $scope.list = function(){
        //Valida se existe paginação ou filtro
        let url_ = ('?page='+$scope.param.page) + ($scope.param.type != 'todos' ? '&by_type='+$scope.param.type : '');
        //Realiza a requisição dos dados
        breweryDB.list_breweries(url_).then((response)=>{
            $scope.breweries = response.data
        })
    }, function(erros){ console.log(erros);};
    //Inicia a chamada de dados na pagina
    $scope.list();
    //Altera o index da paginação recuperando novos dados 
    $scope.changePagination = function(page){
        if(page != $scope.param.page){
            $scope.param.page = page;
            $scope.list();
        }
    };
}]);
//Controler responsavel pela pagina de detalhes
app.controller('detail_Controller', ['$scope', '$routeParams', 'breweryDB', function($scope, $routeParams, breweryDB){
    // Variaveis para controle da pagina
    $scope.brewerie = {};
    //Envia o id da rota para requisção recuperar os dados especificos do card
    $scope.show_detail = function(){
        breweryDB.detail_brewerie($routeParams.id).then((response)=>{
            $scope.brewerie = response.data;
        })
    }, function(erros){ console.log(erros);};
    //Inicia a chamada de dados na pagina
    $scope.show_detail();
}]);
