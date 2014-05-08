var tests = {
    Om_ns: '/om/Om.ns-test.js',
}

for(var i in tests)
{
    exports[i] = require(__dirname + tests[i]);
}
