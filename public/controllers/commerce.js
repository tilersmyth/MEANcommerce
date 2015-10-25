'use strict';

/* jshint -W098 */
angular.module('mean.commerce').controller('ProductListController', ['$scope', 'Global', 'Product', 
  function($scope, Global, Product) {
    $scope.global = Global;
    $scope.package = {
      name: 'commerce'
    };
  }
])
.controller('ProductNewController', ['$scope', 'Global', 'Product','$state', 'Upload',
  function($scope, Global, Product, $state, Upload) {
    $scope.global = Global;


    $scope.tabs = [
      { title:'General',  route:'general' },
      { title:'Data', route:'data'},
      { title:'Image', route:'image'},
      { title:'Discounts', route:'discount'}
    ];

    $scope.products = {};

    $scope.go = function(route){
        $state.go('newProduct.'+route);
    };
 

    $scope.create = function(isValid) { 
      if (isValid) {

        var products = new Product($scope.products);

        products.$save(function(response) {
          
            console.log(response)

        });

        $scope.products = {};

      } else {
        $scope.submitted = true;
      }
    };

  }
]);
