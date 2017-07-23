'use strict';

//const fs = require('fs');
const Grid = require('gridfs-stream');
const fs = require('fs');
const path = require('path');
const async = require('async');

// write to mongodb
exports.writeFile = function (mongoose, originalFilePath, filename, prefix = '', done) {
  Grid.mongo = mongoose.mongo;

  let gfs = Grid(mongoose.connection.db);

  // streaming to gridfs
  //filename to store in mongodb
  let writestream = gfs.createWriteStream({
    filename: prefix.length ? prefix + '.' + filename : filename
  });
  fs.createReadStream(originalFilePath).pipe(writestream);

  writestream.on('close', function (file) {
    // do something with `file`
    done(null, file);
  });

};

//read from mongodb
exports.readFile = function (mongoose, filename, prefix = '', done) {
  Grid.mongo = mongoose.mongo;

  let gfs = Grid(mongoose.connection.db);

  let fileOptions = {
    filename: prefix.length ? prefix + '.' + filename : filename
  };

  gfs.exist(fileOptions, function (err, found) {
    if (found) {
      let readstream = gfs.createReadStream(fileOptions);
      return done(null, readstream);
    } else if (err) {
      return done(err);
    } else {
      let error = new Error('File not found');
      error.code = 'ENOENT';
      return done(error);
    }
  });

};

// copy a file in mongodb
exports.copyFile = function (mongoose, sourcefilename, sourceprefix = '', destfilename, destprefix = '', done) {
  Grid.mongo = mongoose.mongo;

  let gfs = Grid(mongoose.connection.db);

  let fileOptions = {
    filename: sourceprefix.length ? sourceprefix + '.' + sourcefilename : sourcefilename
  };

  gfs.exist(fileOptions, function (err, found) {
    if (found) {
      let readstream = gfs.createReadStream(fileOptions);
      let writestream = gfs.createWriteStream({
        filename: destprefix.length ? destprefix + '.' + destfilename : destfilename
      });

      //let fs_write_stream = fs.createWriteStream(destprefix.length ? destprefix + '.' + destfilename : destfilename);
      readstream.pipe(writestream);
      /*fs_write_stream.on('close', function () {
        done (null);
      });*/
      writestream.on('close', function (file) {
        // do something with `file`
        done(null, file);
      });
    } else if (err) {
      return done(err);
    } else {
      let error = new Error('File not found');
      error.code = 'ENOENT';
      return done(error);
    }
  });

};

// upload all files in a directory to gridfs with directory name as prefix (non-recursive)
exports.writeFilesInDirectory = function (mongoose, pathToDirectory, done) {
  const prefix = path.basename(path.resolve(pathToDirectory));
  const fileList = __getFilesInDirectory(pathToDirectory);

  async.eachSeries(fileList, function (filePath, callback) {
    Grid.mongo = mongoose.mongo;

    let gfs = Grid(mongoose.connection.db);

    // streaming to gridfs
    //filename to store in mongodb
    let writestream = gfs.createWriteStream({
      filename: prefix + '.' + path.basename(path.resolve(filePath))
    });
    fs.createReadStream(filePath).pipe(writestream);

    writestream.on('close', function (file) {
      // do something with `file`
      callback(null, file);
    });

  }, function (err){
    done(err, 'Success');
  });

};

// helper function
function __getFilesInDirectory(dir, files_) {
  files_ = files_ || [];
  var files = fs.readdirSync(dir);
  for (var i in files) {
    var name = dir + '/' + files[i];
    if (!fs.statSync(name).isDirectory()) {
      files_.push(name);
    }
  }
  return files_;
}