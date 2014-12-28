/**
	The public interface which initializes and returns the instance of the builders
*/
var BaseModel = require('../base/BaseModel.js');
var debug = require('debug')('connector:builder');
var util = require('util');   
var builderFactory = function(){

};

util.inherits(builderFactory, BaseModel);

/**
	Initializes and returns the instance of a UpdateDataBuilder class.


	The parameter "modelProperties" contains the model setting info
	The parameter "inboundData" is the data that are to be written into the document
	The parameter "inboundData" is the current existing document data in couchbase
*/

builderFactory.prototype.getUpdateDataBuilder = function(modelProperties,inboundData,docData){
	var updateDataBuilderClass = require('./UpdateDataBuilder.js');
	return new updateDataBuilderClass(modelProperties,inboundData,docData);
};

/**
	Initializes and returns the instance of a CreateDataBuilder class.


	The parameter "inboundData" is the data that are to be written into the document
	The parameter "model" is the name of the current model
*/
builderFactory.prototype.getCreateDataBuilder = function(inboundData,model){
	var createDataBuilderClass = require('./CreateDataBuilder.js');
	return new createDataBuilderClass(inboundData,model);
};

module.exports = builderFactory;