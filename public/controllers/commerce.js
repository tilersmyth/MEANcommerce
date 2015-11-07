'use strict';

/* jshint -W098 */
angular.module('mean.commerce')
.controller('ProductListController', ['$scope', 'Global', 'Product', '$location',
  function($scope, Global, Product, $location) {
    $scope.global = Global;
    $scope.package = {
      name: 'commerce'
    };

    $scope.find = function() {
      Product.query(function(products) {
        $scope.products = products; 
      });
    };

    $scope.getProduct = function() {
        $location.path('/auth/products/'+this.product._id);
    };

    $scope.remove = function(product, $event) {
        $event.stopPropagation();

        if (product) {
        product.$remove(function(response) {
            for (var i in $scope.products) {
              if ($scope.products[i] === product) {
                $scope.products.splice(i, 1);
              }
            }
          });
        } else {
        $scope.product.$remove(function(response) {
        });
        }
    };

    $scope.checkAll = function() {
      if($scope.master)
        $scope.select.products = $scope.products.map(function(item) { return item._id; });
      else
        $scope.select.products = [];
    };

    $scope.select = {
      products: []
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

    $scope.uploadFiles = function(file, errFiles){ 
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        if (file){
          Upload.upload({
          url: '/api/productImg', 
          method: 'POST', 
          headers: {'Content-Type': 'multipart/form-data'},
          data: {file: file}              
          }).success(function (response, status) {
            $scope.products.mainPic = response.file.src;
          }).error(function (err) {
                  
          });
        }
    }

  
    $scope.create = function(isValid) {
      if (isValid) {  
        var products = new Product($scope.products); 
        products.$save(function(response) {
            console.log(response);
        });

        $scope.products = {};

      } else {
        $scope.submitted = true;
      }

    };


    $scope.products.stock = 'In Stock';
    $scope.setAction = function(action) { 

      $scope.products.stock = action == 'In Stock' ? 'Out of Stock' : 'In Stock';

    };


  }
])
.controller('ProductSingleController', ['$scope', 'Global', 'Product', '$stateParams',
  function($scope, Global, Product, $stateParams) {
    $scope.global = Global;

    
    $scope.findOne = function() {
      Product.get({
        productId: $stateParams.productId
      }, function(product) {
          
      });
    };
  }
]);
