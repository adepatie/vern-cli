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

    var controller_file = 'controller.js';
    if(params.admin) {
      controller_file = 'admin-controller.js';
    }

    var controller_tpl = fs.readFileSync(path.join(__dirname, 'template', controller_file)).toString();

    var view = {
      appName: params.appName,
      name: params.name,
      controller_name: params.controller_name,
      api_route: params.name
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
          if(!fs.existsSync(fileName)) {
            fs.writeFileSync(fileName, out);
            log.push('JavaScript View Controller created in ' + fileName);
          } else {
            log.push('File already exists at ' + fileName);
          }
          callback(null, log.join('\n'));
        })
        .on('error', function(err) {
          callback(err, null);
        });
    });
  }
};