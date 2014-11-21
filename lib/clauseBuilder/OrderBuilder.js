/**
	The public interface of the builder which interprets and converts the ORDER keyword
	This is the main entrance of building  ORDER part
*/
var BaseModel = require('../base/BaseModel.js');
var util = require('util');   
var spaces = "    ";//4 spaces
var OrderBuilder = function(){

	/*
	this.getFingerPrintBuilder = function(){
		var fingerPrintBuilderClass = require('./FingerPrintBuilder.js');
		return new fingerPrintBuilderClass();
	};
*/
	
};
util.inherits(OrderBuilder, BaseModel);



module.exports = OrderBuilder;






