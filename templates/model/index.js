/*
 * Model actions
 */
var fs = require('fs-extra');
var mustache = require('mu2');
module.exports = {
  copy: function(params, callback) {
    if(!params.path === '.') {
      if(!fs.statSync(params.path).isDirectory()) {
        fs.mkdirpSync(params.path, '0644');
      }
    }

    var tpl = fs.readFileSync(__dirname + '/template/Model.js').toString();

    var view = {
      model_name: params.name,
      vars: 'this.name = null',
      collection: params.collection,
      indexes: JSON.stringify(params.indexes),
      exclude: JSON.stringify(params.exclude),
      validations: JSON.stringify(params.validations),
      validation_exceptions: JSON.stringify(params.validation_exceptions),
      non_editable: JSON.stringify(params.non_editable),
      super_constructor: JSON.stringify(params.super_constructor)
    };

    mustache.compileText('controller', tpl, function(err, compiled) {
      if(err) {
        return callback(err, null);
      }

      var out = '';
      mustache.render(compiled, view)
        .on('data', function(buf) { out += buf.toString(); })
        .on('end', function() {
          fs.writeFileSync(params.path + '/' + params.name + '.js', out);
          callback(null, out);
        })
        .on('error', function(err) {
          callback(err, null);
        });
    });
  }
};