'use strinct';
var app = angular.module('demoApp', ['ngRoute']);
app.factory("services", ['$http', function($http) {
  var serviceBase = 'services/'
    var obj = {};
    obj.getall = function(){
        return $http.get(serviceBase + 'get_all');
    }
    obj.getone = function(customerID){
        return $http.get(serviceBase + 'get_one?id=' + customerID);
    }

    obj.insertTodo = function (customer) {
    return $http.post(serviceBase + 'insertTodo', customer).then(function (results) {
        return results;
    });
    };

    obj.updateTodo = function (id,customer) {
        return $http.post(serviceBase + 'updateTodo', {id:id, customer:customer}).then(function (status) {
            return status.data;
        });
    };

    obj.deleteTodo = function (id) {
        return $http.delete(serviceBase + 'deleteTodo?id=' + id).then(function (status) {
            return status.data;
        });
    };

    return obj;   
}]);


//todoList.controller('todoCtrl', ['$scope', function ($scope) {

app.controller('todoCtrl', function ($scope, services) {
    services.getall().then(function(data){
        $scope.todosdb = data.data;
    });
     $scope.deleteTodo = function(todo) {
      //alert('delete');
        //$location.path('/');
       // confirm("Are you sure to delete customer number");
       // if(confirm("Are you sure to delete customer number: "+todo.numero)==true)
        services.deleteTodo(todo.numero);
        services.getall().then(function(data){
        $scope.todosdb = data.data;
    });
      };

  $scope.addTodo = function(todo) {
    //alert('inseert');
            // .trim() permet de supprimer les espaces inutiles
            // en début et fin d'une chaîne de caractères
           var newdesc = todo.description.trim();
            if (!newdesc.length) {
                // éviter les todos vides;
                return;
            }
            
            services.insertTodo(todo);

            services.getall().then(function(data){
        $scope.todosdb = data.data;
    });
           // $scope.todosdb = $scope.todosdb;
           // loadData();
           // $scope.id = '';
          //   document.getElementById('new-todo').value = "";
             // Réinitialisation de la variable newTodo
            //$scope.newdesc = '';
};


   $scope.markAll = function (completed) {
            all=completed;
        };

        // Enlever tous les todos cochés
        $scope.clearCompletedTodos = function () {
          alert(all);

        if(all==true) {

          //services.getall().then(function(data){
         // $scope.todosdb = data.data;
    
          angular.forEach($scope.todosdb, function(value, key) {
          services.deleteTodo(value.numero);
           });  

         }  
        // });          

           /* $scope.todosdb = todos = todos.filter(function (todo) {
                return !todo.completed;
            });*/
};

$scope.loadData = function() {
 // alert('load');
services.getall().then(function(data){
        $scope.todosdb = data.data;
    });
}  

});

app.controller('editCtrl', function ($scope, $rootScope, $location, $routeParams, services, customer) {
    var customerID = ($routeParams.customerID) ? parseInt($routeParams.customerID) : 0;  
      var original = customer.data;
      original._id = customerID;
      $scope.customer = angular.copy(original);
      $scope.customer._id = customerID;

      $scope.isClean = function() {
        return angular.equals(original, $scope.customer);
      }

      $scope.deleteTodo = function(customer) {
        $location.path('/');
        //if(confirm("Are you sure to delete customer number: "+$scope.customer._id)==true)
        services.deleteTodo(customer.customerID);
       window.location.reload();
      };

      $scope.saveCustomer = function(customer) {
        $location.path('/');
        if (customerID <= 0) {
            services.insertCustomer(customer);
        }
        else {
            services.updateCustomer(customerID, customer);
        }
    };
});

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', { 
        title: 'getall',
        templateUrl: 'todos.html',
        controller: 'todoCtrl'
      })
      .when('/edit-customer/:customerID', {
        title: 'Edit Customers',
        templateUrl: 'partials/edit-customer.html',
        controller: 'editCtrl',
        resolve: {
          customer: function(services, $route){
            var customerID = $route.current.params.customerID;
            return services.getone(customerID);
          }
        }
      })
      .otherwise({
        redirectTo: '/'
      });
}]);
app.run(['$location', '$rootScope', function($location, $rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
    });
}]);









