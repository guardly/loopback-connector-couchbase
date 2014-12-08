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
	self.EClog(spaces + "    OrderBuilder.prototype.buildClause : " + JSON.stringify([orderList]) + ", type is: " + typeof orderList);

	if(typeof orderList == "string"){//format like :  "id DESC"
		finalClause = finalClause + " " + orderList;
	}else{ //we expect the orderList to be an array, like: ["id DESC","name ASC"]   or ["id DESC"]
		var i = 0;
		for(i=0;i<orderList.length;i++){
			if(i==0){
				finalClause = finalClause + " ";
			};
			finalClause = finalClause + orderList[i];
			if(i<(orderList.length-1)){
				finalClause = finalClause + ",";
			};
		};


	}

	return finalClause;
};


module.exports = OrderBuilder;






