var couchbase = require('couchbase');
//var SqlConnector = require('loopback-connector').SqlConnector;
var Connector = require('loopback-connector').Connector;
var async = require('async');
var debug = require('debug')('loopback:connector:couchbase');
var dataBuilderClass = require("./dataBuilder");
var constants = require('./base/constants.js');
var uuid = require('node-uuid');
var debug = require('debug')('connector:couchbase');
var extend = require('node.extend');

/**
 * @module loopback-connector-couchbase
 *
 * Initialize the Couchbase connector against the given data source
 *
 * @param {DataSource} dataSource The loopback-datasource-juggler dataSource
 * @param {Function} [callback] The callback function
 */
exports.initialize = function initializeDataSource(dataSource, callback) {
	//debug("couchbase connector initializeDataSource()");
	if (!couchbase) {
		debug("couchbase connector initializeDataSource(): Error happened, No couchbase module avaialbe");
		return;
	}
	var s = dataSource.settings;

	var options = {
		dsconnector: s.connector,
		host: s.host || 'localhost',
		port: s.port || 8091,
		password : s.password || '',
		bucket: s.database || 'default',
		env: s.env || 'debugging',
		connectionTimeout: s.connectionTimeout || 20000,
		operationTimeout: s.operationTimeout || 15000,
		mappings: s.mappings,
		views: s.views
	};
	options.connectUrl = "couchbase://" + options.host;  //do not attach any port number such as 8901, will cause error code 24 which means "Error while establishing TCP connection"

	debug("couchbase connector initializeDataSource(): options:" + JSON.stringify([options]));
	//initializes the Couchbase connector:
	dataSource.connector = new CouchbaseDB(options, dataSource);

	//connect to couchbase db
	if (callback) {
		dataSource.connector.connect(callback);
	}
};

/**
 * @constructor
 * Constructor for Couchbase connector
 * @param {Object} client The node-mysql? client object
 */
function CouchbaseDB(settings, dataSource) {

  this.name = 'couchbase';
  this._models = {};
  this.settings = settings;
  this.dataSource = dataSource;
  Connector.call(this, 'couchbase', settings);
}

require('util').inherits(CouchbaseDB, Connector);
exports.CouchbaseDB = CouchbaseDB;


/*
	**************************start implementing the interface methods*****************************************
*/

CouchbaseDB.prototype.connect = function (callback) {
  var self = this;
  if (self.db) {
	process.nextTick(function () {
		callback && callback(null, self.db);
	});
  } else {
	self.myCluster = new couchbase.Cluster(self.settings.connectUrl);
  self.viewQuery = couchbase.ViewQuery;
	callback && callback(null, self.db);
  }
};



/**
 * Does the view query to the couchbase server and return the result
 *
 * @param {String} query The ViewQuery object
 * @param {Object} selfThis The reference to the "this" of this module
 * @param {Function} [callback] The callback function
 */
var cbqueryView = function (query, selfThis, callback) {
  var self = selfThis;

  var myBucket = self.myCluster.openBucket(self.settings.bucket, self.settings.password ,function(err){
    if(err){
      callback(err,null);
      return;
    }

    debug("cbqueryView()  : query is:  " + JSON.stringify([query]) );

    myBucket.query(query, function(err, res) {
      if (err) {
        debug("cbqueryView()  : query failed" + JSON.stringify([err, res]));
        callback(err,null);
        return;
      }
      debug("cbqueryView()  : view success!" + JSON.stringify([err, res]));

      var returnData = [];

      // If the result is empty we have nothing to query and can simply return
      if (res.length == 0) {
        debug("cbqueryView()  : success!" + JSON.stringify([err, returnData]));
        callback(err, returnData);
        return;
      }

      // Get all the ids of the documents we found
      var ids = res.map(function(document) {return document.id});

      // Query all the documents at once
      myBucket.getMulti(ids,function(err, result) {
        if(err){
          callback(err, null);
          return;
        }


        // It returns an object but loopback wants an array. So convert it and also use the chance to add the cas-value
        for (var id in result) {
          var documentData = result[id];
          documentData.value._cas = documentData.cas;
          returnData.push(documentData.value);
        }

        debug("cbqueryView()  : success!" + JSON.stringify([err, result]));
        callback(err, returnData);
        return;
      });
    });
  });
};


/**
 * Find matching model instances by the filter
 *
 * @param {String} model The model name
 * @param {Object} filter The filter
 * @param {Function} [callback] The callback function
 */
/**
 * Count the model instances by the where criteria
 */
CouchbaseDB.prototype.count = function (model, callback, where) {
  debug("CouchbaseDB.prototype.count() : " + JSON.stringify([model, where]));
  throw "Count is not implemented!";
};

/**
 * Find a model instance by id
 */
CouchbaseDB.prototype.find = function find(model, id, callback) {
	var self = this;
	debug("CouchbaseDB.prototype.find() : " + JSON.stringify([model, id]));

	var myBucket = self.myCluster.openBucket(self.settings.bucket, self.settings.password, function(err){
		if(err){
			callback(err,null);
			return;
		}

		myBucket.get(id,function(err, result) {
			if(err){
				// Error code 13 is "The key does not exist on the server". Because Loopback does not treat that as an error
				// we will neither to be consistent.
				if (err.code == 13) {
					callback(null, null);
					return;
				} else {
					callback(err, null);
					return;
				}
			}
			debug("CouchbaseDB.prototype.find()  : find result is:  "  + JSON.stringify([err, result]) );

      var returnData = result.value;
      returnData._cas = result.cas;
      callback(err,result.value);
      return;
		});
	});
};



/**
 * Create a new model instance
 * Will be called when  POST to /model_url_name
 */
CouchbaseDB.prototype.create = function (model, data, callback) {


	var self = this;
	debug("CouchbaseDB.prototype.create() : " + JSON.stringify([model, data]));

	var createDataBuilderObj = prepareCreateData(data, model);


	var myBucket = self.myCluster.openBucket(self.settings.bucket, self.settings.password, function(err){
		if(err){
			callback(err,null);
			return;
		}

		myBucket.insert(createDataBuilderObj.getIdKey(),createDataBuilderObj.getPreparedData(),function(err, result) {
			if(err){
				callback(err,null);
				return;
			}

			// Deactivated for now because the value which gets returned gets set as the id. Impossible to set other ones.
			// So we also just return the id like the connector expects.
			//result = createDataBuilderObj.setImplicitFieldsInResult(data,result);
			//debug("CouchbaseDB.prototype.create()  : added id/doctype,now result is:  "  + JSON.stringify([result]) );

			debug("CouchbaseDB.prototype.create()  : created document:  "  + JSON.stringify([result]) );

			callback(err,result && result.id);

		});
	});
};

/**
 * Save a model instance
 */
CouchbaseDB.prototype.save = function (model, data, callback) {
	var self = this;
	debug("CouchbaseDB.prototype.save() : " + JSON.stringify([model, data]));

	var myBucket = self.myCluster.openBucket(self.settings.bucket, self.settings.password ,function(err){
		if(err){
			callback(err,null);
			return;
		}
		updateOneDoc(myBucket,undefined,model,data,callback);
	});
};

/**
 * Check if a model instance exists by id
 */
CouchbaseDB.prototype.exists = function (model, id, callback) {
	var self = this;
	debug("CouchbaseDB.prototype.exists() : " + JSON.stringify([model, id]));

	var myBucket = self.myCluster.openBucket(self.settings.bucket, self.settings.password ,function(err){
		if(err){
			callback(err,null);
			return;
		}

		myBucket.get(id,function(err, result) {
			if(err){
				debug("CouchbaseDB.prototype.find()  : find exists is:  "  + JSON.stringify([err, result]) );
				if(err.code && err.code ==13){
						callback(null,false);
						return;
				}
				callback(err,null);
				return;
			}
			debug("CouchbaseDB.prototype.find()  : find result is:  "  + JSON.stringify([err, result]) );
			callback(err,true);
			return;
		});

	});

};

/**
 * Update a model instance or create a new model instance if it doesn't exist
 */
CouchbaseDB.prototype.updateOrCreate = function updateOrCreate(model, data, callback) {
	debug("CouchbaseDB.prototype.updateOrCreate() : " + JSON.stringify([model, data]));

	var self = this;
	var createDataBuilderObj = prepareCreateData(data, model);

	var myBucket = self.myCluster.openBucket(self.settings.bucket, self.settings.password, function(err){
		if(err){
			callback(err,null);
			return;
		}
		updateOneDoc(myBucket,createDataBuilderObj.getIdKey(),model,createDataBuilderObj.getPreparedData(),callback);
	});
};


/*
	Calls CreateDataBuilder to prepared the inbound data that is to be inserted
*/
var prepareCreateData = function(inboundData, model){
	var dataBuilderIndex = new dataBuilderClass();

	var createDataBuilderObj = dataBuilderIndex.getCreateDataBuilder(inboundData,model);
	createDataBuilderObj.buildData();

	return createDataBuilderObj;
};

/**
 * Delete a model instance by id
 */
CouchbaseDB.prototype.destroy = function destroy(model, id, callback) {
	var self = this;
	debug("CouchbaseDB.prototype.destroy() : " + JSON.stringify([model, id]));

	var myBucket = self.myCluster.openBucket(self.settings.bucket, self.settings.password, function(err){
		if(err){
			callback(err,null);
			return;
		}

		myBucket.remove(id,function(err, result) {
			if(err){
				callback(err,null);
				return;
			}
			debug("CouchbaseDB.prototype.destroy()  : removal result is:  "  + JSON.stringify([err, result]) );
			callback(err,result);
			return;

		});

	});
};

/**
 * Query model instances by the filter
 */
CouchbaseDB.prototype.all = function all(model, filter, callback) {
	debug("CouchbaseDB.prototype.all() : " + JSON.stringify([model, filter]));

	var self = this;

  var mappings = self.settings.mappings;
  var views = self.settings.views;
  var keys = Object.keys(filter.where);


  var documentId = undefined;
	if (filter.where && filter.where.id) {
    // If the "where" has an id set, the rest is not really interesting anymore because it can be just
    // one document that matches and that is the one we return

    documentId = filter.where.id;
	} else if (keys.length == 1 && mappings.hasOwnProperty(model) && mappings[model].hasOwnProperty(keys[0])) {
    var prefix = mappings[model][keys[0]];
    var documentId = prefix + filter.where[keys[0]];
  }

  if (documentId) {
    // If we were able to get the documentId we can simply do a loopup now

    // Get the document and return it
    self.find(model, documentId, function (err, res) {
      // Result has to be an
      if (res) {
        callback(err, [res])
      } else {
        callback(err, null)
      }
    });

    return;
  }

  // Check if we can do the query
  if (keys.length == 1 && views.hasOwnProperty(model) && views[model].hasOwnProperty(keys[0])) {
    // Only if we are looking for exactly one key and there is a view defined for it we can look it up

    // Get the name of the view and design-document which we can use to query the data
    var viewName = views[model][keys[0]].viewName;
    var designDocument = views[model][keys[0]].designDocument;

    // Get the we are looking for
    var keyValue = filter.where[keys[0]];

    // Build now the query with the given data
    var query = self.viewQuery.from(designDocument, viewName).key(keyValue);
    if (filter.limit) {
      query.limit(filter.limit);
    }
    if (filter.skip) {
      query.skip(filter.skip);
    }

    // Now run the query and return the data
    cbqueryView(query, self, callback);
  } else {
    // If there are more keys or if we do not have a view we stop (so that it is quite apparent in the development phase)
    throw "This query is currently not supported: " + JSON.stringify(filter);
  }
};

/**
 * Delete all model instances
 */
CouchbaseDB.prototype.destroyAll = function destroyAll(model, callback) {
	debug("CouchbaseDB.prototype.destroyAll() : " + JSON.stringify([model]));
	throw "stop here !";
};

/**
 * Update the attributes for a model instance by id
 * Will be called when  PUT to /model_url_name/{id}
 */
CouchbaseDB.prototype.updateAttributes = function updateAttrs(model, id, data, callback) {

	var self = this;
	debug("CouchbaseDB.prototype.updateAttributes() : " + JSON.stringify([model, id, data]));
	var idkey = id;
	var myBucket = self.myCluster.openBucket(self.settings.bucket, self.settings.password, function(err){
		if(err){
			callback(err,null);
			return;
		}
		updateOneDoc(myBucket,idkey,model,data,callback);
	});
};

/**
	Updates one document, do not replace the fields that are preserved
*/
var updateOneDoc = function(myBucket,idkey,model,inboundData,callback){
	idkey = idkey || inboundData.id;

	// Copy the data so that we do not change any outside values
	var preparedData = extend({}, inboundData);

	// Make sure that id and document-type get preserved so simply set them
	preparedData.id = idkey;
	preparedData.docType = model;

	// This gets later used to set the cas
	var options = {};

  // Check if we got a cas value. If add it to the options and remove from the data we save
  // To make it ignore the cas value it can simply be set to {}. It will then update no matter what the cas in the database is.
  if (preparedData.hasOwnProperty("_cas") ) {
    options.cas = preparedData._cas;
    delete preparedData._cas;
  }

  // Now actually update it
	myBucket.upsert(idkey, preparedData, options, function(err, result) {
		if(err){
			callback(err,null);
			return;
		}
		debug("    CouchbaseDB   updateOneDoc()  : updateAttributes result is:  "  + JSON.stringify([err, result]) );
		callback(err,result);
	});
};

/**
 * Escape the name for the underlying database
 * @param {String} name The name
 */
CouchbaseDB.prototype.escapeName = function (name) {
	var self = this;
	debug("CouchbaseDB.prototype.escapeName() : " + JSON.stringify([name]));
  return name;
};

CouchbaseDB.prototype.toDatabase = function (prop, val, forCreate) {
	var self = this;
	debug("CouchbaseDB.prototype.toDatabase() : " + JSON.stringify([prop, val, forCreate]));
};

CouchbaseDB.prototype.toFields = function (model, data) {
	debug("CouchbaseDB.prototype.toFields() model, data: " + JSON.stringify([model, data]));
	var self = this;
	var fields = [];
	var props = this._models[model].properties;
	debug("CouchbaseDB.prototype.toFields() props: " + JSON.stringify([props]));
};


CouchbaseDB.prototype.query = function (sql, callback) {
	debug("CouchbaseDB.prototype.query() model, query: " + JSON.stringify([sql]));
	var self = this;

	callback(null,null);
};
