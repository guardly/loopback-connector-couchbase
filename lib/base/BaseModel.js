var debug = require('debug')('connector:couchbase');
var allConstants = require('./constants.js');
var basemodel = function(){
};
basemodel.prototype.EClog = function(messageStr){
	//console.log("      CB LOG: " + messageStr);
	debug("      " + messageStr);
};

basemodel.prototype.getConstants = function(){
	return allConstants;
};

basemodel.prototype.stringEqualNoCase = function(s1,s2){
	return s1.toUpperCase()===s2.toUpperCase();
};

basemodel.prototype.escapeFieldWithBackTick = function(field){
	return "`" + field + "`";
};

module.exports = basemodel;		
