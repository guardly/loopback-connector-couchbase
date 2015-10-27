function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

define("KEYWORD_CONVENTION_DOCID", "id");

define("KEYWORD_PRESERVED_COUCHBASE", "couchbase");
define("KEYWORD_PRESERVED_KEYNAME", "preserve");

