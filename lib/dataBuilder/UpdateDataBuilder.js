/**
	The public interface of the builder which merges the coming-in data and the existing data, 
	decides which fields are to be changed or preserved

	
*/

var BaseModel = require('../base/BaseModel.js');
var util = require('util');   
var debug = require('debug')('connector:builder');
var constants = require('../base/constants.js');
var UpdateDataBuilder = function(modelProperties,inboundData,docData){
	var originalModelProperties = modelProperties;
	var originalInboundData = inboundData;
	var originalDocData = docData;

	this.getModelProperties = function(){
		return originalModelProperties;
	};
	this.getInboundData = function(){
		return originalInboundData;
	};
	this.getDocData = function(){
		return originalDocData;
	};
};
util.inherits(UpdateDataBuilder, BaseModel);


/*
	Build the data for updating the document. Should only change the fields that are not preserved.
*/
UpdateDataBuilder.prototype.buildData = function(){
	var inboundData = this.getInboundData();
	var docData = this.getDocData();
	var modelProperties = this.getModelProperties();

	var preservedFields = getPreservedFields(modelProperties);
	debug("    UpdateDataBuilder.prototype.buildData()  preservedFields: " + preservedFields);

	var preparedData = setPreparedData(inboundData,docData,preservedFields);
	//debug("        UpdateDataBuilder.prototype.buildData()  inboundData: " + JSON.stringify(inboundData));
	//debug("        UpdateDataBuilder.prototype.buildData()  docData: " + JSON.stringify(docData));
	debug("        UpdateDataBuilder.prototype.buildData()  preparedData: " + JSON.stringify(preparedData));


	return preparedData;
};

/*
	builds up an array containing all the names of the fields which are not to be changed
*/
var getPreservedFields = function(modelProperties){
	var preservedFields = new Array();
	//the field 'id' and 'docType' should be preserved implicitly
	preservedFields.push(constants.KEYWORD_CONVENTION_DOCID);
	preservedFields.push(constants.KEYWORD_CONVENTION_DOCTYPE);

	//debug("    UpdateDataBuilder getPreservedFields()  modelProperties: " + JSON.stringify([modelProperties]));

	Object.keys(modelProperties).forEach(function (key) {
		//debug("    key : " + key + ":" + modelProperties[key]);
		var content = modelProperties[key];
		if(content[constants.KEYWORD_PRESERVED_COUCHBASE] && content[constants.KEYWORD_PRESERVED_COUCHBASE][constants.KEYWORD_PRESERVED_KEYNAME]){
			preservedFields.push(key);
		};

	});
	return preservedFields;
};

/*
	merge the inbound data with the existing document
*/
var setPreparedData = function(inboundData,docData,preservedFields){
	//debug("    UpdateDataBuilder  setPreparedData() inboundData: " + inboundData);
	Object.keys(inboundData).forEach(function (key) {
		//debug("    key : " + key + ":" + JSON.stringify(inboundData[key]) );
		if(preservedFields.indexOf(key) == -1){
			docData[key] = inboundData[key];
		};
	});

	return docData;
};
module.exports = UpdateDataBuilder;

