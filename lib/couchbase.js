/*!
 * Module dependencies
 */
var couchbase = require('couchbase');
var Connector = require('loopback-connector').Connector;
var debug = require('debug')('loopback:connector:couchbase');
var util = require('util');
var async = require('async');




/**
 * Initialize the Couchbase connector for the given data source
 * @param {DataSource} dataSource The data source instance
 * @param {Function} [callback] The callback function
 */
exports.initialize = function initializeDataSource( dataSource, callback ) {
    if ( !couchbase ) {
        return;
    }
    dataSource.connector = new Couchbase( dataSource.settings, dataSource );
    if ( callback ) {
        dataSource.connector.connect( callback );
    }
};

/**
 * The constructor for Couchbase connector
 * @param {Object} config The config object
 * @constructor
 */
function Couchbase( config, dataSource ) {
    Connector.call( this, 'couchbase', config );

    this.debug = config.debug || debug.enabled;

    if ( this.debug ) {
        debug( 'Configuration: %j', config );
    }

    this.config = config;

}

util.inherits( Couchbase, Connector );

/**
 * Connect to Couchbase
 * @param {Function} [callback] The callback function
 *
 */
Couchbase.prototype.connect = function ( callback ) {
    var self = this;
    if ( self.db ) {
        process.nextTick( function () {
            callback && callback( null, self.db );
        } );
    } else {
        self.db = new couchbase.Connection( this.config, function () {
            console.error( 'Couchbase connection is failed: ' + self.config.url, err );
            callback && callback();
        } );

    }
};

/**
 * Create a new model instance
 * @param {Object} data to be inserted has a key and doc
 */
Couchbase.prototype.create = function ( data, callback ) {
	self.db.add(data.key, data.doc, function(err, result){
 		return callback(err, result);
	});
};

/**
 * Save a model instance
 */
Couchbase.prototype.save = function (  data, callback ) {
	self.db.add(data.key, data.doc, function(err, result){
		return callback(err, result);
	});
};

/**
 * Check if a model instance exists by id
 */
Couchbase.prototype.exists = function ( key, callback ) {
   self.db.get(key, function(err, result){
   		if(results.value.length > 0) {
   			return callback(err, true);
   		} else {
   			return callback(err, false);
   		}
 		
	});
};

/**
 * Find a model instance by id
 */
Couchbase.prototype.find = function find( key, callback ) {
	self.db.get(key, function(err, result){
 		return callback(err, result);
	});
};
/**
 * Update a model instance or create a new model instance if it doesn't exist
 */
Couchbase.prototype.updateOrCreate = function updateOrCreate( data, callback ) {
	self.db.set(data.key, data.doc, function(err, result){
		return callback(err, result);
	});
};

/**
 * Delete a model instance by id
 */
Couchbase.prototype.destroy = function destroy( model, id, callback ) {
    consolo.log('called')
};

/**
 * Query model instances by the filter
 */
Couchbase.prototype.all = function all( model, filter, callback ) {
    consolo.log('called')
};

/**
 * Delete all model instances
 */
Couchbase.prototype.destroyAll = function destroyAll( model, callback ) {
    consolo.log('called')
};

/**
 * Count the model instances by the where criteria
 */
Couchbase.prototype.count = function count( model, callback, where ) {
    consolo.log('called')
};

/**
 * Update the attributes for a model instance by id
 */
Couchbase.prototype.updateAttributes = function updateAttrs( model, id, data, callback ) {
    consolo.log('called')
};