# Mongoose Gridfs Operations

A simple library for working with mongoose and gridfs using node streams.

** This library is in experiment phase and not recommended for production use **

## Installation ##

```javascript
npm install --save mongoose-gridfs-operations // or npm i --save mongoose-gridfs-operations
```

## Getting Started ##

### Import the library ###

```javascript
var gridfsOps = require('mongoose-gridfs-operations');
```

### Function calls ###

```javascript

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

mongoose.connection.on('connected', function () {

  /**
  arguments:
  mongoose object
  source file path
  filename to be saved
  prefix or bucket name to be appended to filename in gridfs (optional)
  */
  gridfsOps.writeFile(mongoose, './abc.txt', 'abc.txt', 'mybucket' function (err, r) {
    console.log(err, r);
  });

  /**
  arguments:
  mongoose object
  filename to be looked up
  prefix or bucket name appended to filename in gridfs (optional)
  */
  gridfsOps.readFile(mongoose, 'abc.txt', 'mybucket' function (err, r) {
    console.log(err, r);
  });

  /**
  arguments:
  mongoose object
  source filename
  prefix or bucket name appended to source filename in gridfs (use '' if no prefix)
  destination filename
  prefix or bucket name to be appended to destination filename in gridfs (optional)
  */
  gridfsOps.copyFile(mongoose, 'abc.txt', 'mybucket', 'xyz.txt', 'otherbucket' function (err, r) {
    console.log(err, r);
  });

  /**
  mongoose object
  path to directory
  NOTE: this method is not recursive
  */
  gridfsOps.writeFilesInDirectory(mongoose, '.', function (err, r) {
    console.log(err, r);
  });




});

```