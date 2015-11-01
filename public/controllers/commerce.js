'use strict';

/* jshint -W098 */
angular.module('mean.commerce').controller('ProductListController', ['$scope', 'Global', 'Product', 
  function($scope, Global, Product) {
    $scope.global = Global;
    $scope.package = {
      name: 'commerce'
    };

    
    $scope.find = function() {
      Product.query(function(products) {
        $scope.products = products;
          
      });
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

        // if ($scope.products.picFile)
        // $scope.upload($scope.products.picFile);

        var products = new Product($scope.products);

        products.$save(function(response) {
          
        

        });

        $scope.products = {};

      } else {
        $scope.submitted = true;
      }
    };

    // $scope.upload = function (file) {

    //     file.upload = Upload.upload({
    //       url: 'commerce/assets/upload',
    //       data: {file: file},
    //     });


    //     file.upload.then(function (response) {
    //       $timeout(function () {
    //         file.result = response.data;
    //       });
    //     }, function (response) {
    //       if (response.status > 0)
    //         $scope.errorMsg = response.status + ': ' + response.data;
    //     }, function (evt) {
    //       // Math.min is to fix IE which reports 200% sometimes
    //       file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
    //     });
    // }

  }
])
.controller('ProductSingleController', ['$scope', 'Global', 'Product', '$stateParams',
  function($scope, Global, Product, $stateParams) {
    $scope.global = Global;

    
    $scope.findOne = function() {
      Product.get({
        productId: $stateParams.productId
      }, function(product) {
          console.log(product);
      });
    };
  }
]);
