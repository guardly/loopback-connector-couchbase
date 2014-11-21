/**
	The public interface of the builder which interprets and converts the LIMIT keyword
	This is the main entrance of building  LIMIT part
*/
var BaseModel = require('../base/BaseModel.js');
var util = require('util');   
var spaces = "    ";//4 spaces
var LimitBuilder = function(){

	/*
	this.getFingerPrintBuilder = function(){
		var fingerPrintBuilderClass = require('./FingerPrintBuilder.js');
		return new fingerPrintBuilderClass();
	};
*/
	
};
util.inherits(LimitBuilder, BaseModel);



module.exports = LimitBuilder;



