'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Commerce = new Module('commerce');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Commerce.register(function(app, auth, database) {

  //We enable routing. By default the Package Object is passed to the routes
  Commerce.routes(app, auth, database);

  //We are adding a link to the main menu for all authenticated users
  Commerce.menus.add({
    title: 'Products',
    link: 'MEANcommerce list',
    roles: ['authenticated'],
    menu: 'main'  
  });

  Commerce.menus.add({
    title: 'Add New',
    link: 'newProduct',
    roles: ['authenticated'],
    menu: 'main'  
  });
  
  Commerce.aggregateAsset('css', 'commerce.css');

  Commerce.aggregateAsset('js', '../lib/ng-file-upload/ng-file-upload-shim.min.js');
  Commerce.aggregateAsset('js', '../lib/ng-file-upload/ng-file-upload-all.min.js');

  Commerce.aggregateAsset('js', '../lib/moment/moment.js');
  Commerce.aggregateAsset('js', '../lib/angular-moment/angular-moment.js');

  Commerce.angularDependencies(['ngFileUpload', 'angularMoment']);

  /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Commerce.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Commerce.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Commerce.settings(function(err, settings) {
        //you now have the settings object
    });
    */

  return Commerce;
});
