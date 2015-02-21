/*
 * View actions
 */
var fs = require('fs-extra');
var mustache = require('mu2');
var path = require('path');
module.exports = {
  copy: function(params, callback) {
    if(!fs.existsSync(params.style_path)) {
      fs.mkdirpSync(params.style_path);
    }

    var stylesheet_tpl = fs.readFileSync(path.join(__dirname, 'template', 'stylesheet.less')).toString();

    var view = {
      appName: params.appName,
      name: params.name,
      controller_name: params.controller_name
    };

    var out = '';
    var log = [];
    mustache.compileText('stylesheet', stylesheet_tpl, function(err, compiled) {
      if (err) {
        return callback(err, null);
      }

      var out = '';
      mustache.render(compiled, view)
        .on('data', function (buf) {
          out += buf.toString();
        })
        .on('end', function () {
          var fileName = path.join(params.style_path, params.name + '.less');
          if(!fs.existsSync(fileName)) {
            fs.writeFileSync(fileName, out);
            log.push('LESS Stylesheet created in ' + fileName);
          } else {
            log.push('LESS Stylesheet already exists at ' + fileName);
          }
          callback(null, log.join('\n'));
        })
        .on('error', function(err) {
          callback(err, null);
        });
    });
  }
};