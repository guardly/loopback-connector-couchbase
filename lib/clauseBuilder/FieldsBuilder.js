/**
	The public interface of the builder which interprets and converts the FIELDS keyword
	This is the main entrance of building  FIELDS part
*/
var BaseModel = require('../base/BaseModel.js');
var util = require('util');   
var spaces = "    ";//4 spaces
var FieldsBuilder = function(fields){
	//this.EClog("      FieldsBuilder-- the fields : " + fields);
	var currentFields = fields;
	this.getFields = function(){
		return currentFields;
	};	

	/*
	this.getFingerPrintBuilder = function(){
		var fingerPrintBuilderClass = require('./FingerPrintBuilder.js');
		return new fingerPrintBuilderClass();
	};
*/
	
};
util.inherits(FieldsBuilder, BaseModel);

FieldsBuilder.prototype.buildClause = function(){
	var self = this;
	var fields = this.getFields();


	//var constants = this.getConstants();
	var finalClause = "SELECT "; //would contain the whole where clause in string
	var i = 0;
	for(i=0;i<fields.length;i++){
		//self.EClog(spaces + spaces + "Doing the key: " + fields[i]);
		if(i>0){
			finalClause = finalClause + ",";
		};
		finalClause = finalClause + self.escapeFieldWithBackTick(fields[i]);
	};
	finalClause = finalClause + " FROM ";
	/*
	Object.keys(fields).forEach(function (key) {
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
			*/
	return finalClause;
};


module.exports = FieldsBuilder;

