'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Article Schema
 */
var ProductSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  product_title: {
    type: String,
    required: true,
    trim: true
  },
  product_content: {
    type: String,
    required: true,
    trim: true
  },
  product_price: {
    type: String,
    required: true,
    trim: true
  },
  product_sku: {
    type: String,
    trim: true
  },
  stock: {
    type: String,
    trim: true
  },  
  mainPic: {
    type: String,
    default: ''
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  permissions: {
    type: Array
  },
  updated: {
    type: Array
  }
});

/**
 * Validations
 */
ProductSchema.path('product_title').validate(function(product_title) {
  return !!product_title;
}, 'Title cannot be blank');

ProductSchema.path('product_content').validate(function(product_content) {
  return !!product_content;
}, 'Content cannot be blank');

/**
 * Statics
 */
ProductSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).populate('user', 'name username').exec(cb);
};

mongoose.model('Product', ProductSchema);
