/*
 * Project actions
 */
var fs = require('fs');
module.exports = {
  copy: function(path, callback) {
    if(!path === '.') {
      if(!fs.statSync(path).isDirectory()) {
        fs.mkdirSync(path, '0644');
      }
    }
    callback(null, null);
  }
};