/**
	The public interface of the builder which interprets and converts the INCLUDE keyword
	This is the main entrance of building  INCLUDE part
*/
var BaseModel = require('../base/BaseModel.js');
var util = require('util');   
var spaces = "    ";//4 spaces
var IncludeBuilder = function(){
	
};
util.inherits(IncludeBuilder, BaseModel);

module.exports = IncludeBuilder;