describe("routr", function(){
    describe("routr.my_method()", function(){
        it("should return 1", function(done){
            _use('routr@latest', function(exports) {
                expect('my_method' in exports);
                done();
            });
        });
    });
});