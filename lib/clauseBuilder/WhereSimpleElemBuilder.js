
var BaseModel = require('../base/BaseModel.js');
var util = require('util');   
var spaces = "    ";//4 spaces
var WhereSimpleElementBuilder = function(conds){
	var currentConds = conds;
	this.getConditions = function(){
		return currentConds;
	};	
};
util.inherits(WhereSimpleElementBuilder, BaseModel);

/*
	Builds the final N1QL compatible clause
*/
WhereSimpleElementBuilder.prototype.buildClause = function(){
	var self = this;
	var conds = this.getConditions();
	
	var allkeys = Object.keys(conds);
	if(allkeys.length === 0){
		throw JSON.stringify([conds]) + " does not have valid keys.";
	}

	var firstKey = allkeys[0];

	if(typeof conds[firstKey] === 'object'){
		return readObjectElement(firstKey,conds[firstKey],self);
	}else{  
		return readkeyValuePair(firstKey,conds[firstKey],self);
	}
	return "";
};

/*
	for the clause like "keyname":"value" only
*/
var readkeyValuePair = function(keyname,val,self){
	var finalClause = self.escapeFieldWithBackTick(keyname) + "="; //would contain the whole clause that should be returned to the caller side
	finalClause = concatValuePart(finalClause,val);
	return finalClause;
};

/*
	decides how to concat the value part of the key-value pair
*/
var concatValuePart = function(finalClause,val){
	if(typeof val === 'string'){
		finalClause = finalClause + "'" + val +"'";
	}else if(typeof val === 'boolean' || typeof val === 'number'){
		finalClause = finalClause + val;
	}else{
		throw JSON.stringify([val]) + " has invalid type : " + typeof val;
	}
	return finalClause;
};

var readObjectElement = function(keyname,conds,self){
	var finalClause = self.escapeFieldWithBackTick(keyname) + " "; //would contain the whole clause that should be returned to the caller side
	var allkeys = Object.keys(conds);
	if(allkeys.length === 0){
		throw JSON.stringify([conds]) + " does not have valid keys.";
	}
	var firstKey = allkeys[0];
	var constants = self.getConstants();
	if (self.stringEqualNoCase(firstKey,constants.KEYWORD_LEVEL3_GREAT_THAN)){
		finalClause = finalClause + ">";
		finalClause = concatValuePart(finalClause,conds[firstKey]);
	}else if (self.stringEqualNoCase(firstKey,constants.KEYWORD_LEVEL3_LESS_THAN)){
		finalClause = finalClause + "<";
		finalClause = concatValuePart(finalClause,conds[firstKey]);
	}else if (self.stringEqualNoCase(firstKey,constants.KEYWORD_LEVEL3_LIKE)){
		finalClause = finalClause + " " + firstKey.toUpperCase() + " '" + conds[firstKey] + "'";
	}else if (self.stringEqualNoCase(firstKey,constants.KEYWORD_LEVEL3_BETWEEN)){
		var arrVals = conds[firstKey];
		if(arrVals.length < 2){
			throw "the values of the "+ firstKey + " statement are wrong: " + JSON.stringify([conds]);
		}
		finalClause =  finalClause + " " + firstKey.toUpperCase()  + " ";
		finalClause = concatValuePart(finalClause,arrVals[0]);
		finalClause =  finalClause + " AND ";
		finalClause = concatValuePart(finalClause,arrVals[1]);

	}else{
		throw firstKey + " is an unknown key";

	}
	return finalClause;
};

module.exports = WhereSimpleElementBuilder;