/**
	The public interface of the builder which interprets and converts the ORDER keyword
	This is the main entrance of building  ORDER part

	The orderList could follow the following format:
		["id DESC","name ASC"]
		or
		"id DESC"

*/
var BaseModel = require('../base/BaseModel.js');
var util = require('util');   
var spaces = "    ";//4 spaces
var OrderBuilder = function(orderList){
	var currentOrderList = orderList;
	this.getOrderList = function(){
		return currentOrderList;
	};	

	/*
	this.getFingerPrintBuilder = function(){
		var fingerPrintBuilderClass = require('./FingerPrintBuilder.js');
		return new fingerPrintBuilderClass();
	};
*/
	
};
util.inherits(OrderBuilder, BaseModel);

/**
	The main entrance method interpreting and building the clauses
*/
OrderBuilder.prototype.buildClause = function(){
	var self = this;
	var orderList = this.getOrderList();
	//var constants = this.getConstants();
	var finalClause = "ORDER BY";
	//self.EClog(spaces + "    OrderBuilder.prototype.buildClause : " + JSON.stringify([orderList]) + ", type is: " + typeof orderList);

	if(typeof orderList == "string"){//format like :  "id DESC"
	;
		finalClause = finalClause + " " + escapeOneOrderBy(orderList,self);
	}else{ //we expect the orderList to be an array, like: ["id DESC","name ASC"]   or ["id DESC"]
		var i = 0;
		for(i=0;i<orderList.length;i++){
			if(i==0){
				finalClause = finalClause + " ";
			};
			finalClause = finalClause + escapeOneOrderBy(orderList[i],self);
			if(i<(orderList.length-1)){
				finalClause = finalClause + ",";
			};
		};


	}

	return finalClause;
};

/*
	Escape the field name with back-tick in a order-by condition.
	An order-by condition is something like : "id DESC"  or  just "id"  (means "id ASC")
	There should be only one condition, should NOT be like: "id DESC name ASC"

	The expected result would be like:  `id` DESC
*/
var escapeOneOrderBy = function(orderCondition,self){
	var elementArr = orderCondition.split(" ");
	//self.EClog(spaces + "    OrderBuilder escapeOneOrderBy()   elementArr: " + JSON.stringify([elementArr]) + ", type is: " + elementArr.length);

	if(elementArr.length==1){
		return self.escapeFieldWithBackTick(orderCondition) + " ASC";
	}else if (elementArr.length==2){
		return self.escapeFieldWithBackTick(elementArr[0]) + " " + elementArr[1].toUpperCase();
	};
	throw "The ORDER BY clause '" + orderCondition + "' has illegal syntax";
};



module.exports = OrderBuilder;






