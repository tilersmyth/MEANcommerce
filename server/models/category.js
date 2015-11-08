'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Category Schema
 */
var categorySchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  cat_name: {
    type: String,
    required: true,
    trim: true
  },
  cat_slug: {
    type: String,
    required: true,
    trim: true
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
 * Statics
 */
categorySchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).populate('user', 'name username').exec(cb);
};

mongoose.model('Category', categorySchema);
