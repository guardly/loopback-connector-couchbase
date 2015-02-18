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
var test15 = '{"where":{"title":{"nlike":"eric chou"}}}';
var test16 = '{"where":{"carClass":{"neq":"compact size"}}}';

var test20 = '{"where":{"price":{"between":["0","7"]}},"limit":10,"offset":15,"order":["id DESC"],"skip":15}';
var test30 = '{"where":{"and":[{"title":"My Post"},{"content":"Hello"},{"price":{"between":["0","7"]}}]},"limit":10,"offset":15,"order":["id DESC","name ASC"],"skip":15}';
var test31 = '{"where":{"and":[{"or":[{"fname":"eric"},{"lname":"chou"},{"location":"toronto"}]},{"content":"Hello"},{"price":{"between":["0","7"]}}]}}';
var test33 = '{"where":{"and":[{"or":[{"fname":"eric"},{"lname":"chou"},{"location":"toronto"}]},{"content":"Hello"},{"price":{"between":["0","7"]}}]}}';

var test32 = '{"where":{"and":[{"or":[{"fname":"eric"},{"lname":"chou"},{"location":"toronto"}]},{"content":"Hello"},{"price":25}]}}';
var test34 = '{"fields":["id","name","address"],"where":{"and":[{"title":"My Post"},{"content":"Hello"},{"price":{"between":["0","7"]}}]},"limit":10,"offset":15,"order":["id DESC","name ASC"],"skip":15}';

var test35 = '{"where":{"customerId":4},"fields":["id","code","label","icon_android","icon_ios","icon_desktop","duress"],"order":["order ASC"]}';
//var test36 = '{"where":{"id":"67b539c7-6928-4502-a509-427953250860","customerId":4},"limit":1,"offset":0,"skip":0}';
var test36 = '{"where":{"carClass":"fullsize","carModel":"toyota","and":[{"title":"My Post"},{"content":"Hello"},{"price":{"between":["0","7"]}}]}}';;
var test37 = '{"fields":["channel"],"where":{"userId":{"inq":[54808,54832,54840,54833]}}}';
var test38 = '{"fields":["channel"],"where":{"name":{"nin":["eric chou","anna shen","grace zhou"]}}}';
var test39 = '{"id":"21st_amendment_brewery_cafe","fields":["id"]}';
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
			assert.equal(typeof clauseBuilder.getConstants, 'function'); 
			
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
			var clauseBuilderObj = clauseBuilder.getClauseBuilder(jsonConds,"beer-sample","brewery");
			assert.equal(typeof clauseBuilderObj, 'object'); 
			var constants = clauseBuilderObj.getConstants();
			assert.equal(constants.KEYWORD_LEVEL1_WHERE, 'where');
		});
	});
	describe('--Test the clauseBuilderObj.buildClause() with test11', function(){
		it('ClaseBuilder instance should be a valid object', function(){
			var jsonConds = JSON.parse(test11);
			var clauseBuilderObj = clauseBuilder.getClauseBuilder(jsonConds,"beer-sample","brewery");
			var buildingResult = clauseBuilderObj.buildClause();
			assert.equal(typeof clauseBuilderObj, 'object'); 
		});
	});
	describe('--Test the clauseBuilderObj.buildClause() with test12', function(){
		it('ClaseBuilder instance should be a valid object', function(){
			var jsonConds = JSON.parse(test12);
			var clauseBuilderObj = clauseBuilder.getClauseBuilder(jsonConds,"beer-sample","brewery");
			var buildingResult = clauseBuilderObj.buildClause();
			assert.equal(typeof clauseBuilderObj, 'object'); 
		});
	});
	describe('--Test the clauseBuilderObj.buildClause() with test13', function(){
		it('ClaseBuilder instance should be a valid object', function(){
			var jsonConds = JSON.parse(test13);
			var clauseBuilderObj = clauseBuilder.getClauseBuilder(jsonConds,"beer-sample","brewery");
			var buildingResult = clauseBuilderObj.buildClause();
			assert.equal(typeof clauseBuilderObj, 'object'); 
		});
	});
	describe('--Test the clauseBuilderObj.buildClause() with test14', function(){
		it('ClaseBuilder instance should be a valid object', function(){
			var jsonConds = JSON.parse(test14);
			var clauseBuilderObj = clauseBuilder.getClauseBuilder(jsonConds,"beer-sample","brewery");
			var buildingResult = clauseBuilderObj.buildClause();
			assert.equal(typeof clauseBuilderObj, 'object'); 
		});
	});
	describe('--Test the clauseBuilderObj.buildClause() with test15', function(){
		it('ClaseBuilder instance should be a valid object', function(){
			var jsonConds = JSON.parse(test15);
			var clauseBuilderObj = clauseBuilder.getClauseBuilder(jsonConds,"beer-sample","brewery");
			var buildingResult = clauseBuilderObj.buildClause();
			assert.equal(typeof clauseBuilderObj, 'object'); 
		});
	});
	describe('--Test the clauseBuilderObj.buildClause() with test16', function(){
		it('ClaseBuilder instance should be a valid object', function(){
			var jsonConds = JSON.parse(test16);
			var clauseBuilderObj = clauseBuilder.getClauseBuilder(jsonConds,"beer-sample","brewery");
			var buildingResult = clauseBuilderObj.buildClause();
			assert.equal(typeof clauseBuilderObj, 'object'); 
		});
	});
	describe('--Test the clauseBuilderObj.buildClause() with test20', function(){
		it('ClaseBuilder instance should be a valid object', function(){
			var jsonConds = JSON.parse(test20);
			var clauseBuilderObj = clauseBuilder.getClauseBuilder(jsonConds,"beer-sample","brewery");
			var buildingResult = clauseBuilderObj.buildClause();
			assert.equal(typeof clauseBuilderObj, 'object'); 
		});
	});
	describe('--Test the clauseBuilderObj.buildClause() with test30', function(){
		it('ClaseBuilder instance should be a valid object', function(){
			var jsonConds = JSON.parse(test30);
			var clauseBuilderObj = clauseBuilder.getClauseBuilder(jsonConds,"beer-sample","brewery");
			var buildingResult = clauseBuilderObj.buildClause();
			assert.equal(typeof clauseBuilderObj, 'object'); 
		});
	});
	describe('--Test the clauseBuilderObj.buildClause() with test31', function(){
		it('ClaseBuilder instance should be a valid object', function(){
			var jsonConds = JSON.parse(test31);
			var clauseBuilderObj = clauseBuilder.getClauseBuilder(jsonConds,"beer-sample","brewery");
			var buildingResult = clauseBuilderObj.buildClause();
			assert.equal(typeof clauseBuilderObj, 'object'); 
		});
	});
	describe('--Test the clauseBuilderObj.buildClause() with test32', function(){
		it('ClaseBuilder instance should be a valid object', function(){
			var jsonConds = JSON.parse(test32);
			var clauseBuilderObj = clauseBuilder.getClauseBuilder(jsonConds,"beer-sample","brewery");
			var buildingResult = clauseBuilderObj.buildClause();
			assert.equal(typeof clauseBuilderObj, 'object');
		});
	});
	describe('--Test the clauseBuilderObj.buildClause() with test33', function(){
		it('ClaseBuilder instance should be a valid object', function(){
			var jsonConds = JSON.parse(test33);
			var clauseBuilderObj = clauseBuilder.getClauseBuilder(jsonConds,"beer-sample","brewery");
			var buildingResult = clauseBuilderObj.buildClause();
			assert.equal(typeof clauseBuilderObj, 'object'); 
		});
	});

	describe('--Test the clauseBuilderObj.buildClause() with test34', function(){
		it('ClaseBuilder instance should be a valid object', function(){
			var jsonConds = JSON.parse(test34);
			var clauseBuilderObj = clauseBuilder.getClauseBuilder(jsonConds,"beer-sample","brewery");
			var buildingResult = clauseBuilderObj.buildClause();
			assert.equal(typeof clauseBuilderObj, 'object'); 
		});
	});
	describe('--Test the clauseBuilderObj.buildClause() with test35', function(){
		it('ClaseBuilder instance should be a valid object', function(){
			var jsonConds = JSON.parse(test35);
			var clauseBuilderObj = clauseBuilder.getClauseBuilder(jsonConds,"beer-sample","brewery");
			var buildingResult = clauseBuilderObj.buildClause();
			assert.equal(typeof clauseBuilderObj, 'object'); 

		});
	});
	describe('--Test the clauseBuilderObj.buildClause() with test36', function(){
		it('ClaseBuilder instance should be a valid object', function(){
			var jsonConds = JSON.parse(test36);
			var clauseBuilderObj = clauseBuilder.getClauseBuilder(jsonConds,"beer-sample","brewery");
			var buildingResult = clauseBuilderObj.buildClause();
			assert.equal(typeof clauseBuilderObj, 'object'); 

		});
	});
	describe('--Test the clauseBuilderObj.buildClause() with test37', function(){
		it('ClaseBuilder instance should be a valid object', function(){
			var jsonConds = JSON.parse(test37);
			var clauseBuilderObj = clauseBuilder.getClauseBuilder(jsonConds,"beer-sample","brewery");
			var buildingResult = clauseBuilderObj.buildClause();
			assert.equal(typeof clauseBuilderObj, 'object'); 
		});
	});
	describe('--Test the clauseBuilderObj.buildClause() with test38', function(){
		it('ClaseBuilder instance should be a valid object', function(){
			var jsonConds = JSON.parse(test38);
			var clauseBuilderObj = clauseBuilder.getClauseBuilder(jsonConds,"beer-sample","brewery");
			var buildingResult = clauseBuilderObj.buildClause();
			assert.equal(typeof clauseBuilderObj, 'object'); 
		});
	});
	describe('--Test the clauseBuilderObj.buildClause() with test39', function(){
		it('ClaseBuilder instance should be a valid object', function(){
			var jsonConds = JSON.parse(test39);
			var clauseBuilderObj = clauseBuilder.getClauseBuilder(jsonConds,"beer-sample","brewery");
			var buildingResult = clauseBuilderObj.buildClause();
			assert.equal(typeof clauseBuilderObj, 'object'); 
		});
	});
});