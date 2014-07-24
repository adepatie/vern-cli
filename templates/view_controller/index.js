/*
 * View actions
 */
var fs = require('fs-extra');
var mustache = require('mu2');
var path = require('path');
module.exports = {
  copy: function(params, callback) {
    if(!fs.existsSync(params.controller_path)) {
      fs.mkdirpSync(params.controller_path);
    }

    var controller_tpl = fs.readFileSync(path.join(__dirname, 'template', 'controller.js')).toString();

    var view = {
      appName: params.appName,
      name: params.name,
      controller_name: params.controller_name
    };

    var out = '';
    var log = [];
    mustache.compileText('controller', controller_tpl, function(err, compiled) {
      if (err) {
        return callback(err, null);
      }

      var out = '';
      mustache.render(compiled, view)
        .on('data', function (buf) {
          out += buf.toString();
        })
        .on('end', function () {
          var fileName = path.join(params.controller_path, params.name + '.js');
          fs.writeFileSync(fileName, out);
          log.push('JavaScript View Controller created in ' + fileName);
          callback(null, log.join('\n'));
        })
        .on('error', function(err) {
          callback(err, null);
        });
    });
  }
};