var app = angular.module('linx_brewery', ['ngRoute']);

app.config(['$routeProvider', (($routeProvider)=>{
    $routeProvider.when('/',{
        template:"<h1>Sidinei</h1>"
    }).otherwise({
        redirectTo:'/notfound',
        template:"<h1>Pagina não encontrada</h1>"
    });
})]);