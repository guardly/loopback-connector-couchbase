/**
	The public interface of the builder which interprets and converts the SKIP keyword
	This is the main entrance of building  SKIP part
*/
var BaseModel = require('../base/BaseModel.js');
var util = require('util');   
var spaces = "    ";//4 spaces
var SkipBuilder = function(skipNum){
	var currentSkipNumber = skipNum;
	this.getSkipNumber = function(){
		return currentSkipNumber;
	};	
};
util.inherits(SkipBuilder, BaseModel);

/**
	The main entrance method interpreting and building the clauses
*/
SkipBuilder.prototype.buildClause = function(){
	var self = this;
	var skipNum = this.getSkipNumber();
	var constants = this.getConstants();
	return constants.KEYWORD_LEVEL1_OFFSET.toUpperCase() + " " + skipNum;
};

module.exports = SkipBuilder;