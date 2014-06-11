/*
 * Filter actions
 */
var fs = require('fs-extra');
var mustache = require('mu2');
module.exports = {
  copy: function(params, callback) {
    var filter_tpl = fs.readFileSync(__dirname + '/template/filter.js').toString();

    var view = {
      filter_name: params.name
    };

    mustache.compileText('filter', filter_tpl, function(err, compiled) {
      if(err) {
        return callback(err, null);
      }

      var out = '';
      mustache.render(compiled, view)
        .on('data', function(buf) { out += buf.toString(); })
        .on('end', function() {
          fs.writeFileSync(params.filter_path + '/' + params.name + '.js', out);
          callback(null, 'Filter created in ' + params.filter_path);
        })
        .on('error', function(err) {
          callback(err, null);
        });
    });
  }
};