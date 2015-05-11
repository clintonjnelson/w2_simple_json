'use strict';

var fs = require('fs');
var inherits = require('util').inherits;
var EventEmitter = require('events').EventEmitter;
var path = require('path');
var _ = require('lodash');

// Inherit Event Emitter Capabilities to Guide
var Guide = function() {};
inherits(Guide, EventEmitter);

var mongoose = module.exports = {
  Model: Model
}

function Model(resourceName, resourceSchema) {
  this.modelName = resourceName;
  this.schema = resourceSchema;
}

Model.prototype.create = function(obj, callback) {
  var count;
  var finalData;
  var error = null;
  var guide = new Guide;
  var newObj = obj;
  var database = {};
  var schemaTypes = Object.keys(this.schema);
  var that = this;

  guide.on('prepAndWrite', function() {
    guide.emit('gatherDocs');
  });

  guide.on('gatherDocs', function() {
    fs.readdir('./data', function(err, files) {
      if (files.length === 0) {
        count = 0;
        guide.emit('schemaFilter', database, count);
      } else {
        files.forEach(function(elem, index, origArr) {
          if ( (path.extname(elem) === '.json')) {
            fs.readFile( ('./data/'+elem), 'utf-8', function(err, data) {
              var objData = JSON.parse(data);
              if (err) throw error;

              database[objData.id] = JSON.stringify(objData);
              if (index === (files.length - 1)) {
                count = _.max(Object.keys(database));
                guide.emit('schemaFilter', database, count);
              }
            });
          }
        });
      }
    });
  });

  // Filter out non-schema properties
  guide.on('schemaFilter', function(db, oldCount) {
    Object.keys(newObj).forEach(function(elem, index, origArr) {
      if (!that.schema.hasOwnProperty(elem)) { delete newObj[elem]; }
      if (index === (origArr.length -1)) { guide.emit('writeDoc', db, oldCount); }
    });
  });

  // increment count & write new file
  guide.on('writeDoc', function(db, oldCount) {
    count = Number(oldCount) +1;
    newObj.id = count;
    fs.writeFile( ('./data/' + (count) + ".json"), JSON.stringify(newObj), function(err) {
      if (err) {
        throw err;
      }
      finalData = JSON.stringify(newObj);
      count += 1;
      console.log('File ' + count + '.json' + ' saved.');
      guide.emit('finish', finalData);
    });
  });

  guide.on('finish', function(data) {
    callback(error, data);
  });


  try {
    guide.emit('prepAndWrite'); // extra emitter for abstraction clarity
  } catch (e) {
    console.log('caught error: ', e)
    error = e;
  }
}

Model.prototype.update = function(updateId, upds, overwrite, callback) {
  var count;
  var finalData;
  var error = null;
  var guide = new Guide;
  var readData = {};
  var schemaTypes = Object.keys(this.schema);
  var that = this;
  var updates = upds;


  // Filter non-schema items out
  guide.on('filterUpdatesBySchema', function() {
    Object.keys(updates).forEach(function(elem, index, origArr) {
      if (!that.schema.hasOwnProperty(elem)) { delete updates[elem]; }
      if (index === (origArr.length -1)) { guide.emit('writeFile'); }
    });
  });

  guide.on('writeFile', function() {
    // overwrite
    if (overwrite) {
      fs.readdir('./data', function(err, files) {
        if (files.length === 0) {
          return callback(null, 'cannot update - id does not exist');
        } else {
          files.forEach(function(elem, index, origArr) {
            if ( (path.extname(elem) === '.json') && (path.basename(elem, '.json') === String(updateId)) ) {
              updates['id'] = updateId;
              console.log('ABOUT TO WRITE');
              fs.writeFile( ('./data/' + updateId + '.json'), JSON.stringify(updates), function(err, data) {
                if (err) throw err;
                callback(error, updates);
              });
            }
          });
        }
      });

    // NOT overwrite
    } else {
      fs.readFile( ('./data/' + updateId + '.json'), 'utf-8', function(err, data) {
        if (err) throw err;
        readData = JSON.parse(data);

        // iterate through & updated changed fields
        Object.keys(updates).forEach(function (elem, index, origArr) {
          readData[elem] = updates[elem];
          if ( index === (Object.keys(updates).length -1) )  {
            fs.writeFile( ('./data/' + updateId + '.json'), JSON.stringify(readData), function(err, data) {
              if (err) throw err;
              callback(error, readData);
            });
          }
        });
      });
    }
  });

  try {
    guide.emit('filterUpdatesBySchema'); // Start Process of Update
  } catch (e) {
    console.log('caught error: ', e)
    error = e;
    callback(error, null);
  }
}


Model.prototype.find = function(query, callback) {
  // var database = {};
  var database = [];
  var finalData;
  var error = null;
  var guide = new Guide;

  guide.on('gatherAllDocs', function() {
    fs.readdir('./data', function(err, files) {
      if (files.length === 0 ) guide.emit('done', []);
      files.forEach(function(elem, index, origArr) {
        var objData;
        if ( (path.extname(elem) === '.json')) {
          fs.readFile( ('./data/'+elem), 'utf-8', function(err, data) {
            if (err) throw error;

            database[database.length] = JSON.parse(data);
            if (index === (files.length - 1)) {
              guide.emit('done', database);
            }
          });
        }
      });
    });
  });

  guide.on('done', function(db) {
    callback(error, db);
  });

  try {
    if (Object.keys(query).length === 0) guide.emit('gatherAllDocs');
  } catch (e) {
    console.log(e);
    callback(e);
  }
};

Model.prototype.remove = function(deleteId, callback) {
  var database = {};
  var finalData;
  var error = null;
  var guide = new Guide;
  var that = this;

  try {
    fs.readdir('./data', function(err, files) {
      files.forEach(function(elem, index, origArr) {
        if( (path.extname(elem) === '.json') && (path.basename(elem, '.json') === String(deleteId)) ) {
          fs.unlink( ('./data/' + deleteId + ".json"), function(err) {
            if (err) throw err;
            console.log(that.modelName + ' successfully deleted');
            callback(error, true);
          });
        } else {
          callback(error, 'id not found');
        }
      });
    });
  } catch (e) {
    console.log(e);
    callback(e);
  }
}
