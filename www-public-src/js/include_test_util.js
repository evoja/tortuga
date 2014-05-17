var path = require('path');
var src_dir = path.resolve('www-public-src/js/');
var fs = require('fs');

module.exports = function(include)
{
    eval(fs.readFileSync(path.join(src_dir, include)).toString());
}
