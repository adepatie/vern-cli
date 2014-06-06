/*
 * Project actions
 */
var fs = require('fs-extra');
module.exports = {
  copy: function(path, callback) {
    if(!path === '.') {
      if(!fs.statSync(path).isDirectory()) {
        fs.mkdirpSync(path, '0644');
      }
    }

    fs.copySync(__dirname + '/template', path);

    callback(null, null);
  }
};