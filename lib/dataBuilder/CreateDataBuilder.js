/**
	The public interface of the builder which prepares the data that are to be inserted into the database
	Will implicitly read the "id" field for the document id, if not existing, create a UUID for it
	Will implicitly set the field "id" and "docType" if not specified


	For creating new document (CouchbaseDB.prototype.create) or updating the existing document (CouchbaseDB.prototype.updateOrCreate) only. 
	In those two cases, document id is not specified in a separate parameter, we need to find the possible id by name convention 

*/
var BaseModel = require('../base/BaseModel.js');
var util = require('util');   
var debug = require('debug')('connector:builder');
var constants = require('../base/constants.js');
var uuid = require('node-uuid');
var CreateDataBuilder = function(inboundData,model){
	var originalInboundData = inboundData;
	var originalModel = model;
	var currentIdkey = "";//the current document ID
	var preparedData = {};//the converted data

	this.getInboundData = function(){
		return originalInboundData;
	};
	this.getModel = function(){
		return originalModel;
	};
	this.getIdKey = function(){
		return currentIdkey;
	};
	this.setIdKey = function(newKeyId){
		currentIdkey = newKeyId;
	};		
	this.getPreparedData = function(){
		return preparedData;
	};
	this.setPreparedData = function(newData){
		preparedData = newData;
	};		
};
util.inherits(CreateDataBuilder, BaseModel);

/*
	Build the data for creating the document.
*/
CreateDataBuilder.prototype.buildData = function(callback){
	var inboundData = this.getInboundData();
	var model = this.getModel();

	var idkey = readDocumentID(inboundData, callback);
	this.setIdKey(idkey);
	var preparedData = setImplicitFields(inboundData,idkey,model);
	this.setPreparedData(preparedData);

	debug("        CreateDataBuilder.prototype.buildData()  preparedData: " + JSON.stringify(preparedData));


	//return preparedData;
};


/***
	We need to implicitly keep the value of the document id and the model name into the document

*/
var setImplicitFields = function(data,idkey,model){
	data[constants.KEYWORD_CONVENTION_DOCID] = idkey;          //field 'id' has to be there. if id was not defined, a uuid would be created and we need to make sure it is written into the id field
	data[constants.KEYWORD_CONVENTION_DOCTYPE] = model;        //field "docType' has to be there, this is an implicit field

	return data;
};




/***
	We need to implicitly keep the value of the document id and the model name into the document

*/

var readDocumentID = function(data, callback){

	var idkey = data && data[constants.KEYWORD_CONVENTION_DOCID];
	if(!idkey){
		idkey = uuid.v4();
		debug("No document id defined, create one for it : "  + idkey );
	}
		
	if(!(typeof idkey === 'string' || idkey instanceof Buffer)){
		debug("The document key '" + idkey + "', which is from the '" + constants.KEYWORD_CONVENTION_DOCID + "' field, should be in string format or buffer format");
		callback("The document key '" + idkey + "', which is from the '" + constants.KEYWORD_CONVENTION_DOCID + "' field, should be in string format or buffer format",null);
	}
	return idkey;
};


/*
	Set docType and document id into the result object
*/
CreateDataBuilder.prototype.setImplicitFieldsInResult = function(data,result){
	debug("CreateDataBuilder.prototype.setImplicitFieldsInResult()  : created result is:  "  + JSON.stringify(result) );
	result[constants.KEYWORD_CONVENTION_DOCID] = data[constants.KEYWORD_CONVENTION_DOCID];
	result[constants.KEYWORD_CONVENTION_DOCTYPE] = data[constants.KEYWORD_CONVENTION_DOCTYPE];
	return result;
};


module.exports = CreateDataBuilder;

