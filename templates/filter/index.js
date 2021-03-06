/*
 * Filter actions
 */
var fs = require('fs-extra');
var mustache = require('mu2');
var path = require('path');
module.exports = {
  copy: function(params, callback) {
    var filter_tpl = fs.readFileSync(path.join(__dirname, 'template', 'filter.js')).toString();

    var view = {
      appName: params.appName,
      name: params.name,
      filter_name: params.filter_name
    };

    mustache.compileText('filter', filter_tpl, function(err, compiled) {
      if(err) {
        return callback(err, null);
      }

      var out = '';
      mustache.render(compiled, view)
        .on('data', function(buf) { out += buf.toString(); })
        .on('end', function() {
          fs.writeFileSync(path.join(params.filter_path, params.name + '.js'), out);
          callback(null, 'Filter created in ' + params.filter_path);
        })
        .on('error', function(err) {
          callback(err, null);
        });
    });
  }
};