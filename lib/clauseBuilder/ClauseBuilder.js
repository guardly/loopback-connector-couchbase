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
var ClauseBuilder = function(conds){
	var originalConds = conds;
	/*
	this.getFingerPrintBuilder = function(){
		var fingerPrintBuilderClass = require('./FingerPrintBuilder.js');
		return new fingerPrintBuilderClass();
	};
*/
	this.getConditions = function(){
		return originalConds;
	};
};
util.inherits(ClauseBuilder, BaseModel);


/**
	The main entrance method interpreting and building the clauses
*/
ClauseBuilder.prototype.buildClause = function(){
	var self = this;
	var conds = this.getConditions();
	var constants = this.getConstants();
	var fieldsBuilderObj = null;
	var includeBuilderObj = null;
	var limitBuilderObj = null;
	var orderBuilderObj = null;
	var skipBuilderObj = null;
	var whereBuilderObj = null;
	self.EClog("ClauseBuilder.prototype.buildClause()  conds: " + JSON.stringify([conds]) );
	Object.keys(conds).forEach(function (key) {
		self.EClog("    Doing the key: " + key);
		if (self.stringEqualNoCase(key,constants.KEYWORD_LEVEL1_WHERE))
		{
			whereBuilderObj = new whereBuilderClass(conds[key]);

			var whereBuildingResult = whereBuilderObj.buildClause();
			
		}else if(self.stringEqualNoCase(key,constants.KEYWORD_LEVEL1_FIELDS)){

		}else if(self.stringEqualNoCase(key,constants.KEYWORD_LEVEL1_INCLUDE)){

		}else if(self.stringEqualNoCase(key,constants.KEYWORD_LEVEL1_LIMIT)){

		}else if(self.stringEqualNoCase(key,constants.KEYWORD_LEVEL1_ORDER)){

		}else if(self.stringEqualNoCase(key,constants.KEYWORD_LEVEL1_SKIP)){

		}else if(self.stringEqualNoCase(key,constants.KEYWORD_LEVEL1_OFFSET)){

		}else{

		};
		
	});
	if(whereBuilderObj){
		self.EClog("      whereBuilderObj: " + whereBuilderObj);
	}else{
		self.EClog("      whereBuilderObj: is not initialized yet");
	};
	
	return '';
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

