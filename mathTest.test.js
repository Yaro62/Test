const utl = require('./utils');
var taskId;
const request = require('supertest')(utl.url);
const expect = require('chai').expect;

var x = new Date().getTime();
var y = new Date().getTime();
var testCode = '' +  x + ' + ' + y;

describe.skip("POST /submit", () => {

  it("returns ID of the task", async () => {
    const response = await request
    .post('/submit')
    //.auth(utils.user1, utils.user1Password) 
    .auth(utl.user1, utl.user1Password) 
    .set('Accept', 'application/json')     
    //.send({'code': testCode});
    .send({'code': testCode});

    expect(response.status).to.eql(200); 
    taskId = response.body.id; 
    console.info(taskId);        
    console.info(utl.user1);
  });
});

describe.skip("GET",  () => {
    it("using task ID returns request status", async  () => {   
      console.info(taskId);
      const response = await request
      .get('/status?id='+taskId)
      .auth(utl.user1, utl.user1Password) 
      //.set('Accept', 'application/json')     
      console.info(response.body.status); 
      expect(response.status).to.eql(200);
      //expect(response.body.status).to.eql("COMPLETED");     
    });
  });

