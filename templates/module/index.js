/*
 * Filter actions
 */
var fs = require('fs-extra');
var path = require('path');
var utils = require('../../utils');
module.exports = {
  copy: function(params, callback) {
    var module_tpl_path = path.join(__dirname, 'template', params.type);

    if(!fs.existsSync(params.module_dir)) {
      fs.mkdirpSync(params.module_dir);
    }

    console.log()

    utils.walkTemplate(module_tpl_path, params.module_dir, params).then(function(log) {
      callback(null, log);
    }).fail(function(err) {
      callback(err, null);
    });
  }
};