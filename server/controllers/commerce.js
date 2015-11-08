'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Product = mongoose.model('Product'),
    Category = mongoose.model('Category'),
    config = require('meanio').loadConfig(),
    _ = require('lodash'),
    fs = require('fs'),
    mkdirOrig = fs.mkdir,
    directory = config.root + '/files/public',
    osSep = '/';



function rename(file, dest, user, callback) {
    fs.rename(file.path, directory + dest + file.name, function(err) {
        if (err) throw err;
        else
            callback({
                success: true,
                file: {
                    src: '/files/public' + dest + file.name,
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    created: Date.now(),
                    createor: (user) ? {
                        id: user.id,
                        name: user.name
                    } : {}
                }
            });
    });
}

function mkdir_p(path, callback, position) {
    var parts = require('path').normalize(path).split(osSep);

    position = position || 0;

    if (position >= parts.length) {
        return callback();
    }

    var directory = parts.slice(0, position + 1).join(osSep) || osSep;
    fs.stat(directory, function(err) {
        if (err === null) {
            mkdir_p(path, callback, position + 1);
        } else {
            mkdirOrig(directory, function(err) {
                if (err && err.code !== 'EEXIST') {
                    return callback(err);
                } else {
                    mkdir_p(path, callback, position + 1);
                }
            });
        }
    });
}

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
         * Image Upload
         */
        imgUpload: function(req, res) { 
        var temp_dest = '/photos/';     
        var path = directory + temp_dest; 
            if (!fs.existsSync(path)) {
                mkdir_p(path, function(err) {
                    rename(req.files.file, temp_dest, req.user, function(data) {
                        res.jsonp(data);
                    });
                });
            } else {
                rename(req.files.file, temp_dest, req.user, function(data) {
                    res.jsonp(data);
                });
            }
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

            var query = req.acl.query('Product');

           query.find({}).sort('-created').populate('user', 'name username').exec(function(err, products) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot list the products'
                    });
                }
   
                res.json(products)
            });

        },
        /**
         * List all cats
         */
        allCats: function(req, res) { 

            var query = req.acl.query('Category');

           query.find({}).sort('-created').populate('user', 'name username').exec(function(err, category) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot list the category'
                    });
                }
   
                res.json(category)
            });

        },
         /**
         * Create a Category
         */
        createCat: function(req, res) { 
            var category = new Category(req.body);
            category.user = req.user;
           
            category.save(function(err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot save the category'
                    });
                }

                res.json(category);
            });

        },
         /**
         * Find cat by id
         */
        single_cat: function(req, res, next, id) {
            Category.load(id, function(err, categories) {
                if (err) return next(err);
                if (!categories) return next(new Error('Failed to load product ' + id));
                req.categories = categories;
                next();
            });
        },
        /**
         * Delete category
         */
        destroy_cat: function(req, res) {
            var cat = req.categories;

            cat.remove(function(err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot delete the Category'
                    });
                }

                res.json(cat);
            });
        }
    };
}