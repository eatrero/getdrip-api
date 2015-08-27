var getdrip = require('../lib')('alksj');
var expect = require('expect.js');

describe('getdrip module', function() {
	this.timeout(20000);

	it('should return 200 when accessing the api', function(done) {
		getdrip.rate(function(err, res, body){
			console.log(err);
			console.log(res.statusCode);
			console.log(body);
			expect(res.statusCode).to.equal(200);
			done();
		})
	})
})