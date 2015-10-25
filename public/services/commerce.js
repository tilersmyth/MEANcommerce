'use strict';

angular.module('mean.commerce').factory('Product', ['$resource',
function($resource) {
    return $resource('api/product/:productId', {
      productId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);