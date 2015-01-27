
## loopback-connector-couchbase

The Couchbase Connector module for for [loopback-datasource-juggler](http://docs.strongloop.com/loopback-datasource-juggler/).


### What is Couchbase Server?
Couchbase Server is a NoSQL document database for interactive web applications. It has a flexible data model, is easily scalable, provides consistent high performance and is "always-on", meaning it can serve application data 24 hours, 7 days a week.


### What is N1QL?
N1QL (pronounced "Nickel") is a next generation query language for Couchbase Server. N1QL presents easy and familiar abstractions to quickly develop scalable applications that work with next generation database systems. It allows for joins, filter expressions, aggregate expressions and many other features to build a rich application. 


### Getting Started
Before installing the connector module, make sure you've taken the appropriate steps to install and configure Couchbase Server and the N1QL Engine.

* Download and install [Couchbase Server](http://www.couchbase.com/nosql-databases/downloads).
* After the install completes confirm the Couchbase Administrator is running at http://localhost:8091
* Download the [N1QL Binaries](http://www.couchbase.com/nosql-databases/downloads#PreRelease)


### N1QL Tutorial
N1QL has an interactive online tutorial and a N1QL cheatsheet. The online tutorial is a good way to get started and play with N1QL in an easy, fun environment. The cheatsheet is a quick glance and easy reference of the N1QL syntax. NOTE: Not all capabilities of the N1QL Engine are supported in this connector. For more information on N1QL, see:

* [N1QL Cheatsheet](http://docs.couchbase.com/files/Couchbase-N1QL-CheatSheet.pdf)
* [Couchbase Language Tutorial](http://query.pub.couchbase.com/tutorial/#1)


### Running N1QL
To run N1QL on your local system:

Step 1:  Expand the package archive.
Step 2:  On the command line, navigate to your local N1QL directory.
Step 3:  Run ./start_tutorial.sh (Unix)
             ./start_tutorial.bat (Windows)
Step 4:  Open http://localhost:8093/tutorial in your browser to use the tutorial on your local server.
       
To connect N1QL with your Couchbase Server:

    ./cbq-engine -datastore=http://[server_name]:8091/
  

To use the command-line interactive query tool:

    ./cbq -engine=http://[couchbase-query-engine-server-name]:8093/
  
   
Step 5: Before issuing queries against a Couchbase bucket, run the following command from the query command line:

    CREATE PRIMARY INDEX ON [bucket-name];



### Installing the connector
```npm install couchbase```

```npm install loopback-connector-couchbase```


## Connector settings

The connector can be configured using the following settings from the data source.
* host  (default to 'localhost'): The host name or ip address of the Couchbase server
* port (default to 8091): The port number of the Couchbase server
* n1qlport (default to 8093): The port number of the N1QL Engine
* database: The Couchbase bucket
* connectionTimeout (default to 20000): The connection timeout value
* operationTimeout (default to 15000): The operation timeout value

**NOTE**: Unlike other datasources, Couchbase does not require user credentials to access a bucket/database.  Buckets can be protected with a password, however, the N1QL Developer Pre-release 3 currently does not support querying password protected buckets.  As this capability is released for N1QL, we will update the connector settings.


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

### Example Application
We have also put together a small example application which uses the **beer-sample** bucket which is an optional add-on when installing Couchbase Server. There is currently no client front-end for the example app, however you can use the LoopBack Explorer to interact with the API and connector.

* [loopback-example-couchbase](https://github.com/guardly/loopback-example-couchbase): Example application

### Working with data
Please refer to the official [LoopBack Documentation](http://docs.strongloop.com/display/public/LB/Working+with+data) for how to work with models and data.


### More to come!!!
* Write additional tests
* Improve debugging and logging
* etc!!!

