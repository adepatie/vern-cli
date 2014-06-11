var path = require('path');
var fs = require('fs');

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

module.exports = {
  rewrite: rewrite
};