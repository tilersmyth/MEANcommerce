'use strict';

angular.module('mean.commerce').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('MEANcommerce list', {
      url: '/auth/products',
      templateUrl: 'commerce/views/product-view.html',
      resolve: {
          loggedin: function(MeanUser) {
            return MeanUser.checkLoggedin();
          }
        }
    })
    .state('newProduct', {
        url: '/auth/products/new',
        templateUrl: 'commerce/views/product-new.html',
        resolve: {
          loggedin: function(MeanUser) {
            return MeanUser.checkLoggedin();
          }
        }
      })
    .state("newProduct.general", { url: "/", templateUrl: "commerce/views/product-tabs/general.html" })
    .state("newProduct.data", { url: "/", templateUrl: "commerce/views/product-tabs/data.html" })
    .state("newProduct.image", { url: "/", templateUrl: "commerce/views/product-tabs/image.html" })
    .state("newProduct.discount", { url: "/", templateUrl: "commerce/views/product-tabs/discount.html" })
    ;
  }
]);
