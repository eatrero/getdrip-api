var dotenv = require('dotenv');
dotenv.load();

var getdrip = require('../lib')(process.env.API_TOKEN, process.env.ACCOUNT_ID);
var expect = require('expect.js');
var subscriberId;
var campaignId;
var faker = require('faker');

var testEmail = faker.internet.email();
console.log(testEmail)

describe('getdrip module', function() {
	this.timeout(20000);

	it('should return 200 when accessing the account api', function(done) {
		getdrip.getAccounts(function(err, res, body){
			console.log(body);
			expect(err).to.equal(null);
			expect(res.statusCode).to.equal(200);
			done();
		})
	});

	it('should return 200 when accessing the list subscribers api', function(done) {
		getdrip.getSubscribers(function(err, res, body){
			console.log(err)
			console.log(body)
			expect(err).to.equal(null);
			expect(res.statusCode).to.equal(200);
			done();
		})
	})

	it('should return 200 when accessing the create subscriber api', function(done) {
		getdrip.createSubscriber(testEmail, {},
			function(err, res, body){
				console.log(body);
				subscriberId = body.subscribers[0].id
				expect(err).to.equal(null);
				expect(res.statusCode).to.equal(200);
				done();
			}
		)
	})

	it('should return 201 when accessing the create tag api', function(done) {
		getdrip.createTag(testEmail, 'new tag',
			function(err, res, body){
				console.log(body);
				expect(err).to.equal(null);
				expect(res.statusCode).to.equal(201);
				done();
			}
		)
	});

	it('should return 201 when accessing the create tag api (multiple tags)', function(done) {
		getdrip.createTags(testEmail, ['new tag', 'another new tag'],
			function(err, responses, body){
				console.log(body);
				expect(err).to.equal(null);
				
				for (var i = 0; i < responses.length; i++)
					expect(responses[i].statusCode).to.equal(201);

				done();
			}
		)
	});

	it('should return 204 when accessing the create event api', function(done) {
		getdrip.createEvent(testEmail, 'new event', {},
			function(err, res, body){
				console.log(body);
				expect(err).to.equal(null);
				expect(res.statusCode).to.equal(204);
				done();
			}
		)
	});


	it('should return 200 when accessing the get subscriber api', function(done) {
		getdrip.getSubscriber(subscriberId,
			function(err, res, body){
				console.log(body);
				console.log(body.subscribers[0].tags);
				expect(err).to.equal(null);
				expect(res.statusCode).to.equal(200);
				done();
			}
		)
	});

	it('should return 200 when accessing the list campaigns api', function(done) {
		getdrip.getCampaigns(function(err, res, body){
			console.log(body);
			campaignId = body.campaigns[0].id;
			expect(err).to.equal(null);
			expect(res.statusCode).to.equal(200);
			done();
		})
	})

	it('should return 200 when accessing the subscribe to campaign api', function(done) {
		getdrip.subscribeToCampaign(testEmail, campaignId, {},
			function(err, res, body){
				console.log(res.statusCode);
				console.log(body);
				expect(err).to.equal(null);
				expect(res.statusCode).to.equal(201);
				done();
			}
		)
	})


	/*	it('should return 204 when accessing the delete subscriber api', function(done) {
	 getdrip.deleteSubscriber(subscriberId,
	 function(err, res, body){
	 console.log(body);
	 expect(err).to.equal(null);
	 expect(res.statusCode).to.equal(204);
	 done();
	 }
	 )
	 })*/

})

