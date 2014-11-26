/**
	The public interface which initializes and returns the instance of the builders
*/
var BaseModel = require('../base/BaseModel.js');
var util = require('util');   
var builderFactory = function(){

	/*	
	this.getFingerPrintBuilder = function(){
		var fingerPrintBuilderClass = require('./FingerPrintBuilder.js');
		return new fingerPrintBuilderClass();
	};

	*/

};
util.inherits(builderFactory, BaseModel);
builderFactory.prototype.foo = function(){
	this.EClog("builderFactory foo..." );
};


/**
	Initializes and returns the instance of a ClauseBuilder class.
	This would be the main entrance of each interpreting work

	This parameter "conds" is a JSON object containing all the select statement parts.
	Example of "conds":
		{"where":{"and":[{"title":"My Post"},{"content":"Hello"},{"price":{"between":["0","7"]}}]},"limit":10,"offset":15,"order":["id DESC","name ASC"],"skip":15}

*/

builderFactory.prototype.getClauseBuilder = function(conds,defaultBucket){
	var clauseBuilderClass = require('./ClauseBuilder.js');
	//this.EClog("builderFactory   ()  : " + JSON.stringify([conds,defaultBucket]) );
	return new clauseBuilderClass(conds,defaultBucket);
};





module.exports = builderFactory;