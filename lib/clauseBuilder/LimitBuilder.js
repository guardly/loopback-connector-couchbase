/**
	The public interface of the builder which interprets and converts the LIMIT keyword
	This is the main entrance of building  LIMIT part
*/
var BaseModel = require('../base/BaseModel.js');
var util = require('util');   
var spaces = "    ";//4 spaces
var LimitBuilder = function(limitnumber){
	var currentLimitNumber = limitnumber;
	this.getLimitNumber = function(){
		return currentLimitNumber;
	};	

};
util.inherits(LimitBuilder, BaseModel);

/**
	The main entrance method interpreting and building the clauses
*/
LimitBuilder.prototype.buildClause = function(){
	var self = this;
	var limitNum = this.getLimitNumber();
	var constants = this.getConstants();
	return constants.KEYWORD_LEVEL1_LIMIT.toUpperCase() + " " + limitNum;
};

module.exports = LimitBuilder;