'use strict';

var hasAuthorization = function(req, res, next) {
  if (!req.user.isAdmin && !req.products.user._id.equals(req.user._id)) {
    return res.status(401).send('User is not authorized');
  }
  next();
};

var hasPermissions = function(req, res, next) {

    req.body.permissions = req.body.permissions || ['authenticated'];

    for (var i = 0; i < req.body.permissions.length; i++) {
      var permission = req.body.permissions[i];
      if (req.acl.user.allowed.indexOf(permission) === -1) {
            return res.status(401).send('User not allowed to assign ' + permission + ' permission.');
        };
    };

    next();
};

module.exports = function(Products, app, auth) {
  
  var multipart = require('connect-multiparty'), 
  multipartMiddleware = multipart(),
  products = require('../controllers/commerce')(Products);

  app.route('/api/product')
    .get(products.all)
    .post(auth.requiresLogin, hasPermissions, products.create);

  app.route('/api/product/:productId')
    .get(auth.isMongoId, products.show)
    .delete(auth.isMongoId, auth.requiresLogin, hasAuthorization, products.destroy);

  app.route('/api/productImg')
    .post(auth.requiresLogin, multipartMiddleware, products.imgUpload);

  app.route('/api/category')
    .get(products.allCats)
    .post(auth.requiresLogin, hasPermissions, products.createCat);

  app.route('/api/category/:categoryId') 
    .delete(auth.isMongoId, auth.requiresLogin, hasAuthorization, products.destroy_cat);

  app.param('categoryId', products.single_cat);
  app.param('productId', products.single);
};