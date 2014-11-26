function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

define("KEYWORD_LEVEL1_WHERE", "where");
define("KEYWORD_LEVEL1_FIELDS", "fields");
define("KEYWORD_LEVEL1_INCLUDE", "include");
define("KEYWORD_LEVEL1_LIMIT", "limit");
define("KEYWORD_LEVEL1_ORDER", "order");
define("KEYWORD_LEVEL1_SKIP", "skip");
define("KEYWORD_LEVEL1_OFFSET", "offset");

define("KEYWORD_LEVEL2_AND", "and");
define("KEYWORD_LEVEL2_OR", "or");


define("KEYWORD_LEVEL3_GREAT_THAN", "gt");
define("KEYWORD_LEVEL3_LESS_THAN", "lt");
define("KEYWORD_LEVEL3_BETWEEN", "between");
define("KEYWORD_LEVEL3_LIKE", "like");

//define("KEYWORD_LOOPBACK_CONVENTION_ID", "id");
define("KEYWORD_CONVENTION_DOCID", "id");
