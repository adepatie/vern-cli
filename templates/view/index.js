/*
 * View actions
 */
var fs = require('fs-extra');
var mustache = require('mu2');
module.exports = {
  copy: function(params, callback) {
    if(!fs.existsSync(params.view_path)) {
      fs.mkdirpSync(params.view_path);
    }

    var view_tpl = fs.readFileSync(__dirname + '/template/view.html').toString();

    var view = {
      name: params.name
    };

    mustache.compileText('view', view_tpl, function(err, compiled) {
      if(err) {
        return callback(err, null);
      }

      var out = '';
      mustache.render(compiled, view)
        .on('data', function(buf) { out += buf.toString(); })
        .on('end', function() {
          var fileName = params.view_path + '/' + params.action + '.html';
          fs.writeFileSync(fileName, out);
          callback(null, 'View created in ' + params.view_path);
        })
        .on('error', function(err) {
          callback(err, null);
        });
    });
  }
};