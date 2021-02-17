
const tester = require('supertest');
const expect = require("chai").expect;
const testSetup = require('./test-setup');

describe.skip('POST /groovy/submit', () => {
  var request;
  var testCode;
  var x;
  var y;

  beforeEach(() => {
    request = tester(testSetup.testUrl);
    
    x = new Date().getTime();
    y = new Date().getTime();
    testCode = '' +  x + ' + ' + y;

  });

  it(" works with simple scenario ", async () => {

    var response = await request
      .post('/groovy/submit')
      .auth(testSetup.user1, testSetup.user1Password)
      .send({ code: testCode});

    expect(response.status).to.equal(200);
    console.info(response.body, response.status);
    console.info(testCode);
    responseId = response.body.id;
    expect(responseId).to.not.be.empty;

    response = await tester(testSetup.testUrl)
      .get('/groovy/status?id=' + responseId)
      .auth(testSetup.user1, testSetup.user1Password);
      console.info(response.body.status); 
    expect(response.status).to.equal(200);
  });

  it("returns correct result", async () => {

    var response = await request
      .post('/groovy/submit')
      .auth(testSetup.user1, testSetup.user1Password)
      .send({ code: testCode});

    expect(response.status).to.equal(200);
    responseId = response.body.id;
    expect(responseId).to.not.be.empty;
    console.info(response.body.status); 

    var submitStatus = 'IN_PROGRESS';
    while (submitStatus == 'IN_PROGRESS' || submitStatus == 'PENDING') {
      response = await tester(testSetup.testUrl)
        .get('/groovy/status?id=' + responseId)
        .auth(testSetup.user1, testSetup.user1Password);
      submitStatus = response.body.status;
    }
    expect(response.body.result).to.equal( '' + (x + y));
    console.info(response.body.status); 

  });

  it("returns null result", async () => {

    var response = await request
      .post('/groovy/submit')
      .auth(testSetup.user1, testSetup.user1Password)
      .send({ code: 'println(' + x + ')'});

    expect(response.status).to.equal(200);
    responseId = response.body.id;
    expect(responseId).to.not.be.empty;

    var submitStatus = 'IN_PROGRESS';
    while (submitStatus == 'IN_PROGRESS' || submitStatus == 'PENDING') {
      response = await tester(testSetup.testUrl)
        .get('/groovy/status?id=' + responseId)
        .auth(testSetup.user1, testSetup.user1Password);
      submitStatus = response.body.status;
    }
    expect(response.body.result).to.equal('null');

  });

  it(" works with for two users ", async () => {
    var asyncResponse1 = request
      .post('/groovy/submit')
      .auth(testSetup.user1, testSetup.user1Password)
      .send({ code: testCode});

    z = new Date().getTime();
    testCode2 = '' +  x + ' + ' + y + ' + ' + z;

    var asyncResponse2 = request
      .post('/groovy/submit')
      .auth(testSetup.user2, testSetup.user2Password)
      .send({ code: testCode2});
      
    var response2 = await asyncResponse2;
    expect(response2.status).to.equal(200);

    var response1 = await asyncResponse1;
    expect(response1.status).to.equal(200);

    responseId1 = response1.body.id;
    responseId2 = response2.body.id;


    asyncResponse1 =  tester(testSetup.testUrl)
      .get('/groovy/status?id=' + responseId1)
      .auth(testSetup.user1, testSetup.user1Password);

    asyncResponse2 =  tester(testSetup.testUrl)
      .get('/groovy/status?id=' + responseId2)
      .auth(testSetup.user2, testSetup.user2Password);

    response1 = await asyncResponse1;
    response2 = await asyncResponse2;
    
    expect(response1.status).to.equal(200);
    expect(response2.status).to.equal(200);
    console.info(response1.body.status);
    console.info(response2.body.status); 
  });
});