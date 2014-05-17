require("./om.ns.js");

module.exports = {
    ns: function(test)
    {
        test.expect(6);
        var omm = om.ns("om");
        test.deepEqual(omm, om, "What I've got with om.ns('om') must be the same as om");
        test.equal(typeof omm.ns, "function", "om.ns must be a function");

        var ns = om.ns("om.ns");
        test.deepEqual(ns, om.ns, "What I've got with om.ns('om.ns') must be the same as om.ns");

        test.strictEqual(om.ns.trololo, undefined, "There are no property 'ololo' of om.ns");
        var ololo = om.ns("om.ns.trololo.ololo");
        test.equal(typeof ololo, 'object', "'om.ns() must create and return object");
        test.strictEqual(ololo, om.ns.trololo.ololo, "om.ns.trololo.ololo was created");

        test.done();
    },

    ns_run: function(test)
    {
        test.expect(6);

        test.strictEqual(om.ns_run.trololo, undefined, "There are no property 'ololo' of om.ns_run");
        test.equal(!!om.ns_run.trololo, false, "There are no property 'ololo' of om.ns_run");
        om.ns_run("om.ns_run.trololo.ololo", function(ns)
        {
            ns.alala = "hello"
        });
        test.equal(!!om.ns_run.trololo.ololo, true, "om.ns_run() must create object");
        var ololo = om.ns("om.ns_run.trololo.ololo");
        test.equal(typeof ololo, 'object', "'om.ns_run() must create object");
        test.strictEqual(ololo, om.ns_run.trololo.ololo, "om.ns_run.trololo.ololo was created");
        test.equal(ololo.alala, "hello", "om.ns_run() must run function that creates subobject of ololo");


        test.done()
    }, 

    ns_get: function(test)
    {
        test.expect(4);

        test.strictEqual(om.ns_get.trololo, undefined, "There are no property 'ololo' of om.ns_get");
        test.throws(function(){om.ns_get("om.ns_get.trololo.ololo")}, om.ns_get.NsNotFoundError, "Must trhow exception on om.ns_get.trololo");

        var ololo = om.ns("om.ns_get.trololo.ololo");
        test.doesNotThrow(function(){om.ns_get("om.ns_get.trololo.ololo")});
        test.strictEqual(om.ns_get("om.ns_get.trololo.ololo"), ololo, "om.ns_get() must return the object that was created by om.ns()");

        test.done();
    }
};
