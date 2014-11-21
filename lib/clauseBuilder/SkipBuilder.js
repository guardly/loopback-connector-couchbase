/**
	The public interface of the builder which interprets and converts the SKIP keyword
	This is the main entrance of building  SKIP part
*/
var BaseModel = require('../base/BaseModel.js');
var util = require('util');   
var spaces = "    ";//4 spaces
var SkipBuilder = function(){

	/*
	this.getFingerPrintBuilder = function(){
		var fingerPrintBuilderClass = require('./FingerPrintBuilder.js');
		return new fingerPrintBuilderClass();
	};
*/
	
};
util.inherits(SkipBuilder, BaseModel);



module.exports = SkipBuilder;




