/**
 * Convenience method for assembling strings from multiple parts.  You can pass in a set of strings as arguments
 * that will replace tokens in the source strings based on argument index, OR you can pass in an object
 * of name value pairs that will replace tokens in the string based on key values.
 * ex: '{0} {0} {1} {2}'.format(3.14, 'abc', 'foo'); //outputs: 3.14 3.14 abc foo
 * ex: '{key1} {name} {key1}'.format({"key1" : 123, "name" : "Bob"}); //outputs: 123 Bob 123
 */
String.prototype.format = function() {
  var txt = this;
  var i = arguments.length;

  var replaceTokens = function(txt, key, value) {
    return txt.replace(new RegExp('\\{' + key + '\\}', 'gm'), value);
  };

  if(i > 0 && typeof(arguments[0]) == "object") { //process name value pairs
    for(var key in arguments[0]) {
      txt = replaceTokens(txt, key, arguments[0][key]);
    }
  }
  else { //do replacement by argument indexes
    while (i--) {
      txt = replaceTokens(txt, i, arguments[i]);
    }
  }
  return txt;
};