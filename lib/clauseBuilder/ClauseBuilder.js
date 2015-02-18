/**
	The public interface of the builder which interprets and create all the clause
	This is the main entrance of building EVERY parts of the SELECT statement

	All the work has to go through here
*/

var BaseModel = require('../base/BaseModel.js');
var util = require('util');   
var fieldsBuilderClass = require('./FieldsBuilder.js');
var includeBuilderClass = require('./IncludeBuilder.js');
var limitBuilderClass = require('./LimitBuilder.js');
var orderBuilderClass = require('./OrderBuilder.js');
var skipBuilderClass = require('./SkipBuilder.js');
var whereBuilderClass = require('./WhereBuilder.js');
var debug = require('debug')('connector:builder');

var ClauseBuilder = function(conds,defaultBucket,currentModel){
	var originalModel = currentModel;
	var originalConds = conds;
	var originalDefaultBucket = defaultBucket;

	this.getCurrentModel = function(){
		return originalModel;
	};
	this.getConditions = function(){
		return originalConds;
	};
	this.getDefaultBucket = function(){
		return originalDefaultBucket;
	};
};
util.inherits(ClauseBuilder, BaseModel);

/**
	When no condition was specified (no WHERE, LIMIT, ORDER,FIELD etc... specified), we should at least limits the searching scope due to docType
*/
var GetNoConditionWhereClause = function(constantDocType, selectStatement,defaultBucket,model){
	var returnval = '';
	if(selectStatement){  
		returnval = selectStatement + defaultBucket;
	}
	if(model){  returnval = returnval + " WHERE (" + constantDocType + "='" + model + "')";}
	return returnval;
};

/**
	The main entrance method interpreting and building the clauses
*/
ClauseBuilder.prototype.buildClause = function(selectStatement){
	var self = this;
	var conds = this.getConditions();
	var model = this.getCurrentModel();
	var defaultBucket = this.getDefaultBucket();
	var constants = this.getConstants();
	
	if(!conds){ 
		return GetNoConditionWhereClause(constants.KEYWORD_CONVENTION_DOCTYPE,selectStatement,defaultBucket,model);
	}
	var fieldsBuilderObj = null;
	var includeBuilderObj = null;
	var limitBuilderObj = null;
	var orderBuilderObj = null;
	var skipBuilderObj = null;
	var whereBuilderObj = null;

	var finalClause = '';
	debug("ClauseBuilder.prototype.buildClause()  conds and model: " + JSON.stringify([conds,model]) );
	Object.keys(conds).forEach(function (key) {
		debug("    Doing the key: '" + key + "'");
		if (self.stringEqualNoCase(key,constants.KEYWORD_LEVEL1_WHERE))
		{
			whereBuilderObj = new whereBuilderClass(conds[key],model);
		}else if(self.stringEqualNoCase(key,constants.KEYWORD_LEVEL1_FIELDS)){
		debug("    Doing fields now: " );
			fieldsBuilderObj = new fieldsBuilderClass(conds[key]);
		}else if(self.stringEqualNoCase(key,constants.KEYWORD_LEVEL1_INCLUDE)){

		}else if(self.stringEqualNoCase(key,constants.KEYWORD_LEVEL1_LIMIT)){
			limitBuilderObj = new limitBuilderClass(conds[key]);
		}else if(self.stringEqualNoCase(key,constants.KEYWORD_LEVEL1_ORDER)){
			orderBuilderObj = new orderBuilderClass(conds[key]);
		}else if(self.stringEqualNoCase(key,constants.KEYWORD_LEVEL1_SKIP) || self.stringEqualNoCase(key,constants.KEYWORD_LEVEL1_OFFSET)){
			skipBuilderObj = new skipBuilderClass(conds[key]);

		}else{
			debug("    treating else key: " + key);
			whereBuilderObj = new whereBuilderClass(conds,model);
		}
		
	});
	finalClause = "SELECT * FROM ";
	if(selectStatement){  finalClause = selectStatement ;}
	if(fieldsBuilderObj){
		finalClause = fieldsBuilderObj.buildClause();
	}
	if(includeBuilderObj){
		finalClause = finalClause + self.escapeFieldWithBackTick(defaultBucket) +" ";

	}else{
		finalClause = finalClause + self.escapeFieldWithBackTick(defaultBucket) +" ";

	}
	debug("ClauseBuilder.prototype.buildClause()  now whereBuilderObj and model: " + JSON.stringify([whereBuilderObj,model]) );

	if(!whereBuilderObj && model){
		whereBuilderObj = new whereBuilderClass(null,model);
	}
	if(whereBuilderObj){
		finalClause = finalClause + whereBuilderObj.buildClause();
	}

	if(orderBuilderObj){
		finalClause = finalClause + " " + orderBuilderObj.buildClause();
	}

	if(limitBuilderObj){
		finalClause = finalClause + " " + limitBuilderObj.buildClause();
	}
	
	if(skipBuilderObj){
		finalClause = finalClause + " " + skipBuilderObj.buildClause();
	}
	
	debug("ClauseBuilder.prototype.buildClause()    finalClause: " + finalClause);
	
	return finalClause;
};

module.exports = ClauseBuilder;

