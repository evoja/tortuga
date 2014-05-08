require("./../include.js")("om/Om.ns.js");

module.exports = {
    ns: function(test){
        test.expect(6);
        var om = Om.ns("Om");
        test.deepEqual(om, Om, "What I've got with Om.ns('Om') must be the same as Om");
        test.equal(typeof om.ns, "function", "Om.ns must be a function");

        var ns = Om.ns("Om.ns");
        test.deepEqual(ns, Om.ns, "What I've got with Om.ns('Om.ns') must be the same as Om.ns");

        test.strictEqual(Om.ns.ololo, undefined, "There are no property 'ololo' of Om.ns");
        var ololo = Om.ns("Om.ns.ololo");
        test.equal(typeof ololo, 'object', "'Om.ns() must create and return object");
        test.strictEqual(ololo, Om.ns.ololo, "Om.ns.ololo was created");

        test.done();
    }
};
