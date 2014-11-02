var path = require('path');
var fs = require('fs-extra');
var Q = require('q');
var valid_ext = ['txt', 'md', 'js', 'css', 'less', 'html', 'json'];

function generatePassword(len) {
  if(!len) {
    len = 9;
  }

  return (Math.random()*(Math.pow(36, len))).toString(36).slice(0, len);
}

function applyVariables(template, params) {
  var deferred = Q.defer();

  var text = fs.readFileSync(template).toString();
  for(var i in params) {
    text = text.replace(new RegExp('{{' + i + '}}', 'g'), params[i]);
  }

  deferred.resolve(text);

  return deferred.promise;
}

function applyVariablesSync(template, params) {
  var text = fs.readFileSync(template).toString();
  for(var i in params) {
    text = text.replace(new RegExp('{{' + i + '}}', 'g'), params[i]);
  }
  return text;
}

function walkTemplate(dir, templateDir, params, log) {
  var deferred = Q.defer();
  var fileName, j;
  if(!log) {
    log = [];
  }

  fs.mkdirsSync(templateDir);
  var templateFiles = fs.readdirSync(dir);
  var pending = templateFiles.length;
  if(!pending) {
    deferred.resolve('');
    return deferred.promise;
  }

  for(var i = 0; i < templateFiles.length; i++) {
    if(fs.statSync(path.join(dir, templateFiles[i])).isDirectory()) {
      walkTemplate(path.join(dir, templateFiles[i]), path.join(templateDir, templateFiles[i]), params, log).then(function() {
        if(!--pending) {
          deferred.resolve(log);
        }
      });
      continue;
    }

    // real file, check if it has a valid extension type for editing
    var ext = templateFiles[i].split('.').pop().toLowerCase();
    if(valid_ext.indexOf(ext) <= -1) {
      fileName = templateFiles[i];
      if(fileName.substr(0, 2) === '__') {
        for(j in params) {
          fileName = fileName.replace('__' + j + '__', params[j]);
        }
      }
      log.push('Setting up: ' + path.join(templateDir, fileName));
      fs.copySync(path.join(dir, templateFiles[i]), path.join(templateDir, fileName));
      if(!--pending) {
        deferred.resolve(log);
      }
      continue;
    }

    var newFile = applyVariablesSync(path.join(dir, templateFiles[i]), params);
    fileName = templateFiles[i];
    if(fileName.substr(0, 2) === '__') {
      for(j in params) {
        fileName = fileName.replace('__' + j + '__', params[j]);
      }
    }
    fs.writeFileSync(path.join(templateDir, fileName), newFile);
    log.push('Setting up: ' + path.join(templateDir, fileName));
    if(!--pending) {
      deferred.resolve(log);
    }
  }

  return deferred.promise;
}

/*
 *
 * @args
 *  .needle - The string that finds the line to replace
 *  .haystack - The file text being replaced
 *  .insertion - Array of strings to insert
 *
 */
function rewrite(args) {
  if(!args.haystack && !args.path) {
    return args;
  }

  if(!args.haystack) {
    args.haystack = fs.readFileSync(args.path, 'utf8');
  }

  if(args.haystack.indexOf(args.needle) < 0) {
    return args;
  }

  var lines = args.haystack.split('\n');
  var lineIndex = 0;
  for(var i = 0; i < lines.length; i++) {
    if(lines[i].indexOf(args.needle) > -1) {
      lineIndex = i;
    }
  }

  var spaces = [];
  while(lines[lineIndex].charAt(spaces.length) === ' ') {
    spaces.push(' ');
  }

  var spaceStr = spaces.join('');

  var insertion = args.insertions.map(function(line) {
    return spaceStr + line;
  }).join('\n');

  if(args.haystack.indexOf(insertion) > -1) {
    return args;
  }

  lines.splice(lineIndex, 0, insertion);

  args.haystack = lines.join('\n');

  fs.writeFileSync(args.path, args.haystack);

  return args;
}

function toCamelCase(text, pascal) {
  if(!text) {
    return undefined;
  }
  if(pascal) {
    // first letter is lowercase
    return text.toLowerCase().replace(/[-_\s](.)/g, function(match, group) {
      return group.toUpperCase();
    });
  } else {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase().replace(/[-_\s](.)/g, function(match, group) {
      return group.toUpperCase();
    });
  }
}

function toHyphenated(text) {
  if(!text) {
    return undefined;
  }
  return text.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

module.exports = {
  generatePassword: generatePassword,
  rewrite: rewrite,
  toCamelCase: toCamelCase,
  toHyphenated: toHyphenated,
  applyVariables: applyVariables,
  applyVariablesSync: applyVariablesSync,
  walkTemplate: walkTemplate
};