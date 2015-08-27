'use strict';

var request = require('request');

function getDrip(token){
  if (!(this instanceof getDrip)) {
    return new getDrip(token);
  }

    this.rate = function(cb) {
    request.get(
      'https://api.getdrip.com/v2/accounts',
      function( err, res, body){
        cb(err, res, body);
      })
  }
}

getDrip.prototype = {
  setApiKey: function(token) {
  }
};

module.exports = getDrip;