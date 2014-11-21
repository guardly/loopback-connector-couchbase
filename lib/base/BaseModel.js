var allConstants = require('./constants.js');
var basemodel = function(){
};
basemodel.prototype.EClog = function(messageStr){
	console.log("      EC LOG: " + messageStr);
};

basemodel.prototype.getConstants = function(){
	//this.EClog("-----" + allConstants.KEYWORD_WHERE);
	return allConstants;
};

basemodel.prototype.stringEqualNoCase = function(s1,s2){
	return s1.toUpperCase()===s2.toUpperCase();
};

module.exports = basemodel;		
