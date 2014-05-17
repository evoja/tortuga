'use strict';

describe('om.ns.js testing', function()
{
    it('om.ns()', function()
    {
        var omm = om.ns("om");
        expect(omm).toBe(om); // "What I've got with om.ns('om') must be the same as om"
        expect(typeof omm.ns).toEqual("function"); // "om.ns must be a function"

        var ns = om.ns("om.ns");
        expect(ns).toBe(om.ns); // "What I've got with om.ns('om.ns') must be the same as om.ns");

        expect(om.ns.trololo).toBeUndefined(); // "There are no property 'ololo' of om.ns");
        var ololo = om.ns("om.ns.trololo.ololo");
        expect(typeof ololo).toEqual("object"); // "'om.ns() must create and return object");
        expect(ololo).toBe(om.ns.trololo.ololo); // "om.ns.trololo.ololo was created");
    });



    it('om.ns_run()', function()
    {
        expect(om.ns_run.trololo).toBeUndefined(); // "There are no property 'ololo' of om.ns_run"
        om.ns_run("om.ns_run.trololo.ololo", function(ns)
        {
            ns.alala = "hello"
        });
        expect(om.ns_run.trololo.ololo).toBeDefined(); // "om.ns_run() must create object"
        var ololo = om.ns("om.ns_run.trololo.ololo");
        expect(typeof ololo).toEqual('object'); // "'om.ns_run() must create object"
        expect(ololo).toBe(om.ns_run.trololo.ololo); // "om.ns_run.trololo.ololo was created"
        expect(ololo.alala).toEqual("hello"); // "om.ns_run() must run function that creates subobject of ololo"
    });



    it('om.ns_get()', function()
    {
        expect(om.ns_get.trololo).toBeUndefined(); // "There are no property 'ololo' of om.ns_get");
        expect(function(){om.ns_get("om.ns_get.trololo.ololo")}).toThrow(); // "Must trhow exception on om.ns_get.trololo");

        var ololo = om.ns("om.ns_get.trololo.ololo");
        expect(function(){om.ns_get("om.ns_get.trololo.ololo")}).not.toThrow();
        expect(om.ns_get("om.ns_get.trololo.ololo")).toBe(ololo); // "om.ns_get() must return the object that was created by om.ns()");
    })
});