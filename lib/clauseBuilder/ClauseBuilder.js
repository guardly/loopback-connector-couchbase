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
var ClauseBuilder = function(conds,defaultBucket){
	this.EClog("ClauseBuilder   ()  : " + JSON.stringify([conds,defaultBucket]) );
	var originalConds = conds;
	var originalDefaultBucket = defaultBucket;
	/*
	this.getFingerPrintBuilder = function(){
		var fingerPrintBuilderClass = require('./FingerPrintBuilder.js');
		return new fingerPrintBuilderClass();
	};
*/
	this.getConditions = function(){
		return originalConds;
	};
	this.getDefaultBucket = function(){
		return originalDefaultBucket;
	};
};
util.inherits(ClauseBuilder, BaseModel);


/**
	The main entrance method interpreting and building the clauses

	selectStatement: if the caller side has a prioritized select statement, use this one instead, example of this statement:
		'SELECT  count(*) AS cnt FROM '
*/
ClauseBuilder.prototype.buildClause = function(selectStatement){
	var self = this;
	var conds = this.getConditions();
	var defaultBucket = this.getDefaultBucket();
	if(!conds){
		if(selectStatement){  return selectStatement + defaultBucket;};
		return '';
	};
	var constants = this.getConstants();
	var fieldsBuilderObj = null;
	var includeBuilderObj = null;
	var limitBuilderObj = null;
	var orderBuilderObj = null;
	var skipBuilderObj = null;
	var whereBuilderObj = null;

	var finalClause = '';
	self.EClog("ClauseBuilder.prototype.buildClause()  conds: " + JSON.stringify([conds]) );
	Object.keys(conds).forEach(function (key) {
		self.EClog("    Doing the key: " + key);
		if (self.stringEqualNoCase(key,constants.KEYWORD_LEVEL1_WHERE))
		{
			whereBuilderObj = new whereBuilderClass(conds[key]);

			//finalClause = whereBuilderObj.buildClause();
			//self.EClog("      whereBuildingResult: " + finalClause);
			
		}else if(self.stringEqualNoCase(key,constants.KEYWORD_LEVEL1_FIELDS)){

			fieldsBuilderObj = new fieldsBuilderClass(conds[key]);

		}else if(self.stringEqualNoCase(key,constants.KEYWORD_LEVEL1_INCLUDE)){

		}else if(self.stringEqualNoCase(key,constants.KEYWORD_LEVEL1_LIMIT)){
			limitBuilderObj = new limitBuilderClass(conds[key]);
		}else if(self.stringEqualNoCase(key,constants.KEYWORD_LEVEL1_ORDER)){
			orderBuilderObj = new orderBuilderClass(conds[key]);
		}else if(self.stringEqualNoCase(key,constants.KEYWORD_LEVEL1_SKIP)){

		}else if(self.stringEqualNoCase(key,constants.KEYWORD_LEVEL1_OFFSET)){

		}else{  //if the key does not match any reserved keywords, think of this condition as a where clause without the word "WHERE"
			self.EClog("    treating else key: " + key);
			whereBuilderObj = new whereBuilderClass(conds);
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


	if(whereBuilderObj){
		finalClause = finalClause + whereBuilderObj.buildClause();
	};

	if(orderBuilderObj){
		finalClause = finalClause + " " + orderBuilderObj.buildClause();
	};

	if(limitBuilderObj){
		finalClause = finalClause + " " + limitBuilderObj.buildClause();
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

