var assert = require("assert"); // node.js core module

var clauseBuilderClass = require("../clauseBuilder"); // node.js core module
var BaseModel = require('../base/BaseModel.js');
var util = require('util');  
var clauseBuilder = new clauseBuilderClass();

var test10 = '{"where":{"title":{"like":"M. st"}}}';
var test11 = '{"where":{"carClass":"fullsize"}}';

var test12 = '{"where":{"date":{"gt":"2014-04-01T18:30:00.000Z"}}}';
var test13 = '{"where":{"price":{"lt":10}}}';
var test14 = '{"where":{"price":{"between":["0","7"]}}}';


var test20 = '{"where":{"price":{"between":["0","7"]}},"limit":10,"offset":15,"order":["id DESC"],"skip":15}';
var test30 = '{"where":{"and":[{"title":"My Post"},{"content":"Hello"},{"price":{"between":["0","7"]}}]},"limit":10,"offset":15,"order":["id DESC","name ASC"],"skip":15}';
var test31 = '{"where":{"and":[{"or":[{"fname":"eric"},{"lname":"chou"},{"location":"toronto"}]},{"content":"Hello"},{"price":{"between":["0","7"]}}]}}';
var test33 = '{"where":{"and":[{"or":[{"fname":"eric"},{"lname":"chou"},{"location":"toronto"}]},{"content":"Hello"},{"price":{"between":["0","7"]}}]}}';




var test32 = '{"where":{"and":[{"or":[{"fname":"eric"},{"lname":"chou"},{"location":"toronto"}]},{"content":"Hello"},{"price":25}]}}';
var test34 = '{"fields":["id","name","address"],"where":{"and":[{"title":"My Post"},{"content":"Hello"},{"price":{"between":["0","7"]}}]},"limit":10,"offset":15,"order":["id DESC","name ASC"],"skip":15}';


describe('Basic Tests', function(){
  //--- dummy test---
  describe('--Dummy test', function(){
    it('should return -1 when the value is not present', function(){
      assert.equal(-1, [1,2,3].indexOf(4)); // 4 is not present in this array so indexOf returns -1
    });
  });

  //--- make sure the included module is an object---
  describe('--Check the referenced object', function(){
    it('clauseBuilder should be a valid object', function(){
      
      assert.equal(typeof clauseBuilder, 'object'); 
      assert.equal(typeof clauseBuilder.foo, 'function'); 
      assert.equal(typeof clauseBuilder.getConstants, 'function'); 
		clauseBuilder.foo();
    });
  });

  //--- test constant---
  describe('--Test whether the contants could be properly imported', function(){
    it('constant KEYWORD_LEVEL1_WHERE should have the value "where"', function(){
      assert.equal(typeof clauseBuilder.getConstants, 'function'); 
      var constants = clauseBuilder.getConstants();
      assert.equal(constants.KEYWORD_LEVEL1_WHERE, 'where'); 
      assert.equal(constants.KEYWORD_LEVEL1_WHERE.toUpperCase()==='WHERE', true); 
    });
  });


});

describe('Where Clause tests', function(){
 //--- test where clause : test10---
  describe('--Test the initialization of the ClaseBuilder', function(){
    it('ClaseBuilder instance should be a valid object', function(){
		var jsonConds = JSON.parse(test10);
		var clauseBuilderObj = clauseBuilder.getClauseBuilder(jsonConds,"beer-sample");
      assert.equal(typeof clauseBuilderObj, 'object'); 
      var constants = clauseBuilderObj.getConstants();
      assert.equal(constants.KEYWORD_LEVEL1_WHERE, 'where');
    });
  });
  describe('--Test the clauseBuilderObj.buildClause() with test11', function(){
    it('ClaseBuilder instance should be a valid object', function(){
		var jsonConds = JSON.parse(test11);
		var clauseBuilderObj = clauseBuilder.getClauseBuilder(jsonConds,"beer-sample");
    	var buildingResult = clauseBuilderObj.buildClause();
	    assert.equal(typeof clauseBuilderObj, 'object'); 

    });
  });
  describe('--Test the clauseBuilderObj.buildClause() with test32', function(){
    it('ClaseBuilder instance should be a valid object', function(){
		var jsonConds = JSON.parse(test32);
		var clauseBuilderObj = clauseBuilder.getClauseBuilder(jsonConds,"beer-sample");
    	var buildingResult = clauseBuilderObj.buildClause();
	    assert.equal(typeof clauseBuilderObj, 'object'); 

    });
  });
  describe('--Test the clauseBuilderObj.buildClause() with test13', function(){
    it('ClaseBuilder instance should be a valid object', function(){
		var jsonConds = JSON.parse(test13);
		var clauseBuilderObj = clauseBuilder.getClauseBuilder(jsonConds,"beer-sample");
    	var buildingResult = clauseBuilderObj.buildClause();
	    assert.equal(typeof clauseBuilderObj, 'object'); 

    });
  });
  describe('--Test the clauseBuilderObj.buildClause() with test31', function(){
    it('ClaseBuilder instance should be a valid object', function(){
		var jsonConds = JSON.parse(test31);
		var clauseBuilderObj = clauseBuilder.getClauseBuilder(jsonConds,"beer-sample");
    	var buildingResult = clauseBuilderObj.buildClause();
	    assert.equal(typeof clauseBuilderObj, 'object'); 

    });
  });

  describe('--Test the clauseBuilderObj.buildClause() with test30', function(){
    it('ClaseBuilder instance should be a valid object', function(){
		var jsonConds = JSON.parse(test30);
		var clauseBuilderObj = clauseBuilder.getClauseBuilder(jsonConds,"beer-sample");
    	var buildingResult = clauseBuilderObj.buildClause();
	    assert.equal(typeof clauseBuilderObj, 'object'); 

    });
  });
  describe('--Test the clauseBuilderObj.buildClause() with test34', function(){
    it('ClaseBuilder instance should be a valid object', function(){
    var jsonConds = JSON.parse(test34);
    var clauseBuilderObj = clauseBuilder.getClauseBuilder(jsonConds,"beer-sample");
      var buildingResult = clauseBuilderObj.buildClause();
      assert.equal(typeof clauseBuilderObj, 'object'); 

    });
  });

});