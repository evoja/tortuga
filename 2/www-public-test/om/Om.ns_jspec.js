'use strict';

describe('Om.ns.js testing', function()
{
    it('Om.ns()', function()
    {
        var om = Om.ns("Om");
        expect(om).toBe(Om); // "What I've got with Om.ns('Om') must be the same as Om"
        expect(typeof om.ns).toEqual("function"); // "Om.ns must be a function"

        var ns = Om.ns("Om.ns");
        expect(ns).toBe(Om.ns); // "What I've got with Om.ns('Om.ns') must be the same as Om.ns");

        expect(Om.ns.trololo).toBeUndefined(); // "There are no property 'ololo' of Om.ns");
        var ololo = Om.ns("Om.ns.trololo.ololo");
        expect(typeof ololo).toEqual("object"); // "'Om.ns() must create and return object");
        expect(ololo).toBe(Om.ns.trololo.ololo); // "Om.ns.trololo.ololo was created");
    });



    it('Om.ns_run()', function()
    {
        expect(Om.ns_run.trololo).toBeUndefined(); // "There are no property 'ololo' of Om.ns_run"
        Om.ns_run("Om.ns_run.trololo.ololo", function(ns)
        {
            ns.alala = "hello"
        });
        expect(Om.ns_run.trololo.ololo).toBeDefined(); // "Om.ns_run() must create object"
        var ololo = Om.ns("Om.ns_run.trololo.ololo");
        expect(typeof ololo).toEqual('object'); // "'Om.ns_run() must create object"
        expect(ololo).toBe(Om.ns_run.trololo.ololo); // "Om.ns_run.trololo.ololo was created"
        expect(ololo.alala).toEqual("hello"); // "Om.ns_run() must run function that creates subobject of ololo"
    });



    it('Om.ns_get()', function()
    {
        expect(Om.ns_get.trololo).toBeUndefined(); // "There are no property 'ololo' of Om.ns_get");
        expect(function(){Om.ns_get("Om.ns_get.trololo.ololo")}).toThrow(); // "Must trhow exception on Om.ns_get.trololo");

        var ololo = Om.ns("Om.ns_get.trololo.ololo");
        expect(function(){Om.ns_get("Om.ns_get.trololo.ololo")}).not.toThrow();
        expect(Om.ns_get("Om.ns_get.trololo.ololo")).toBe(ololo); // "Om.ns_get() must return the object that was created by Om.ns()");
    })
});