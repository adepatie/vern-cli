/*
 * View actions
 */
var fs = require('fs-extra');
var mustache = require('mu2');
var path = require('path');
module.exports = {
  copy: function(params, callback) {
    if(!fs.existsSync(params.view_path)) {
      fs.mkdirpSync(params.view_path);
    }

    var view_tpl = fs.readFileSync(path.join(__dirname, 'template', 'view.html')).toString();
    var stylesheet_tpl = fs.readFileSync(path.join(__dirname, 'template', 'view.less')).toString();
    var controller_tpl = fs.readFileSync(path.join(__dirname, 'template', 'view.js')).toString();

    var view = {
      appName: params.appName,
      name: params.name,
      controller_name: params.controller_name
    };

    mustache.compileText('view', view_tpl, function(err, compiled) {
      if(err) {
        return callback(err, null);
      }

      var out = '';
      var log = [];
      mustache.render(compiled, view)
        .on('data', function(buf) { out += buf.toString(); })
        .on('end', function() {
          var fileName = path.join(params.view_path, params.action) + '.html';
          fs.writeFileSync(fileName, out);
          log.push('HTML View file created in ' + fileName);
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
                var fileName = path.join(params.controller_path, params.name) + '.js';
                fs.writeFileSync(fileName, out);
                log.push('JavaScript View controller created in ' + fileName);
                mustache.compileText('style', stylesheet_tpl, function(err, compiled) {
                  if (err) {
                    return callback(err, null);
                  }

                  var out = '';
                  mustache.render(compiled, view)
                    .on('data', function (buf) {
                      out += buf.toString();
                    })
                    .on('end', function () {
                      var fileName = path.join(params.style_path, params.name) + '.less';
                      fs.writeFileSync(fileName, out);
                      log.push('LESS View stylesheet created in ' + fileName);

                      callback(null, log.join('\n'));
                    })
                    .on('error', function(err) {
                      callback(err, null);
                    });
                });
              })
              .on('error', function(err) {
                callback(err, null);
              });
          });
        })
        .on('error', function(err) {
          callback(err, null);
        });
    });
  }
};