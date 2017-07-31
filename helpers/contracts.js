var config    = require('../config');

var solc      = require('solc');
var fs        = require('fs');
var assert    = require('assert');
var BigNumber = require('bignumber.js');

var Ω = console.log;

// assert.notEqual(typeof(process.env.ETH_NODE),'undefined');

var creator               = process.env.ETH_CREATOR_ADDRESS;
var ledgerContractAddress = process.env.CONTRACT_ADDRESS;
var contract = '';

var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider(process.env.ETH_NODE));

deployMain=(creator,ledgerAbi,ledgerBytecode,cb)=> {
     var tempContract     = web3.eth.contract(ledgerAbi);
     var whereToSendMoney = creator;
     var params = { from: creator, gas: 4995000, data: `0x${ledgerBytecode}`}
     tempContract.new(whereToSendMoney, params, (err, c)=> {
          if(err){ Ω('ERROR: ' + err); return cb(err) }
          return cb(null, c.transactionHash)
     });
}

getContractAbi=(cName)=> (filename)=> (cb)=> fs.readFile(filename, (err, res)=>{ 
     // assert.equal(err,null);
     var source = res.toString();
     // assert.notEqual(source.length,0);
     var output   = solc.compile(source, 1);
     var abi      = JSON.parse(output.contracts[cName].interface);
     var bytecode = output.contracts[cName].bytecode;
     return cb(null,abi,bytecode);
});

Create =(cb)=>{
     web3.eth.getAccounts((err, as)=> {
          console.log('as: '+as)
          if(err) { return cb(err)}
          getContractAbi(':TicketLedger')('./contracts/TicketLedger.sol')((err,ledgerAbi,ledgerBytecode)=> {
               console.log('got contract abi')
               deployMain(creator,ledgerAbi,ledgerBytecode, (err,res)=>{
                    console.log('deployed: '+res )
                    if(err) { return cb(err)}
                    return cb(null,res)
               })
          });
     });
}

IsTicketSold = (contract,ticket_address,cb)=> {
     contract.isticketsold(ticket_address, (err,res)=>{
          if(err) { return cb(err)}
          return cb(null, res)
     });
};

SellTicket = (contract,ticket_address,cb)=> {
     var params   = { from: creator, gas: 2000000 };
     contract.sellticket(ticket_address, params, (err,res)=>{
          if(err) { return cb(err)}
          var out = {
               tx: res,
               txLink: 'https://kovan.etherscan.io/tx/'+res
          }
          return cb(null, out)
     });
};

call_API_method = (func)=>(ticket_address,cb)=>{
     // TODO: perf.issue -> this is very slow
     // each time it reads and compiles
     getContractAbi(':TicketLedger')('./contracts/TicketLedger.sol')((err,ledgerAbi,ledgerBytecode)=> {
          contract = web3.eth.contract(ledgerAbi).at(ledgerContractAddress);
          func(contract, ticket_address, cb)
     });
};


exports.IsTicketSold    = IsTicketSold
exports.SellTicket      = SellTicket
exports.call_API_method = call_API_method



// '0xb9af8aa42c97f5a1f73c6e1a683c4bf6353b83e8'

// call_API_method(IsTicketSold)('0xb9af8aa42c97f5a1f73c6e1a683c4bf6353b83e8',(err,res)=>{
//      Ω(`IsTicketSold: ${res}`);
//      return res
// })

