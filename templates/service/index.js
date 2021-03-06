/*
 * Service actions
 */
var fs = require('fs-extra');
var mustache = require('mu2');
var path = require('path');
module.exports = {
  copy: function(params, callback) {
    var service_tpl = fs.readFileSync(path.join(__dirname, 'template', params.type + '.js')).toString();

    var view = {
      appName: params.appName,
      service_name: params.name
    };

    mustache.compileText('service', service_tpl, function(err, compiled) {
      if(err) {
        return callback(err, null);
      }

      var out = '';
      mustache.render(compiled, view)
        .on('data', function(buf) { out += buf.toString(); })
        .on('end', function() {
          fs.writeFileSync(path.join(params.service_path, params.name + '.js'), out);
          callback(null, 'Service created in ' + params.service_path);
        })
        .on('error', function(err) {
          callback(err, null);
        });
    });
  }
};