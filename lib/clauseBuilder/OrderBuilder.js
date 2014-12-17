
var BaseModel = require('../base/BaseModel.js');
var util = require('util');   
var spaces = "    ";//4 spaces
var OrderBuilder = function(orderList){
	var currentOrderList = orderList;
	this.getOrderList = function(){
		return currentOrderList;
	};
};
util.inherits(OrderBuilder, BaseModel);

/**
	The main entrance method interpreting and building the clauses
*/
OrderBuilder.prototype.buildClause = function(){
	var self = this;
	var orderList = this.getOrderList();
	var finalClause = "ORDER BY";

	if(typeof orderList == "string"){
		finalClause = finalClause + " " + escapeOneOrderBy(orderList,self);
	}else{ 
		var i = 0;
		for(i=0;i<orderList.length;i++){
			if(i===0){
				finalClause = finalClause + " ";
			}
			finalClause = finalClause + escapeOneOrderBy(orderList[i],self);
			if(i<(orderList.length-1)){
				finalClause = finalClause + ",";
			}
		}
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
	if(elementArr.length==1){
		return self.escapeFieldWithBackTick(orderCondition) + " ASC";
	}else if (elementArr.length==2){
		return self.escapeFieldWithBackTick(elementArr[0]) + " " + elementArr[1].toUpperCase();
	}
	throw "The ORDER BY clause '" + orderCondition + "' has illegal syntax";
};

module.exports = OrderBuilder;