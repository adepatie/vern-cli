/*
 * Directive actions
 */
var fs = require('fs-extra');
var mustache = require('mu2');
module.exports = {
  copy: function(params, callback) {
    var directive_tpl = fs.readFileSync(__dirname + '/template/directive.js').toString();

    var view = {
      name: params.name,
      directive_name: params.directive_name,
      template_url: 'template/' + params.name + '.html',
      restrictions: params.restrictions
    };

    mustache.compileText('directive', directive_tpl, function(err, compiled) {
      if(err) {
        return callback(err, null);
      }

      var out = '';
      mustache.render(compiled, view)
        .on('data', function(buf) { out += buf.toString(); })
        .on('end', function() {
          fs.writeFileSync(params.directive_path + '/' + params.name + '.js', out);
          callback(null, 'Directive created in ' + params.directive_path);
        })
        .on('error', function(err) {
          callback(err, null);
        });
    });
  }
};