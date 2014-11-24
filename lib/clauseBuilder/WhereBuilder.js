/**
	The public interface of the builder which interprets and create WHERE CLAUSE
	This is the main entrance of building  WHERE CLAUSE
*/
var BaseModel = require('../base/BaseModel.js');
var util = require('util');   
var spaces = "    ";//4 spaces
var whereSimpleElementBuilderClass = require('./WhereSimpleElemBuilder.js');

/*

	This parameter "conds" is a JSON object containing all the select statement parts.
	Example of "conds":
	--if the original condes is:
		{"where":{"and":[{"title":"My Post"},{"content":"Hello"},{"price":{"between":["0","7"]}}]},"limit":10,"offset":15,"order":["id DESC","name ASC"],"skip":15}
	--then, the part goes to here is:
		{"and":[{"title":"My Post"},{"content":"Hello"},{"price":{"between":["0","7"]}}]}



*/

var WhereBuilder = function(conds){
	var currentConds = conds;
	this.getConditions = function(){
		return currentConds;
	};	
};
util.inherits(WhereBuilder, BaseModel);


WhereBuilder.prototype.buildClause = function(){
	var self = this;
	var conds = this.getConditions();
	var constants = this.getConstants();
	var finalClause = "WHERE "; //would contain the whole where clause in string

	self.EClog(spaces + "    WhereBuilder.prototype.buildClause()  conds: " + JSON.stringify([conds]) );
	Object.keys(conds).forEach(function (key) {
		self.EClog(spaces + spaces + "Doing the key: " + key);
		if (self.stringEqualNoCase(key,constants.KEYWORD_LEVEL2_AND) || self.stringEqualNoCase(key,constants.KEYWORD_LEVEL2_OR))
		{
			self.EClog(spaces + spaces + spaces + "Do the And/OR reading for the key: " + key);
			finalClause = readAndOr(conds[key],self,constants,finalClause,key);
			//self.EClog(spaces + spaces + "   ---finalClause(AO): " + finalClause);
		
		}else{
			self.EClog(spaces + spaces + spaces + "Do the key/value pair reading for the key: " + key);
			finalClause = readSimpleElement(conds,self,constants,finalClause);
			self.EClog(spaces + spaces + "   ---finalClause (KV): " + finalClause);
			
		};
		
	});
	
			self.EClog(spaces + spaces + "   ---finalClause (finally): " + finalClause);
	return finalClause;
};


/*
	Reads and converts the And/Or condition. The condition may have nested And/Or parts.
*/
var readAndOr = function(conds,theThis,constants,finalClause,keyName){
	var self = theThis;
	//self.EClog(spaces + spaces + spaces + spaces + "readAndOr(): " + JSON.stringify([conds,finalClause]));
	finalClause = finalClause + '(';
	var i = 0;
	for (i=0;i<conds.length;i++){
		var currentConds = conds[i];
		//self.EClog(spaces + spaces + spaces + spaces + "i =  " + i + " is: " + JSON.stringify([currentConds]));
		if(i>0){
			finalClause = finalClause + ' ' + keyName.toUpperCase() + ' ';
		};


		Object.keys(currentConds).forEach(function (key) {

			//self.EClog(spaces + spaces + spaces + spaces + spaces + "readAndOr()--  Doing the key: " + key);
			if (self.stringEqualNoCase(key,constants.KEYWORD_LEVEL2_AND) || self.stringEqualNoCase(key,constants.KEYWORD_LEVEL2_OR)){
				finalClause = readAndOr(currentConds[key],self,constants,finalClause,key);
				
			
			}else{
				finalClause = readSimpleElement(currentConds,self,constants,finalClause);
			};


		});

	};
	finalClause = finalClause + ')';

	return finalClause;

};
/*
	Interprets and converts the simple element (no nested elements) of a where clause

	Examples of this "conds":
		{"carClass":"fullsize"}
		{"price":{"lt":10}}
		{"email":{"like":"%@yahoo.com"}}
		{"price":{"between":["0","7"]}}


*/
var readSimpleElement = function(conds,theThis,constants,finalClause){
	var self = theThis;
	finalClause = finalClause + '(';
	//self.EClog(spaces + spaces + spaces + spaces + "readSimpleElement(): " + JSON.stringify([conds,finalClause]));

	var whereSimpleElementBuilderObj = new whereSimpleElementBuilderClass(conds);
	var simpleElemClause = whereSimpleElementBuilderObj.buildClause();

//self.EClog(spaces + spaces + spaces + spaces + "readSimpleElement()  simpleElemClause: " + simpleElemClause);

/*
	Object.keys(conds).forEach(function (key) {
		if(typeof conds[key] === 'string'){
			finalClause = finalClause + key + "='" + conds[key] +"'";
		}else if(typeof conds[key] === 'boolean' || typeof conds[key] === 'number'){
			finalClause = finalClause + key + "=" + conds[key];
		}else{

			throw JSON.stringify([conds]) + " does not have simple value.";
		};

	});
*/

	finalClause = finalClause + simpleElemClause + ')';
	return finalClause;
};


/*

	Object.keys(conds).forEach(function (key) {
		if (self.stringEqualNoCase(key,constants.KEYWORD_LEVEL3_GREAT_THAN) || self.stringEqualNoCase(key,constants.KEYWORD_LEVEL3_LESS_THAN)){
		}else if(self.stringEqualNoCase(key,constants.KEYWORD_LEVEL3_BETWEEN)){
		}else if(self.stringEqualNoCase(key,constants.KEYWORD_LEVEL3_LIKE)){
		}else{
			if(typeof conds[key] === 'string'){
				finalClause = finalClause + key + "='" + conds[key] +"'";
			}else if(typeof conds[key] === 'boolean' || typeof conds[key] === 'number'){
				finalClause = finalClause + key + "=" + conds[key];
			}else{

				throw JSON.stringify([conds]) + " does not have simple value.";
			};
			
		};

	});



*/

module.exports = WhereBuilder;




