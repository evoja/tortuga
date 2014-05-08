require("./../include.js")("om/Om.ns.js");

module.exports = {
    ns: function(test)
    {
        test.expect(6);
        var om = Om.ns("Om");
        test.deepEqual(om, Om, "What I've got with Om.ns('Om') must be the same as Om");
        test.equal(typeof om.ns, "function", "Om.ns must be a function");

        var ns = Om.ns("Om.ns");
        test.deepEqual(ns, Om.ns, "What I've got with Om.ns('Om.ns') must be the same as Om.ns");

        test.strictEqual(Om.ns.trololo, undefined, "There are no property 'ololo' of Om.ns");
        var ololo = Om.ns("Om.ns.trololo.ololo");
        test.equal(typeof ololo, 'object', "'Om.ns() must create and return object");
        test.strictEqual(ololo, Om.ns.trololo.ololo, "Om.ns.trololo.ololo was created");

        test.done();
    },

    ns_run: function(test)
    {
        test.expect(6);

        test.strictEqual(Om.ns_run.trololo, undefined, "There are no property 'ololo' of Om.ns_run");
        test.equal(!!Om.ns_run.trololo, false, "There are no property 'ololo' of Om.ns_run");
        Om.ns_run("Om.ns_run.trololo.ololo", function(ns)
        {
            ns.alala = "hello"
        });
        test.equal(!!Om.ns_run.trololo.ololo, true, "Om.ns_run() must create object");
        var ololo = Om.ns("Om.ns_run.trololo.ololo");
        test.equal(typeof ololo, 'object', "'Om.ns_run() must create object");
        test.strictEqual(ololo, Om.ns_run.trololo.ololo, "Om.ns_run.trololo.ololo was created");
        test.equal(ololo.alala, "hello", "Om.ns_run() must run function that creates subobject of ololo");


        test.done()
    }, 

    ns_get: function(test)
    {
        test.expect(4);

        test.strictEqual(Om.ns_get.trololo, undefined, "There are no property 'ololo' of Om.ns_get");
        test.throws(function(){Om.ns_get("Om.ns_get.trololo.ololo")}, Error, "Must trhow exception on Om.ns_get.trololo");

        var ololo = Om.ns("Om.ns_get.trololo.ololo");
        test.doesNotThrow(function(){Om.ns_get("Om.ns_get.trololo.ololo")});
        test.strictEqual(Om.ns_get("Om.ns_get.trololo.ololo"), ololo, "Om.ns_get() must return the object that was created by Om.ns()");

        test.done();
    }
};
