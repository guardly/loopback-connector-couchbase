/**
	The public interface of the builder which interprets and converts the FIELDS keyword
	This is the main entrance of building  FIELDS part
*/
var BaseModel = require('../base/BaseModel.js');
var util = require('util');   
var spaces = "    ";//4 spaces
var debug = require('debug')('connector:builder');
var FieldsBuilder = function(fields){

	var currentFields = fields;
	this.getFields = function(){
		return currentFields;
	};	
};
util.inherits(FieldsBuilder, BaseModel);

FieldsBuilder.prototype.buildClause = function(){
	var self = this;
	var fields = this.getFields();
	var finalClause = "SELECT ";
	var i = 0;

	for(i=0;i<fields.length;i++){
		if(i>0){
			finalClause = finalClause + ",";
		}
		finalClause = finalClause + self.escapeFieldWithBackTick(fields[i]);
	}
	finalClause = finalClause + " FROM ";
	return finalClause;
};

module.exports = FieldsBuilder;