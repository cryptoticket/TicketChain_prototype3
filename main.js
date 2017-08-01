var express   = require('express');
var app       = express();
var port_num  = 4000;
var fs        = require('fs');
var config    = require('./config');
var BigNumber = require('bignumber.js');

var creator = '0xb9af8aa42c97f5a1f73c6e1a683c4bf6353b83e7';
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider(process.env.ETH_NODE));

var abi   = [{"constant":true,"inputs":[],"name":"creator","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"id","type":"string"},{"name":"event_title_","type":"string"},{"name":"category_","type":"string"},{"name":"category_name_","type":"string"},{"name":"order_","type":"string"},{"name":"price_","type":"int256"},{"name":"price_currency_","type":"string"},{"name":"updated_at_","type":"string"}],"name":"setTicketData2","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"id","type":"string"}],"name":"getTicketData2","outputs":[{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"int256"},{"name":"","type":"string"},{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"newCreator","type":"address"}],"name":"changeCreator","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"id","type":"string"},{"name":"status_","type":"int256"},{"name":"serial_","type":"string"},{"name":"number_","type":"int256"},{"name":"seat_sector_","type":"string"},{"name":"seat_row_","type":"int256"},{"name":"seat_number_","type":"int256"},{"name":"customer_","type":"string"},{"name":"customer_name_","type":"string"},{"name":"event_","type":"string"}],"name":"setTicketData1","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"id","type":"string"}],"name":"getTicketData1","outputs":[{"name":"","type":"int256"},{"name":"","type":"string"},{"name":"","type":"int256"},{"name":"","type":"string"},{"name":"","type":"int256"},{"name":"","type":"int256"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"payable":false,"type":"fallback"}]
var bcode = "0x60606040526000600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550341561004e57fe5b5b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b5b611dbc806100a16000396000f30060606040523615610076576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806302d05d3f1461008c5780632d0e8ba7146100de5780635bc575f2146102eb57806374580e2f146106355780637fd30bf61461066b578063d0cf4a6f14610850575b341561007e57fe5b61008a5b60006000fd5b565b005b341561009457fe5b61009c610b35565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34156100e657fe5b6102d1600480803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190803590602001909190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091905050610b5b565b604051808215151515815260200191505060405180910390f35b34156102f357fe5b610343600480803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091905050610f30565b6040518080602001806020018060200180602001888152602001806020018060200187810387528e8181518152602001915080519060200190808383600083146103ac575b8051825260208311156103ac57602082019150602081019050602083039250610388565b505050905090810190601f1680156103d85780820380516001836020036101000a031916815260200191505b5087810386528d818151815260200191508051906020019080838360008314610420575b805182526020831115610420576020820191506020810190506020830392506103fc565b505050905090810190601f16801561044c5780820380516001836020036101000a031916815260200191505b5087810385528c818151815260200191508051906020019080838360008314610494575b80518252602083111561049457602082019150602081019050602083039250610470565b505050905090810190601f1680156104c05780820380516001836020036101000a031916815260200191505b5087810384528b818151815260200191508051906020019080838360008314610508575b805182526020831115610508576020820191506020810190506020830392506104e4565b505050905090810190601f1680156105345780820380516001836020036101000a031916815260200191505b5087810383528981815181526020019150805190602001908083836000831461057c575b80518252602083111561057c57602082019150602081019050602083039250610558565b505050905090810190601f1680156105a85780820380516001836020036101000a031916815260200191505b508781038252888181518152602001915080519060200190808383600083146105f0575b8051825260208311156105f0576020820191506020810190506020830392506105cc565b505050905090810190601f16801561061c5780820380516001836020036101000a031916815260200191505b509d505050505050505050505050505060405180910390f35b341561063d57fe5b610669600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506113af565b005b341561067357fe5b610836600480803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190803590602001909190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190803590602001909190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190803590602001909190803590602001909190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091905050611452565b604051808215151515815260200191505060405180910390f35b341561085857fe5b6108a8600480803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190505061170a565b604051808a8152602001806020018981526020018060200188815260200187815260200180602001806020018060200186810386528e81815181526020019150805190602001908083836000831461091f575b80518252602083111561091f576020820191506020810190506020830392506108fb565b505050905090810190601f16801561094b5780820380516001836020036101000a031916815260200191505b5086810385528c818151815260200191508051906020019080838360008314610993575b8051825260208311156109935760208201915060208101905060208303925061096f565b505050905090810190601f1680156109bf5780820380516001836020036101000a031916815260200191505b50868103845289818151815260200191508051906020019080838360008314610a07575b805182526020831115610a07576020820191506020810190506020830392506109e3565b505050905090810190601f168015610a335780820380516001836020036101000a031916815260200191505b50868103835288818151815260200191508051906020019080838360008314610a7b575b805182526020831115610a7b57602082019150602081019050602083039250610a57565b505050905090810190601f168015610aa75780820380516001836020036101000a031916815260200191505b50868103825287818151815260200191508051906020019080838360008314610aef575b805182526020831115610aef57602082019150602081019050602083039250610acb565b505050905090810190601f168015610b1b5780820380516001836020036101000a031916815260200191505b509e50505050505050505050505050505060405180910390f35b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60006000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610bbc5760006000fd5b60018a6040518082805190602001908083835b60208310610bf25780518252602082019150602081019050602083039250610bcf565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020905088816009019080519060200190610c3f929190611afc565b508781600a019080519060200190610c58929190611afc565b508681600b019080519060200190610c71929190611afc565b508581600c019080519060200190610c8a929190611afc565b508481600d01819055508381600e019080519060200190610cac929190611afc565b508281600f019080519060200190610cc5929190611afc565b508060018b6040518082805190602001908083835b60208310610cfd5780518252602082019150602081019050602083039250610cda565b6001836020036101000a03801982511681845116808217855250505050505090500191505090815260200160405180910390206000820154816000015560018201816001019080546001816001161561010002031660029004610d61929190611b7c565b506002820154816002015560038201816003019080546001816001161561010002031660029004610d93929190611b7c565b50600482015481600401556005820154816005015560068201816006019080546001816001161561010002031660029004610dcf929190611b7c565b5060078201816007019080546001816001161561010002031660029004610df7929190611b7c565b5060088201816008019080546001816001161561010002031660029004610e1f929190611b7c565b5060098201816009019080546001816001161561010002031660029004610e47929190611b7c565b50600a820181600a019080546001816001161561010002031660029004610e6f929190611b7c565b50600b820181600b019080546001816001161561010002031660029004610e97929190611b7c565b50600c820181600c019080546001816001161561010002031660029004610ebf929190611b7c565b50600d82015481600d0155600e820181600e019080546001816001161561010002031660029004610ef1929190611b7c565b50600f820181600f019080546001816001161561010002031660029004610f19929190611b7c565b50905050600191505b5b5098975050505050505050565b610f38611c03565b610f40611c03565b610f48611c03565b610f50611c03565b6000610f5a611c03565b610f62611c03565b60006001896040518082805190602001908083835b60208310610f9a5780518252602082019150602081019050602083039250610f77565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902090508060090181600a0182600b0183600c0184600d015485600e0186600f01868054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156110815780601f1061105657610100808354040283529160200191611081565b820191906000526020600020905b81548152906001019060200180831161106457829003601f168201915b50505050509650858054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561111d5780601f106110f25761010080835404028352916020019161111d565b820191906000526020600020905b81548152906001019060200180831161110057829003601f168201915b50505050509550848054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156111b95780601f1061118e576101008083540402835291602001916111b9565b820191906000526020600020905b81548152906001019060200180831161119c57829003601f168201915b50505050509450838054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156112555780601f1061122a57610100808354040283529160200191611255565b820191906000526020600020905b81548152906001019060200180831161123857829003601f168201915b50505050509350818054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156112f15780601f106112c6576101008083540402835291602001916112f1565b820191906000526020600020905b8154815290600101906020018083116112d457829003601f168201915b50505050509150808054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561138d5780601f106113625761010080835404028352916020019161138d565b820191906000526020600020905b81548152906001019060200180831161137057829003601f168201915b5050505050905097509750975097509750975097505b50919395979092949650565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561140c5760006000fd5b80600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b5b50565b600061145c611c17565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156114b95760006000fd5b8a8160000181815250508981602001819052508881604001818152505087816060018190525086816080018181525050858160a0018181525050848160c00181905250838160e00181905250828161010001819052508060018d6040518082805190602001908083835b602083106115465780518252602082019150602081019050602083039250611523565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060008201518160000155602082015181600101908051906020019061159f929190611cd7565b506040820151816002015560608201518160030190805190602001906115c6929190611cd7565b506080820151816004015560a0820151816005015560c08201518160060190805190602001906115f7929190611cd7565b5060e0820151816007019080519060200190611614929190611cd7565b50610100820151816008019080519060200190611632929190611cd7565b50610120820151816009019080519060200190611650929190611cd7565b5061014082015181600a01908051906020019061166e929190611cd7565b5061016082015181600b01908051906020019061168c929190611cd7565b5061018082015181600c0190805190602001906116aa929190611cd7565b506101a082015181600d01556101c082015181600e0190805190602001906116d3929190611cd7565b506101e082015181600f0190805190602001906116f1929190611cd7565b50905050600191505b5b509a9950505050505050505050565b6000611714611c03565b600061171e611c03565b6000600061172a611c03565b611732611c03565b61173a611c03565b600060018b6040518082805190602001908083835b60208310611772578051825260208201915060208101905060208303925061174f565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020905080600001548160010182600201548360030184600401548560050154866006018760070188600801878054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156118645780601f1061183957610100808354040283529160200191611864565b820191906000526020600020905b81548152906001019060200180831161184757829003601f168201915b50505050509750858054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156119005780601f106118d557610100808354040283529160200191611900565b820191906000526020600020905b8154815290600101906020018083116118e357829003601f168201915b50505050509550828054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561199c5780601f106119715761010080835404028352916020019161199c565b820191906000526020600020905b81548152906001019060200180831161197f57829003601f168201915b50505050509250818054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015611a385780601f10611a0d57610100808354040283529160200191611a38565b820191906000526020600020905b815481529060010190602001808311611a1b57829003601f168201915b50505050509150808054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015611ad45780601f10611aa957610100808354040283529160200191611ad4565b820191906000526020600020905b815481529060010190602001808311611ab757829003601f168201915b505050505090509950995099509950995099509950995099505b509193959799909294969850565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10611b3d57805160ff1916838001178555611b6b565b82800160010185558215611b6b579182015b82811115611b6a578251825591602001919060010190611b4f565b5b509050611b789190611d57565b5090565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10611bb55780548555611bf2565b82800160010185558215611bf257600052602060002091601f016020900482015b82811115611bf1578254825591600101919060010190611bd6565b5b509050611bff9190611d57565b5090565b602060405190810160405280600081525090565b6102006040519081016040528060008152602001611c33611d7c565b815260200160008152602001611c47611d7c565b81526020016000815260200160008152602001611c62611d7c565b8152602001611c6f611d7c565b8152602001611c7c611d7c565b8152602001611c89611d7c565b8152602001611c96611d7c565b8152602001611ca3611d7c565b8152602001611cb0611d7c565b815260200160008152602001611cc4611d7c565b8152602001611cd1611d7c565b81525090565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10611d1857805160ff1916838001178555611d46565b82800160010185558215611d46579182015b82811115611d45578251825591602001919060010190611d2a565b5b509050611d539190611d57565b5090565b611d7991905b80821115611d75576000816000905550600101611d5d565b5090565b90565b6020604051908101604052806000815250905600a165627a7a72305820c30de3d02998aa60f641d1f29950a8f3ca6d63eb4fc6455e03c5009a9c8f95a90029";
var contract_address = '0x7bc9a52cd4e0aaca080fce4a81c1a56b3091b27f';

console.log(`server is running on port ${port_num}`);
app.listen(port_num);

app.get('/tickets/:id', (req,res,next)=> {
	if (req.query.auth_code != '123123123'){return res.sendStatus(400)}
	web3.eth.contract(abi).at(contract_address).getTicketData1(req.params.id, (err,data1)=>{
		if (err){ return res.json({err:err})}
		web3.eth.contract(abi).at(contract_address).getTicketData2(req.params.id, (err,data2)=>{
			if (err){ return res.json({err:err})}
			var data = data1;
			for (var key in data2) {
				data.push(data2[key]);
			};
			res.json(data);
		});
	});
});

app.post('/tickets/:id', (req,res,next)=> {
	if (req.query.auth_code != '123123123'){return res.sendStatus(400)}
	web3.eth.contract(abi).at(contract_address).setTicketData1(
		req.params.id, 
		req.body.status,        
		req.body.serial,        
		req.body.number,        
		req.body.seat_sector,   
		req.body.seat_row,      
		req.body.seat_number,   
		req.body.customer,      
		req.body.customer_name, 
		req.body.event,  
		{from:creator, gas:4995000},
		(err,ans)=>{
			if (err){ return res.sendStatus(401) }
			
			web3.eth.contract(abi).at(contract_address).setTicketData2(
				req.params.id, 
				req.body.event_title,   
				req.body.category,      
				req.body.category_name, 
				req.body.order,         
				req.body.price,         
				req.body.price_currency,
				req.body.updated_at,    
				{from:creator, gas:4995000},
				(err,ans)=>{
					if (err){ return res.sendStatus(401) }
					res.sendStatus(200)
				}
			)
		}	
	)
});