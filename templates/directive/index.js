/*
 * Directive actions
 */
var fs = require('fs-extra');
var mustache = require('mu2');
module.exports = {
  copy: function(params, callback) {
    var directive_tpl = fs.readFileSync(__dirname + '/template/directive.js').toString();
    var less_tpl = fs.readFileSync(__dirname + '/template/directive.less').toString();

    var view = params;
    view.template_url = 'template/' + params.name + '.html';

    mustache.compileText('directive', directive_tpl, function(err, compiled) {
      if(err) {
        return callback(err, null);
      }

      var out = '';
      var log = [];
      mustache.render(compiled, view)
        .on('data', function(buf) { out += buf.toString(); })
        .on('end', function() {
          fs.writeFileSync(params.directive_path + '/' + params.name + '.js', out);
          log.push('Directive JS file created in ' + params.directive_path);
          if(view.lessFile) {
            mustache.compileText('directive', less_tpl, function(err, compiled) {
              if (err) {
                return callback(err, null);
              }

              var out = '';
              mustache.render(compiled, view)
                .on('data', function (buf) {
                  out += buf.toString();
                })
                .on('end', function () {
                  fs.writeFileSync(params.less_path + '/' + params.name + '.less', out);
                  log.push('Directive LESS file created in ' + params.less_path);
                  callback(null, log.join('\n'));
                })
                .on('error', function (err) {
                  callback(err, null);
                });
            });
          } else {
            callback(null, log.join('\n'));
          }
        })
        .on('error', function(err) {
          callback(err, null);
        });
    });
  }
};