var couchbase = require('couchbase');
var N1qlQuery = couchbase.N1qlQuery;
//var SqlConnector = require('loopback-connector').SqlConnector;
var Connector = require('loopback-connector').Connector;
var async = require('async');
var debug = require('debug')('loopback:connector:couchbase');
var clauseBuilderClass = require("./clauseBuilder");
var dataBuilderClass = require("./dataBuilder");
var constants = require('./base/constants.js');
var uuid = require('node-uuid');
var debug = require('debug')('connector:couchbase');
var _ = require('underscore');

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
    n1qlport: s.n1qlport || 8093,
    bucket: s.database || 'default',
    env: s.env || 'debugging',
    connectionTimeout: s.connectionTimeout || 20000,
    operationTimeout: s.operationTimeout || 15000
  };
  options.connectUrl = "couchbase://" + options.host;  //do not attach any port number such as 8901, will cause error code 24 which means "Error while establishing TCP connection"
  options.n1qlUrl = options.host + ":" + options.n1qlport;

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
    self.myBucket = self.myCluster.openBucket(self.settings.bucket, function(err){
      callback && callback(null, self.db);
    });
  }
};

/**
 * Does the common query to the couchbase server and return the result
 *
 * @param {String} sql The SQL string which follows the N1QL syntax
 * @param {Object} selfThis The reference to the "this" of this module
 * @param {Function} [callback] The callback function
 */
var cbquery = function (sql,selfThis, callback) {
  var self = selfThis;
  var myBucket = self.getBucket(function(err){
    //var myBucket = self.myCluster.openBucket(self.settings.bucket,function(err){
    if(err){
      callback(err,null);
      return;
    }

    myBucket.enableN1ql([self.settings.n1qlUrl]);

    var query = N1qlQuery.fromString(sql);
    debug("cbquery()  : query is:  " + JSON.stringify([query]) );

    myBucket.query(query, function(err, res) {
      if (err) {
        debug("cbquery()  : query failed" + JSON.stringify([err, res]));
        callback(err,null);
        return;
      }
      debug("cbquery()  : success!" + JSON.stringify([err, res]));
      callback(err,res);
      return;
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

  var self = this;

  var clauseBuilderIndex = new clauseBuilderClass();

  var clausebuilderObj = clauseBuilderIndex.getClauseBuilder(where,self.settings.bucket,model);
  var clause = clausebuilderObj.buildClause('SELECT  count(*) AS cnt FROM ');



  qryString = clause;

  cbquery(qryString,self,function(err,res){
    if(err){
      callback(err,null);
      return;
    }
    var c = (res && res[0] && res[0].cnt) || 0;
    callback(err, c);
    return;
  });
};

/**
 * Find a model instance by id
 */
CouchbaseDB.prototype.find = function find(model, id, callback) {
  var self = this;
  debug("CouchbaseDB.prototype.find() : " + JSON.stringify([model, id]));

  var myBucket = self.getBucket(function(err){
    //var myBucket = self.myCluster.openBucket(self.settings.bucket,function(err){
    if(err){
      callback(err,null);
      return;
    }
    myBucket.get(id,function(err, result) {
      if(err){
        callback(err,null);
        return;
      }
      debug("CouchbaseDB.prototype.find()  : find result is:  "  + JSON.stringify([err, result]) );
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

  var createDataBuilderObj = prepareCreateData(data,self,model,callback);


  var myBucket = self.getBucket(function(err){
    //var myBucket = self.myCluster.openBucket(self.settings.bucket,function(err){
    if(err){
      callback(err,null);
      return;
    }

    myBucket.insert(createDataBuilderObj.getIdKey(),createDataBuilderObj.getPreparedData(),function(err, result) {
      if(err){
        callback(err,null);
        return;
      }
      result = createDataBuilderObj.setImplicitFieldsInResult(data,result);
      debug("CouchbaseDB.prototype.create()  : added id/doctype,now result is:  "  + JSON.stringify([result]) );

      callback(err,result);

    });
  });
};

/**
 * Save a model instance
 */
CouchbaseDB.prototype.save = function (model, data, callback) {
  debug("CouchbaseDB.prototype.save() : " + JSON.stringify([model, data]));
  throw "stop here !";
};

/**
 * Check if a model instance exists by id
 */
CouchbaseDB.prototype.exists = function (model, id, callback) {
  var self = this;
  debug("CouchbaseDB.prototype.exists() : " + JSON.stringify([model, id]));

  var myBucket = self.getBucket(function(err){
    //var myBucket = self.myCluster.openBucket(self.settings.bucket,function(err){
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
  var createDataBuilderObj = prepareCreateData(data,self,model,callback);

  var myBucket = self.getBucket(function(err){
    //var myBucket = self.myCluster.openBucket(self.settings.bucket,function(err){
    if(err){
      callback(err,null);
      return;
    }
    updateOneDoc(self,myBucket,createDataBuilderObj.getIdKey(),model,createDataBuilderObj.getPreparedData(),callback);
  });
};


/*
 Calls CreateDataBuilder to prepared the inbound data that is to be inserted
 */
var prepareCreateData=function(inboundData,thisRef,model,callback){
  var self = thisRef;
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

  removeOneDoc(id,self,function(err, result){
    if(err){
      callback(err,null);
      return;
    }
    debug("CouchbaseDB.prototype.destroy()  : removal result is:  "  + JSON.stringify([err, result]) );
    callback(null,result);

  });

};



var removeOneDoc = function(docid, thisRef,cb){
  var self = thisRef;
  //cb(null,{"removeOneDoc":"good"});

  var myBucket = self.getBucket(function(err){
    //var myBucket = self.myCluster.openBucket(self.settings.bucket,function(err){
    if(err){
      cb(err,null);
      return;
    }

    myBucket.remove(docid,function(err, result) {
      if(err){
        cb(err,null);
        return;
      }

      cb(err,result);
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


  if (filter.where && filter.where.id) {
    self.find(model, filter.where.id, function(err, res) {
      callback(err, [res])
    });
    return;
  }


  var clauseBuilderIndex = new clauseBuilderClass();
  var clausebuilderObj = clauseBuilderIndex.getClauseBuilder(filter,self.settings.bucket,model);
  var clause = clausebuilderObj.buildClause();

  qryString = clause;
  debug("CouchbaseDB.prototype.all()  final query is : " + qryString);
  cbquery(qryString,self,callback);
};

/**
 * Delete all model instances
 */
CouchbaseDB.prototype.destroyAll = function destroyAll(model, filter,callback) {
  debug("CouchbaseDB.prototype.destroyAll() : " + JSON.stringify(model) + ", the filter: " + JSON.stringify(filter));
  debug("CouchbaseDB.prototype.destroyAll() filter: " + filter + ",its type:" + typeof(filter));
  debug("CouchbaseDB.prototype.destroyAll() callback: " + callback  + ",its type:" + typeof(callback));
  var filterobj = filter;
  var callbackfn = callback;
  //is
  if(_.isFunction(filter)){
    filterobj = {};
    callbackfn = filter;
  };



  //if remove by document id, do not use N1QL to search the documents
  if(isRequestedByIDOnly(filterobj)){
    debug("CouchbaseDB.prototype.destroyAll() : remove this doc by id : " + filterobj[constants.KEYWORD_CONVENTION_DOCID]);
    this.destroy(model, filterobj[constants.KEYWORD_CONVENTION_DOCID], callbackfn);
    return;
  };
  var self = this;
  var clauseBuilderIndex = new clauseBuilderClass();
  filterobj = specifyDocIdField(filterobj);
  var clausebuilderObj = clauseBuilderIndex.getClauseBuilder(filterobj,self.settings.bucket,model);
  var clause = clausebuilderObj.buildClause();
  qryString = clause;
  debug("CouchbaseDB.prototype.destroyAll()  final query is : " + qryString);
  cbquery(qryString,self,function(err,res){
    if(err){
      callbackfn(err,null);
      return;
    }

    if(res.length==0){
      debug("    CouchbaseDB.prototype.destroyAll()   No records were found!");
      callbackfn(null,{"success":"No records were found, no documents will be removed"});
      return;
    }

    debug("CouchbaseDB.prototype.destroyAll() all result: " + JSON.stringify(res));
    var doneRemovals = [];
    async.each(res, function( eachId, cb_async) {
      var currentDocid = eachId[constants.KEYWORD_CONVENTION_DOCID];
      debug("    CouchbaseDB.prototype.destroyAll()   removing the document : " + currentDocid);
      removeOneDoc(currentDocid, self,function(err, result){
        if(err){
          debug("    CouchbaseDB.prototype.destroyAll()  : error happened with removing the document '" + currentDocid + "' : " + err );
        }else{
          doneRemovals.push(currentDocid);
          debug("    CouchbaseDB.prototype.destroyAll()  : successfully removed the document '" + currentDocid + ", result is: " + JSON.stringify(result));
        };

        cb_async(null);  //make the async keep going to the next work
      });
    }, function(err){
      debug("    CouchbaseDB.prototype.destroyAll()  : the following documents were successfully removed :  " + JSON.stringify(doneRemovals));
      callbackfn(err,{"removed":"removed " + doneRemovals.length + "records"});
    });

  });

};

var isRequestedByIDOnly = function (filter){
  var keys = Object.keys(filter);
  if(keys.length==1 && keys[0]==constants.KEYWORD_CONVENTION_DOCID){
    return true;
  };
  return false;
};

/***
 To make sure the "id" is in the fields of the select statement
 */
var specifyDocIdField = function (filter){
  if(filter[constants.KEYWORD_LEVEL1_FIELDS]){
    var hasDocId = false;
    for(var i=0;i<filter[constants.KEYWORD_LEVEL1_FIELDS].length;i++){
      if(filter[constants.KEYWORD_LEVEL1_FIELDS][i]==constants.KEYWORD_CONVENTION_DOCID){
        hasDocId = true;
      }
    };
    if(!hasDocId){
      filter[constants.KEYWORD_LEVEL1_FIELDS].push(constants.KEYWORD_CONVENTION_DOCID);
    };
  }else{
    filter[constants.KEYWORD_LEVEL1_FIELDS]=[];
    filter[constants.KEYWORD_LEVEL1_FIELDS].push(constants.KEYWORD_CONVENTION_DOCID);
  };

  return filter;
};

/**
 * Update the attributes for a model instance by id
 * Will be called when  PUT to /model_url_name/{id}
 */
CouchbaseDB.prototype.updateAttributes = function updateAttrs(model, id, data, callback) {

  var self = this;
  debug("CouchbaseDB.prototype.updateAttributes() : " + JSON.stringify([model, id, data]));
  var idkey = id;
  var myBucket = self.getBucket(function(err){
    //var myBucket = self.myCluster.openBucket(self.settings.bucket,function(err){
    if(err){
      callback(err,null);
      return;
    }
    updateOneDoc(self,myBucket,idkey,model,data,callback);
  });
};

/*
 Updates one document, do not replace the fields that are preserved
 */

var updateOneDoc = function(thisRef,myBucket,idkey,model,inboundData,callback){
  var self = thisRef;
  var props = self._models[model].properties;
  var dataBuilderIndex = new dataBuilderClass();

  myBucket.get(idkey,function(err, result) {
    if(err){
      debug("    CouchbaseDB   updateOneDoc()  : Can not find the document with the id  '"  + id + "'" );
      callback(err,null);
      return;
    }
    //found the document
    debug("    CouchbaseDB   updateOneDoc()   : found the docuemnt:  "  + JSON.stringify([err, result]) );
    var updateDataBuilderObj = dataBuilderIndex.getUpdateDataBuilder(props,inboundData,result["value"]);
    var preparedData = updateDataBuilderObj.buildData();
    myBucket.upsert(idkey,preparedData,function(err, result) {
      if(err){
        callback(err,null);
        return;
      }
      debug("    CouchbaseDB   updateOneDoc()  : updateAttributes result is:  "  + JSON.stringify([err, result]) );
      callback(err,result);
    });


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

CouchbaseDB.prototype.update = function (model, where, data, callback) {
  console.log( )
  var self = this;
  debug("CouchbaseDB.prototype.update() : " + where);
  var idkey = where.id;

  var myBucket = self.getBucket(function(err){
    if(err){
      callback(err,null);
      return;
    }
    myBucket.get(idkey,function(err, result) {
      if(err){
        debug("    CouchbaseDB   update()  : Can not find the document with the id  '"  + idkey + "'" );
        callback(err,null);
        return;
      }
      //found the document
      debug("    CouchbaseDB   update()   : found the docuemnt:  "  + JSON.stringify([err, result]) );
      myBucket.upsert(idkey,data.updateFunc(result.value),function(err, result) {
        if(err){
          callback(err,null);
          return;
        }
        debug("    CouchbaseDB   update()  : update result is:  "  + JSON.stringify([err, result]) );
        callback(err,result);
      });
    });
  });
};

CouchbaseDB.prototype.getBucket = function ( clbk ) {
  var self = this;
  if( !this.myBucket || !this.myBucket.connected ) {
    this.myBucket = this.myCluster.openBucket(this.settings.bucket, function(err){
      clbk && clbk( null, self.myBucket );
    });
  } else {
    process.nextTick(function () {
      clbk && clbk( null, self.myBucket );
    });
  }

  return this.myBucket;
};
