var should = require('chai').should();
var expect = require('chai').expect;
var assert = require('assert');
var sinon = require('sinon');
var supertest = require('supertest');
var api = supertest('http://localhost:3000');

describe('Product API', function() {
	beforeEach(function() {
		
	});

	afterEach(function() {
		
	});

	it('should respond status 200', function(done) {
		api.get('/api/products')
			.set('Accept', 'application/json')
			.expect(200);
		done();
	});

	it('should parse fetched data as JSON', function(done) {
		
		api.get('/api/products')
			.set('Accept', 'application/json')
			.expect(200)
			.end(function(err, res) {
				// expect(res.body).to.be.not.null;
				done();
			});
	});

	it('should parse fetched data as JSON', function(done) {
		var data = { 
			category 	: 'Ram', 
			productname : 'KingStone 4GB 1336Bus',
			price: 650000,
			stock: 20
		};
		var dataJson = JSON.stringify(data);

		api.post('/api/users')
      .send(user)
      .end(function(err, res){
        // Enable the console log
        console.log = log;
        var data = JSON.parse(res.text);
        expect(err).to.be.null;
        expect(data.name).to.equal(user.name);
        done();
      });
	});

	it('should send given data as JSON body', function() {
    var data = { 
			category 	: 'Ram', 
			productname : 'KingStone 4GB 1336Bus',
			price: 650000,
			stock: 20
		};
    var dataJson = JSON.stringify(data);

    api.post(data, function() { });

    this.requests[0].requestBody.should.equal(dataJson);
	});

	it('should return error into callback', function(done) {
    myapi.get(function(err, result) {
      err.should.exist;
      done();
    });

    this.requests[0].respond(500);
	});

});