var config    = require('../config');

var solc      = require('solc');
var fs        = require('fs');
var assert    = require('assert');
var BigNumber = require('bignumber.js');

var Ω = console.log;


var express  = require('express');
var app      = express();


// var insert_file = (filename)=> eval(fs.readFileSync(filename)+'');

var contracts = require('../helpers/contracts.js')



var ticket_address = '0x0605bf0970025A6DD604f5fE481Cc307E9d5450f';

// assert.notEqual(typeof(process.env.ETH_NODE),'undefined');

describe('Tickets module',()=> {
     before((done)=> {
          app.listen(3000,(err,res)=>{
               // assert.equal(err,null)
               done()
          })
     });

     after(done=>{
          done();
     });

     it('should sell ticket', done=>{
          contracts.call_API_method(contracts.sellTicket)(ticket_address,(err,res)=>{
               // assert.equal(err,null)
               console.log(res)
               done()
          })
     })
})

