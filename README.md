
## loopback-connector-couchbase

The Couchbase Connector module for for [loopback-datasource-juggler](http://docs.strongloop.com/loopback-datasource-juggler/).


### What is Couchbase Server?
Couchbase Server is a NoSQL document database for interactive web applications. It has a flexible data model, is easily scalable, provides consistent high performance and is "always-on", meaning it can serve application data 24 hours, 7 days a week.


### What is N1QL
N1QL (pronounced "Nickel") is a next generation query language for Couchbase Server. N1QL presents easy and familiar abstractions to quickly develop scalable applications that work with next generation database systems. It allows for joins, filter expressions, aggregate expressions and many other features to build a rich application. 


### Getting Started
Before installing the connector module, make sure you've taken the appropriate steps to install and configure Couchbase Server and the N1QL Engine.

* Download and install [Couchbase Server](http://www.couchbase.com/nosql-databases/downloads).
* After the install completes confirm the Couchbase Administrator is running at http://localhost:8091
* Download the [N1QL Binaries](http://www.couchbase.com/nosql-databases/downloads#PreRelease)


### N1QL Tutorial
N1QL has an interactive online tutorial and a N1QL cheatsheet. The online tutorial is a good way to get started and play with N1QL in an easy, fun environment. The cheatsheet is a quick glance and easy reference of the N1QL syntax. NOTE: Not all capabilities of the N1QL Engine are supported in this connector. For more information on N1QL, see:

*[N1QL Cheatsheet](http://docs.couchbase.com/files/Couchbase-N1QL-CheatSheet.pdf)
*[Couchbase Language Tutorial](http://query.pub.couchbase.com/tutorial/#1)


### Running N1QL
To run N1QL on your local system:

Step 1:  Expand the package archive.
Step 2:  On the command line, navigate to your local N1QL directory.
Step 3:  Run ./start_tutorial.sh (Unix)
             ./start_tutorial.bat (Windows)
Step 4:  Open http://localhost:8093/tutorial in your browser to use the tutorial on your local server.
       
To connect N1QL with your Couchbase Server:

    ./cbq-engine -couchbase http://[server_name]:8091/
  

To use the command-line interactive query tool:

    ./cbq-engine=http://[couchbase-query-engine-server-name]:8093/
  
   
Step 5: Before issuing queries against a Couchbase bucket, run the following command from the query command line:

    CREATE PRIMARY INDEX ON [bucket-name]



### Installing the connector
Once you have  [Bower](http://bower.io/) to manage front-end dependencies:

```npm install loopback-connector-couchbase```


## Connector settings

The connector can be configured using the following settings from the data source.
* url: The URL to the database, such as 'postgres://test:mypassword@localhost:5432/dev'
* host or hostname (default to 'localhost'): The host name or ip address of the PostgreSQL DB server
* port (default to 5432): The port number of the PostgreSQL DB server
* username or user: The user name to connect to the PostgreSQL DB
* password: The password
* database: The PostgreSQL database name
* debug (default to false)

**NOTE**: By default, the 'public' schema is used for all tables.

The PostgreSQL connector uses [node-postgres](https://github.com/brianc/node-postgres) as the driver. See more
information about configuration parameters, check [https://github.com/brianc/node-postgres/wiki/Client#constructors](https://github.com/brianc/node-postgres/wiki/Client#constructors).

## Discovering Models

PostgreSQL data sources allow you to discover model definition information from existing postgresql databases. See the following APIs:

 - [dataSource.discoverModelDefinitions([username], fn)](https://github.com/strongloop/loopback#datasourcediscovermodeldefinitionsusername-fn)
 - [dataSource.discoverSchema([owner], name, fn)](https://github.com/strongloop/loopback#datasourcediscoverschemaowner-name-fn)


## Model definition for PostgreSQL

The model definition consists of the following properties:

* name: Name of the model, by default, it's the camel case of the table
* options: Model level operations and mapping to PostgreSQL schema/table
* properties: Property definitions, including mapping to PostgreSQL column

```json

    {"name": "Inventory", "options": {
      "idInjection": false,
      "postgresql": {
        "schema": "strongloop",
        "table": "inventory"
      }
    }, "properties": {
      "id": {
        "type": "String",
        "required": false,
        "length": 64,
        "precision": null,
        "scale": null,
        "postgresql": {
          "columnName": "id",
          "dataType": "character varying",
          "dataLength": 64,
          "dataPrecision": null,
          "dataScale": null,
          "nullable": "NO"
        }
      },
      "productId": {
        "type": "String",
        "required": false,
        "length": 20,
        "precision": null,
        "scale": null,
        "id": 1,
        "postgresql": {
          "columnName": "product_id",
          "dataType": "character varying",
          "dataLength": 20,
          "dataPrecision": null,
          "dataScale": null,
          "nullable": "YES"
        }
      },
      "locationId": {
        "type": "String",
        "required": false,
        "length": 20,
        "precision": null,
        "scale": null,
        "id": 1,
        "postgresql": {
          "columnName": "location_id",
          "dataType": "character varying",
          "dataLength": 20,
          "dataPrecision": null,
          "dataScale": null,
          "nullable": "YES"
        }
      },
      "available": {
        "type": "Number",
        "required": false,
        "length": null,
        "precision": 32,
        "scale": 0,
        "postgresql": {
          "columnName": "available",
          "dataType": "integer",
          "dataLength": null,
          "dataPrecision": 32,
          "dataScale": 0,
          "nullable": "YES"
        }
      },
      "total": {
        "type": "Number",
        "required": false,
        "length": null,
        "precision": 32,
        "scale": 0,
        "postgresql": {
          "columnName": "total",
          "dataType": "integer",
          "dataLength": null,
          "dataPrecision": 32,
          "dataScale": 0,
          "nullable": "YES"
        }
      }
    }}

```

## Type Mapping

 - Number
 - Boolean
 - String
 - Object
 - Date
 - Array
 - Buffer

### JSON to PostgreSQL Types

* String|JSON|Text|default: VARCHAR, default length is 1024
* Number: INTEGER
* Date: TIMESTAMP WITH TIME ZONE
* Timestamp: TIMESTAMP WITH TIME ZONE
* Boolean: BOOLEAN

### PostgreSQL Types to JSON

* BOOLEAN: Boolean
* VARCHAR|CHARACTER VARYING|CHARACTER|CHAR|TEXT: String
* BYTEA: Binary;
* SMALLINT|INTEGER|BIGINT|DECIMAL|NUMERIC|REAL|DOUBLE|SERIAL|BIGSERIAL: Number
* DATE|TIMESTAMP|TIME: Date
* POINT: GeoPoint

## Destroying Models

Destroying models may result in errors due to foreign key integrity. Make sure
to delete any related models first before calling delete on model's with
relationships.

## Auto Migrate / Auto Update

After making changes to your model properties you must call `Model.automigrate()`
or `Model.autoupdate()`. Only call `Model.automigrate()` on new models
as it will drop existing tables.

LoopBack PostgreSQL connector creates the following schema objects for a given
model:

* A table, for example, PRODUCT under the 'public' schema within the database


## Running tests

    npm test

