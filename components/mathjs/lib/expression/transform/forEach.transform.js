'use strict';

var Matrix = require('../../type/Matrix');

/**
 * Attach a transform function to math.forEach
 * Adds a property transform containing the transform function.
 *
 * This transform creates a one-based index instead of a zero-based index
 * @param {Object} math
 */
module.exports = function (math) {
  math.forEach.transform = function (x, callback) {
    if (arguments.length != 2) {
      throw new math.error.ArgumentsError('forEach', arguments.length, 2);
    }

    if (Array.isArray(x)) {
      _forEachArray(x, callback, x);
    } else if (x instanceof Matrix) {
      _forEachArray(x.valueOf(), callback, x);
    } else {
      throw new math.error.UnsupportedTypeError('forEach', math['typeof'](x));
    }
  };

  function _forEachArray (array, callback, arrayOrig) {
    var recurse = function (value, index) {
      if (Array.isArray(value)) {
        value.forEach(function (child, i) {
          // we create a copy of the index array and append the new index value
          recurse(child, index.concat(i + 1)); // one based index, hence i+1
        });
      }
      else {
        callback(value, index, arrayOrig);
      }
    };
    recurse(array, []);
  }

};
