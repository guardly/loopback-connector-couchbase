/**
	The public interface of the builder which interprets and create WHERE CLAUSE
	This is the main entrance of building  WHERE CLAUSE
*/
var BaseModel = require('../base/BaseModel.js');
var util = require('util');   
var spaces = "    ";//4 spaces
var whereSimpleElementBuilderClass = require('./WhereSimpleElemBuilder.js');

var WhereBuilder = function(conds,model){
	var currentConds = conds;
	var currentModel = model;
	this.getConditions = function(){
		return currentConds;
	};	
	this.getCurrentModel = function(){
		return currentModel;
	};	
};
util.inherits(WhereBuilder, BaseModel);


WhereBuilder.prototype.buildClause = function(){
	var self = this;
	var conds = this.getConditions();
	var model = this.getCurrentModel();
	var constants = this.getConstants();
	var finalClause = "WHERE ";
	var clauses = new Array();

	self.EClog(spaces + "    WhereBuilder.prototype.buildClause()  conds: " + JSON.stringify([conds]) + ", model is: " + model);

	if(conds){
		Object.keys(conds).forEach(function (key) {
			self.EClog(spaces + spaces + "Doing the key: " + key);
			if (self.stringEqualNoCase(key,constants.KEYWORD_LEVEL2_AND) || self.stringEqualNoCase(key,constants.KEYWORD_LEVEL2_OR))
			{
				self.EClog(spaces + spaces + spaces + "Do the And/OR reading for the key: " + key);

				var resultClause = readAndOrPart(conds[key],self,constants,key);
				var cont = clauses.push(resultClause);
			}else{
				self.EClog(spaces + spaces + spaces + "Do the key/value pair reading for the key: " + key);
				var tempcond = {};
				tempcond[key] = conds[key];
				var resultClause = readSimpleElementPart(tempcond,self,constants);
				var cont = clauses.push(resultClause);
			}
		});
		var cont = clauses.push("(" + self.escapeFieldWithBackTick(constants.KEYWORD_CONVENTION_DOCTYPE) + "='" + model + "')");
		for(var i=0;i<clauses.length;i++){
			finalClause = finalClause + clauses[i];
			if(i<clauses.length-1){
				finalClause = finalClause + " AND ";
			}
		}
	}else{  //implicitly adds the docType=modelName
		if(model){
			finalClause = "WHERE (" + self.escapeFieldWithBackTick(constants.KEYWORD_CONVENTION_DOCTYPE) + "='" + model + "')";
		}
	}
	return finalClause;
};

/*
	Reads and converts the And/Or condition. The condition may have nested And/Or parts.
*/
var readAndOr = function(conds,theThis,constants,finalClause,keyName){
	var self = theThis;
	finalClause = finalClause + '(';
	var i = 0;
	for (i=0;i<conds.length;i++){
		var currentConds = conds[i];
		if(i>0){
			finalClause = finalClause + ' ' + keyName.toUpperCase() + ' ';
		}
		Object.keys(currentConds).forEach(function (key) {
			if (self.stringEqualNoCase(key,constants.KEYWORD_LEVEL2_AND) || self.stringEqualNoCase(key,constants.KEYWORD_LEVEL2_OR)){
				finalClause = readAndOr(currentConds[key],self,constants,finalClause,key);
			}else{
				finalClause = readSimpleElement(currentConds,self,constants,finalClause);
			}
		});
	}
	finalClause = finalClause + ')';
	return finalClause;
};


var readAndOrPart = function(conds,theThis,constants,keyName,resultClause){
	var self = theThis;
	if(resultClause){
		resultClause = resultClause + '(';	
	}else{
		var resultClause = '(';	
	}
	
	var i = 0;
	for (i=0;i<conds.length;i++){
		var currentConds = conds[i];
		if(i>0){
			resultClause = resultClause + ' ' + keyName.toUpperCase() + ' ';
		}
		Object.keys(currentConds).forEach(function (key) {
			if (self.stringEqualNoCase(key,constants.KEYWORD_LEVEL2_AND) || self.stringEqualNoCase(key,constants.KEYWORD_LEVEL2_OR)){
				resultClause = readAndOrPart(currentConds[key],self,constants,key,resultClause);
			}else{
				resultClause = readSimpleElement(currentConds,self,constants,resultClause);
			}
		});
	}
	resultClause = resultClause + ')';
	return resultClause;
};

/*
	Interprets and converts the simple element (no nested elements) of a where clause
*/
var readSimpleElement = function(conds,theThis,constants,resultClause){
	var self = theThis;
	resultClause = resultClause + readSimpleElementPart(conds,theThis,constants);
	return resultClause;
};
var readSimpleElementPart = function(conds,theThis,constants){
	var self = theThis;
	var resultClause = '(';
	var whereSimpleElementBuilderObj = new whereSimpleElementBuilderClass(conds);
	var simpleElemClause = whereSimpleElementBuilderObj.buildClause();

	resultClause = resultClause + simpleElemClause + ')';
	return resultClause;
};

module.exports = WhereBuilder;

