/**
	The public interface which initializes and returns the instance of the builders
*/
var BaseModel = require('../base/BaseModel.js');
var debug = require('debug')('connector:builder');
var util = require('util');   
var builderFactory = function(){

};

util.inherits(builderFactory, BaseModel);


/**
	Initializes and returns the instance of a ClauseBuilder class.
	This would be the main entrance of each interpreting work

	This parameter "conds" is a JSON object containing all the select statement parts.
*/

builderFactory.prototype.getClauseBuilder = function(conds,defaultBucket,currentModel){
	var clauseBuilderClass = require('./ClauseBuilder.js');
	return new clauseBuilderClass(conds,defaultBucket,currentModel);
};

module.exports = builderFactory;