/*
 * Service actions
 */
var fs = require('fs-extra');
var mustache = require('mu2');
module.exports = {
  copy: function(params, callback) {
    var service_tpl = fs.readFileSync(__dirname + '/template/' + params.type + '.js').toString();

    var view = {
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
          fs.writeFileSync(params.service_path + '/' + params.name + '.js', out);
          callback(null, 'Service created in ' + params.service_path);
        })
        .on('error', function(err) {
          callback(err, null);
        });
    });
  }
};