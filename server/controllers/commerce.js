'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Product = mongoose.model('Product'),
    config = require('meanio').loadConfig(),
    _ = require('lodash');

module.exports = function(Products) {

    return {
        /**
         * Find product by id
         */
        article: function(req, res, next, id) {
            Product.load(id, function(err, products) {
                if (err) return next(err);
                if (!article) return next(new Error('Failed to load article ' + id));
                req.products = products;
                next();
            });
        },
        /**
         * Create Product
         */
        create: function(req, res) {
            var products = new Product(req.body);
            products.user = req.user;
            
            products.save(function(err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot save the product'
                    });
                }

                Products.events.publish({
                    action: 'created',
                    user: {
                        name: req.user.name
                    },
                    url: config.hostname + '/products/' + products._id,
                    name: products.title
                });

                res.json(products);
            });
        }
    };
}