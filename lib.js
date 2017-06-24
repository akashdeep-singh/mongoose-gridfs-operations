'use strict';

const fs = require('fs');
const Grid = require('gridfs-stream');

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
exports.copyFile = function (mongoose, sourcefilename, sourceprefix = '', destfilename, destprefix='', done) {
  Grid.mongo = mongoose.mongo;

  let gfs = Grid(mongoose.connection.db);

  let fileOptions = {
    filename: prefix.length ? prefix + '.' + sourcefilename : sourcefilename
  };

  gfs.exist(fileOptions, function (err, found) {
    if (found) {
      let readstream = gfs.createReadStream(fileOptions);
      let fs_write_stream = fs.createWriteStream(prefix.length ? prefix + '.' + destfilename : destfilename);
      readstream.pipe(fs_write_stream);
      fs_write_stream.on('close', function () {
        done (null);
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
