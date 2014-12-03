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

/*

	This parameter "conds" is a JSON object containing all the select statement parts.
	Example of "conds":
		{"where":{"and":[{"title":"My Post"},{"content":"Hello"},{"price":{"between":["0","7"]}}]},"limit":10,"offset":15,"order":["id DESC","name ASC"],"skip":15}
	
*/
var ClauseBuilder = function(conds,defaultBucket,currentModel){
	this.EClog("ClauseBuilder   ()  : " + JSON.stringify([conds,defaultBucket]) );
	var originalModel = currentModel;
	var originalConds = conds;
	var originalDefaultBucket = defaultBucket;
	/*
	this.getFingerPrintBuilder = function(){
		var fingerPrintBuilderClass = require('./FingerPrintBuilder.js');
		return new fingerPrintBuilderClass();
	};
*/
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
		};
		if(model){  returnval = returnval + " WHERE (" + constantDocType + "='" + model + "')";};
		return returnval;

};
/**
	The main entrance method interpreting and building the clauses

	selectStatement: if the caller side has a prioritized select statement, use this one instead, example of this statement:
		'SELECT  count(*) AS cnt FROM '
*/
ClauseBuilder.prototype.buildClause = function(selectStatement){
	var self = this;
	var conds = this.getConditions();
	var model = this.getCurrentModel();
	var defaultBucket = this.getDefaultBucket();
	var constants = this.getConstants();
	
	if(!conds){  //deal with special case: no condition was specified:
		return GetNoConditionWhereClause(constants.KEYWORD_CONVENTION_DOCTYPE,selectStatement,defaultBucket,model);
	};
	var fieldsBuilderObj = null;
	var includeBuilderObj = null;
	var limitBuilderObj = null;
	var orderBuilderObj = null;
	var skipBuilderObj = null;
	var whereBuilderObj = null;

	var finalClause = '';
	self.EClog("ClauseBuilder.prototype.buildClause()  conds and model: " + JSON.stringify([conds,model]) );
	Object.keys(conds).forEach(function (key) {
		self.EClog("    Doing the key: " + key);
		if (self.stringEqualNoCase(key,constants.KEYWORD_LEVEL1_WHERE))
		{
			whereBuilderObj = new whereBuilderClass(conds[key],model);

			//finalClause = whereBuilderObj.buildClause();
			//self.EClog("      whereBuildingResult: " + finalClause);
			
		}else if(self.stringEqualNoCase(key,constants.KEYWORD_LEVEL1_FIELDS)){

			fieldsBuilderObj = new fieldsBuilderClass(conds[key]);

		}else if(self.stringEqualNoCase(key,constants.KEYWORD_LEVEL1_INCLUDE)){

		}else if(self.stringEqualNoCase(key,constants.KEYWORD_LEVEL1_LIMIT)){
			limitBuilderObj = new limitBuilderClass(conds[key]);
		}else if(self.stringEqualNoCase(key,constants.KEYWORD_LEVEL1_ORDER)){
			orderBuilderObj = new orderBuilderClass(conds[key]);
		}else if(self.stringEqualNoCase(key,constants.KEYWORD_LEVEL1_SKIP) || self.stringEqualNoCase(key,constants.KEYWORD_LEVEL1_OFFSET)){
			skipBuilderObj = new skipBuilderClass(conds[key]);

		}else{  //if the key does not match any reserved keywords, think of this condition as a where clause without the word "WHERE"
			self.EClog("    treating else key: " + key);
			whereBuilderObj = new whereBuilderClass(conds,model);
		};
		
	});
	finalClause = "SELECT * FROM ";
	if(selectStatement){  finalClause = selectStatement ;};
	if(fieldsBuilderObj){
		finalClause = fieldsBuilderObj.buildClause();
		//self.EClog("   fieldsBuilderObj finalClause: " + finalClause);
	};
	if(includeBuilderObj){
		finalClause = finalClause + defaultBucket +" ";

	}else{
		finalClause = finalClause + defaultBucket +" ";

	};
	self.EClog("ClauseBuilder.prototype.buildClause()  now whereBuilderObj and model: " + JSON.stringify([whereBuilderObj,model]) );

	if(!whereBuilderObj && model){
		whereBuilderObj = new whereBuilderClass(null,model);
	};
	if(whereBuilderObj){
		finalClause = finalClause + whereBuilderObj.buildClause();
	};

	if(orderBuilderObj){
		finalClause = finalClause + " " + orderBuilderObj.buildClause();
	};

	if(limitBuilderObj){
		finalClause = finalClause + " " + limitBuilderObj.buildClause();
	};
	
	if(skipBuilderObj){
		finalClause = finalClause + " " + skipBuilderObj.buildClause();
	};
	
	self.EClog("ClauseBuilder.prototype.buildClause()    finalClause: " + finalClause);
	
	return finalClause;
};


/*

	Object.keys(conds).forEach(function (key) {
		EClog("_buildWhere() --treating the key: " + key);

	    if (key === 'and' || key === 'or') {
	      var clauses = conds[key];
	      if (Array.isArray(clauses)) {
	        clauses = clauses.map(function (c) {
	        		EClog("_buildWhere() --recursive call: for the key: " + key);
	          return '(' + _buildWhere(model, c,selfThis) + ')';
	        });
	        		EClog("_buildWhere() --return the result : clauses: " + JSON.stringify([clauses]));
	        return cs.push(clauses.join(' ' + key.toUpperCase() + ' '));
	      }
	      // The value is not an array, fall back to regular fields
	    }




	    //var keyEscaped = selfThis.columnEscaped(model, key);
   	    //EClog("_buildWhere() keyEscaped: " + JSON.stringify([keyEscaped]));



	});

*/
module.exports = ClauseBuilder;

