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
        single: function(req, res, next, id) {
            Product.load(id, function(err, products) {
                if (err) return next(err);
                if (!products) return next(new Error('Failed to load product ' + id));
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
        },
        /**
         * Delete a Product
         */
        destroy: function(req, res) {
            var product = req.products;

            product.remove(function(err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot delete the product'
                    });
                }

                Products.events.publish({
                    action: 'deleted',
                    user: {
                        name: req.user.name
                    },
                    name: product.title
                });

                res.json(product);
            });
        },
        /**
         * Show a Product
         */
        show: function(req, res) {

            res.json(req.products);
        },
         /**
         * List of Products
         */
        all: function(req, res) {

           Product.find().sort('-created').populate('user', 'name username').exec(function(err, products) {
                if (err) {
                    res.render('error', {
                        status: 500
                    });
                } else {
                    res.jsonp(products);
                }
            });

        }
    };
}