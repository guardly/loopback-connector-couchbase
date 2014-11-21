/**
	The public interface of the builder which interprets and converts the FIELDS keyword
	This is the main entrance of building  FIELDS part
*/
var BaseModel = require('../base/BaseModel.js');
var util = require('util');   
var spaces = "    ";//4 spaces
var FieldsBuilder = function(){

	/*
	this.getFingerPrintBuilder = function(){
		var fingerPrintBuilderClass = require('./FingerPrintBuilder.js');
		return new fingerPrintBuilderClass();
	};
*/
	
};
util.inherits(FieldsBuilder, BaseModel);



module.exports = FieldsBuilder;

