/*
 * Project actions
 */
var fs = require('fs-extra');
var mustache = require('mu2');
var Q = require('q');
var path = require('path');
module.exports = {
  copy: function(params, callback) {
    var project_path = params.path;
    var baseDir = __dirname + '/template';
    var log = [];
    var valid_ext = ['txt', 'md', 'js', 'css', 'less', 'html', 'json'];

    if(!project_path === '.') {
      if(!fs.statSync(project_path).isDirectory()) {
        fs.mkdirsSync(project_path);
      }
    }

    // We need to alter all the files, so this needs to be elaborated upon
    function applyTemplates(dir, appDir) {
      fs.mkdirsSync(appDir);
      var deferred = Q.defer();
      var promises = [];
      var projectFiles = fs.readdirSync(dir);
      for(var i = 0; i < projectFiles.length; i++) {
        if (projectFiles[i] === 'vern') {
          promises.push(walkTemplate(path.join(dir, params.apiName), path.join(appDir, params.apiName)));
        } else if (projectFiles[i] === 'vern_admin') {
          promises.push(walkTemplate(path.join(dir, params.adminName), path.join(appDir, params.adminName)));
        } else if (projectFiles[i] === 'vern_assets') {
          promises.push(walkTemplate(path.join(dir, params.assetsName), path.join(appDir, params.assetsName)));
        } else if (projectFiles[i] === 'vern_frontend') {
          promises.push(walkTemplate(path.join(dir, params.frontendName), path.join(appDir, params.frontendName)));
        } else {
          fs.copySync(path.join(dir, projectFiles[i]), path.join(appDir, projectFiles[i]));
        }
      }

      Q.all(promises).spread(function(result) {
        return deferred.resolve(result);
      }).fail(function(err) {
        return deferred.reject(err);
      });

      return deferred.promise;
    }

    function walkTemplate(dir, templateDir) {
      var deferred = Q.defer();

      fs.mkdirsSync(templateDir);
      var templateFiles = fs.readdirSync(dir);
      var pending = templateFiles.length;
      if(!pending) {
        deferred.resolve('');
        return deferred.promise;
      }

      for(var i = 0; i < templateFiles.length; i++) {
        if(fs.statSync(path.join(dir, templateFiles[i])).isDirectory()) {
          walkTemplate(path.join(dir, templateFiles[i]), path.join(templateDir, templateFiles[i])).then(function() {
            if(!--pending) {
              deferred.resolve(log);
            }
          });
          continue;
        }

        // real file, check if it has a valid extension type for editing
        var ext = templateFiles[i].split('.').pop().toLowerCase();
        if(valid_ext.indexOf(ext) <= -1) {
          log.push('Setting up: ' + path.join(templateDir, templateFiles[i]));
          fs.copySync(path.join(dir, templateFiles[i]), path.join(templateDir, templateFiles[i]));
          if(!--pending) {
            deferred.resolve(log);
          }
          continue;
        }

        (function(templateFile) {
          applyVariables(path.join(dir, templateFile)).then(function (newFile) {
            fs.writeFileSync(path.join(templateDir, templateFile), newFile);
            log.push('Setting up: ' + path.join(templateDir, templateFile));
            if(!--pending) {
              deferred.resolve(log);
            }
          }).fail(function (err) {
            return deferred.reject(err);
          });
        })(templateFiles[i]);
      }

      return deferred.promise;
    }

    function applyVariables(template) {
      var deferred = Q.defer();

      var text = fs.readFileSync(template).toString();
      mustache.compileText('project_tpl', text, function(err, compiled) {
        if(err) {
          console.log(err);
          return deferred.resolve(text);
        }

        var out = '';
        mustache.render(compiled, params)
          .on('data', function(buf) { out += buf.toString(); })
          .on('end', function() {
            deferred.resolve(out);
          })
          .on('error', function(err) {
            console.log(err);
            deferred.resolve(text);
          });
      });

      return deferred.promise;
    }

    //fs.copySync(baseDir, project_path);
    var topFiles = fs.readdirSync(__dirname + '/template');
    for(var i = 0; i < topFiles.length; i++) {
      if(topFiles[i] === 'app') {
        applyTemplates(path.join(baseDir, topFiles[i]), path.join(project_path, topFiles[i])).then(function(result) {
          console.log('success');
          callback(null, log.join('\n'));
        }).fail(function(err) {
          console.log('error');
          callback(err, null);
        });
      } else {
        fs.copySync(path.join(baseDir, topFiles[i]), path.join(project_path, topFiles[i]));
      }
    }
  }
};