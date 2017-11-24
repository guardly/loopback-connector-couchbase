
## loopback-connector-couchbase without N1QL

The Couchbase Connector module for for [loopback-datasource-juggler](http://docs.strongloop.com/loopback-datasource-juggler/).

This connector does not use N1QL. That means you can not simply lookup data you do not have view setup and defined in the configuration. So you have to be very careful which data you query (that is why I put the expert in the name). If you for example have a relationship setup and you want to use it to query related data it will fail till you create * setup a view which allows it. Actually querying data will probably almost always fail if you do not use "findById". So you have to write your application a very specific way for it to work but the price for that effort is high performance. So for the most people using the N1QL implementation (from which I did fork) is probably better: https://github.com/guardly/loopback-connector-couchbase

Btw. is also not really well tested. Did just fork to work best for my own needs of high performance (and no random query need).

### What is Couchbase Server?
Couchbase Server is a NoSQL document database for interactive web applications. It has a flexible data model, is easily scalable, provides consistent high performance and is "always-on", meaning it can serve application data 24 hours, 7 days a week.


### Getting Started
Before installing the connector module, make sure you've taken the appropriate steps to install and configure Couchbase Server.

* Download and install [Couchbase Server](http://www.couchbase.com/nosql-databases/downloads).
* After the install completes confirm the Couchbase Administrator is running at http://localhost:8091


### Installing the connector
```npm install couchbase```

```npm install loopback-connector-couchbase-expert```


## Connector settings

The connector can be configured using the following settings from the data source.
* host  (default to 'localhost'): The host name or ip address of the Couchbase server
* port (default to 8091): The port number of the Couchbase server
* database: The Couchbase bucket
* user: The user to access Couchbase cluster
* password: The password to access Couchbase cluster
* connectionTimeout (default to 20000): The connection timeout value
* operationTimeout (default to 15000): The operation timeout value
* mappings: Prefixes for values which get used as key (example below)
* views: Views which can be used to loopup data


## Example Configuration

```json
  {
    "couchbase": {
      "host": "localhost",
      "port": "8091",
      "database": "myBucket",
      "name": "couchbase-expert",
      "user": "my-user",
      "password": "my-password",
      "connector": "couchbase-expert",
      "mappings": {
        "user": {
          "email": "u::"
        }
      },
      "views": {
        "Orders": {
          "userId": {
            "designDocument": "loopback",
            "viewName": "orders_userid"
          }
        }
      }
    }
  }

```

Everything should be clear the only interesting parts are mappings & views.

* "mappings" defines id-prefixes. So if somebody queries for a user by email then the query will be rewritten to a lookup by id. So if I look for {"email": "test@example.com"} it will do instead a look for the id: "u::test@example.com"
* "views" defines views which can be used to loopup specific values. The example bellow allows to lookup "order" by "userId" by using the view "orders_userid" under a design-document called "loopback". For it to work a view like this has to be setup:

```
  function (doc, meta) {
    if (doc.docType && doc.docType == "Order" && doc.userId) {
       emit(doc.userId, null);
    }
  }
```


## Model definition for Couchbase Documents

**NOTE**: By default, all Couchbase documents will be created with a docType property which matches the model name. To set a Document Key yourself, simply pass in an id value in the data and the connector will use this id as the id property in the Document as well as for the Document Key itself.  If no id is passed in, the connector will auto-generate a UUID to be used as the id property and Document Key. These nuances are a work in progress and we would be interested in hearing other developer's use-cases so that we can improve the connector to be as flexible as possible.

The model definition consists of the following properties:

```json

  {
  "name": "Brewery",
  "base": "PersistedModel",
  "properties": {
    "id": {
      "type": "String",
      "id": true,
      "required": true,
      "index": true
    },
    "propertyOne": {
      "type": "String",
      "required": false
    },
    "propertyTwo": {
      "type": "Object",
      "required": false
    }
  },
  "validations": [],
  "relations": {
    "actions": {
      "type": "hasMany",
      "model": "Beer",
      "foreignKey": "breweryId"
    }
  },
  "acls": [],
  "methods": []
}

```

### Working with data
Please refer to the official [LoopBack Documentation](http://docs.strongloop.com/display/public/LB/Working+with+data) for how to work with models and data.


### More to come!!!
* Write tests
* Improve debugging and logging
* etc!!!

