var express   = require('express');
var app       = express();
var port_num  = process.env.PORT||4000;
var fs        = require('fs');
var config    = require('./config');
var BigNumber = require('bignumber.js');
var bodyParser = require('body-parser');

var creator = '0xb9af8aa42c97f5a1f73c6e1a683c4bf6353b83e7';
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider(process.env.ETH_NODE));

var abi   = [{"constant":true,"inputs":[],"name":"creator","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"id","type":"string"},{"name":"event_title_","type":"string"},{"name":"category_","type":"string"},{"name":"category_name_","type":"string"},{"name":"order_","type":"string"},{"name":"price_","type":"int256"},{"name":"price_currency_","type":"string"},{"name":"updated_at_","type":"string"}],"name":"setTicketData2","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"id","type":"string"}],"name":"getTicketData2","outputs":[{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"int256"},{"name":"","type":"string"},{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"newCreator","type":"address"}],"name":"changeCreator","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"id","type":"string"},{"name":"status_","type":"int256"},{"name":"serial_","type":"string"},{"name":"number_","type":"int256"},{"name":"seat_sector_","type":"string"},{"name":"seat_row_","type":"int256"},{"name":"seat_number_","type":"int256"},{"name":"customer_","type":"string"},{"name":"customer_name_","type":"string"},{"name":"event_","type":"string"}],"name":"setTicketData1","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"id","type":"string"}],"name":"getTicketData1","outputs":[{"name":"","type":"int256"},{"name":"","type":"string"},{"name":"","type":"int256"},{"name":"","type":"string"},{"name":"","type":"int256"},{"name":"","type":"int256"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"payable":false,"type":"fallback"}]
var bcode = "0x60606040526000600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550341561004e57fe5b5b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b5b611d89806100a16000396000f30060606040523615610076576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806302d05d3f1461008c5780632d0e8ba7146100de5780635bc575f2146102eb57806374580e2f146106355780637fd30bf61461066b578063d0cf4a6f14610850575b341561007e57fe5b61008a5b60006000fd5b565b005b341561009457fe5b61009c610b35565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34156100e657fe5b6102d1600480803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190803590602001909190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091905050610b5b565b604051808215151515815260200191505060405180910390f35b34156102f357fe5b610343600480803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091905050610f30565b6040518080602001806020018060200180602001888152602001806020018060200187810387528e8181518152602001915080519060200190808383600083146103ac575b8051825260208311156103ac57602082019150602081019050602083039250610388565b505050905090810190601f1680156103d85780820380516001836020036101000a031916815260200191505b5087810386528d818151815260200191508051906020019080838360008314610420575b805182526020831115610420576020820191506020810190506020830392506103fc565b505050905090810190601f16801561044c5780820380516001836020036101000a031916815260200191505b5087810385528c818151815260200191508051906020019080838360008314610494575b80518252602083111561049457602082019150602081019050602083039250610470565b505050905090810190601f1680156104c05780820380516001836020036101000a031916815260200191505b5087810384528b818151815260200191508051906020019080838360008314610508575b805182526020831115610508576020820191506020810190506020830392506104e4565b505050905090810190601f1680156105345780820380516001836020036101000a031916815260200191505b5087810383528981815181526020019150805190602001908083836000831461057c575b80518252602083111561057c57602082019150602081019050602083039250610558565b505050905090810190601f1680156105a85780820380516001836020036101000a031916815260200191505b508781038252888181518152602001915080519060200190808383600083146105f0575b8051825260208311156105f0576020820191506020810190506020830392506105cc565b505050905090810190601f16801561061c5780820380516001836020036101000a031916815260200191505b509d505050505050505050505050505060405180910390f35b341561063d57fe5b610669600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506113af565b005b341561067357fe5b610836600480803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190803590602001909190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190803590602001909190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190803590602001909190803590602001909190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091905050611452565b604051808215151515815260200191505060405180910390f35b341561085857fe5b6108a8600480803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190505061182b565b604051808a8152602001806020018981526020018060200188815260200187815260200180602001806020018060200186810386528e81815181526020019150805190602001908083836000831461091f575b80518252602083111561091f576020820191506020810190506020830392506108fb565b505050905090810190601f16801561094b5780820380516001836020036101000a031916815260200191505b5086810385528c818151815260200191508051906020019080838360008314610993575b8051825260208311156109935760208201915060208101905060208303925061096f565b505050905090810190601f1680156109bf5780820380516001836020036101000a031916815260200191505b50868103845289818151815260200191508051906020019080838360008314610a07575b805182526020831115610a07576020820191506020810190506020830392506109e3565b505050905090810190601f168015610a335780820380516001836020036101000a031916815260200191505b50868103835288818151815260200191508051906020019080838360008314610a7b575b805182526020831115610a7b57602082019150602081019050602083039250610a57565b505050905090810190601f168015610aa75780820380516001836020036101000a031916815260200191505b50868103825287818151815260200191508051906020019080838360008314610aef575b805182526020831115610aef57602082019150602081019050602083039250610acb565b505050905090810190601f168015610b1b5780820380516001836020036101000a031916815260200191505b509e50505050505050505050505050505060405180910390f35b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60006000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610bbc5760006000fd5b60018a6040518082805190602001908083835b60208310610bf25780518252602082019150602081019050602083039250610bcf565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020905088816009019080519060200190610c3f929190611c1d565b508781600a019080519060200190610c58929190611c1d565b508681600b019080519060200190610c71929190611c1d565b508581600c019080519060200190610c8a929190611c1d565b508481600d01819055508381600e019080519060200190610cac929190611c1d565b508281600f019080519060200190610cc5929190611c1d565b508060018b6040518082805190602001908083835b60208310610cfd5780518252602082019150602081019050602083039250610cda565b6001836020036101000a03801982511681845116808217855250505050505090500191505090815260200160405180910390206000820154816000015560018201816001019080546001816001161561010002031660029004610d61929190611c9d565b506002820154816002015560038201816003019080546001816001161561010002031660029004610d93929190611c9d565b50600482015481600401556005820154816005015560068201816006019080546001816001161561010002031660029004610dcf929190611c9d565b5060078201816007019080546001816001161561010002031660029004610df7929190611c9d565b5060088201816008019080546001816001161561010002031660029004610e1f929190611c9d565b5060098201816009019080546001816001161561010002031660029004610e47929190611c9d565b50600a820181600a019080546001816001161561010002031660029004610e6f929190611c9d565b50600b820181600b019080546001816001161561010002031660029004610e97929190611c9d565b50600c820181600c019080546001816001161561010002031660029004610ebf929190611c9d565b50600d82015481600d0155600e820181600e019080546001816001161561010002031660029004610ef1929190611c9d565b50600f820181600f019080546001816001161561010002031660029004610f19929190611c9d565b50905050600191505b5b5098975050505050505050565b610f38611d24565b610f40611d24565b610f48611d24565b610f50611d24565b6000610f5a611d24565b610f62611d24565b60006001896040518082805190602001908083835b60208310610f9a5780518252602082019150602081019050602083039250610f77565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902090508060090181600a0182600b0183600c0184600d015485600e0186600f01868054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156110815780601f1061105657610100808354040283529160200191611081565b820191906000526020600020905b81548152906001019060200180831161106457829003601f168201915b50505050509650858054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561111d5780601f106110f25761010080835404028352916020019161111d565b820191906000526020600020905b81548152906001019060200180831161110057829003601f168201915b50505050509550848054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156111b95780601f1061118e576101008083540402835291602001916111b9565b820191906000526020600020905b81548152906001019060200180831161119c57829003601f168201915b50505050509450838054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156112555780601f1061122a57610100808354040283529160200191611255565b820191906000526020600020905b81548152906001019060200180831161123857829003601f168201915b50505050509350818054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156112f15780601f106112c6576101008083540402835291602001916112f1565b820191906000526020600020905b8154815290600101906020018083116112d457829003601f168201915b50505050509150808054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561138d5780601f106113625761010080835404028352916020019161138d565b820191906000526020600020905b81548152906001019060200180831161137057829003601f168201915b5050505050905097509750975097509750975097505b50919395979092949650565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561140c5760006000fd5b80600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b5b50565b60006000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156114b35760006000fd5b60018c6040518082805190602001908083835b602083106114e957805182526020820191506020810190506020830392506114c6565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902090508a81600001819055508981600101908051906020019061153f929190611c1d565b5088816002018190555087816003019080519060200190611561929190611c1d565b508681600401819055508581600501819055508481600601908051906020019061158c929190611c1d565b50838160070190805190602001906115a5929190611c1d565b50828160080190805190602001906115be929190611c1d565b508060018d6040518082805190602001908083835b602083106115f657805182526020820191506020810190506020830392506115d3565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020600082015481600001556001820181600101908054600181600116156101000203166002900461165a929190611c9d565b50600282015481600201556003820181600301908054600181600116156101000203166002900461168c929190611c9d565b506004820154816004015560058201548160050155600682018160060190805460018160011615610100020316600290046116c8929190611c9d565b50600782018160070190805460018160011615610100020316600290046116f0929190611c9d565b5060088201816008019080546001816001161561010002031660029004611718929190611c9d565b5060098201816009019080546001816001161561010002031660029004611740929190611c9d565b50600a820181600a019080546001816001161561010002031660029004611768929190611c9d565b50600b820181600b019080546001816001161561010002031660029004611790929190611c9d565b50600c820181600c0190805460018160011615610100020316600290046117b8929190611c9d565b50600d82015481600d0155600e820181600e0190805460018160011615610100020316600290046117ea929190611c9d565b50600f820181600f019080546001816001161561010002031660029004611812929190611c9d565b50905050600191505b5b509a9950505050505050505050565b6000611835611d24565b600061183f611d24565b6000600061184b611d24565b611853611d24565b61185b611d24565b600060018b6040518082805190602001908083835b602083106118935780518252602082019150602081019050602083039250611870565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020905080600001548160010182600201548360030184600401548560050154866006018760070188600801878054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156119855780601f1061195a57610100808354040283529160200191611985565b820191906000526020600020905b81548152906001019060200180831161196857829003601f168201915b50505050509750858054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015611a215780601f106119f657610100808354040283529160200191611a21565b820191906000526020600020905b815481529060010190602001808311611a0457829003601f168201915b50505050509550828054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015611abd5780601f10611a9257610100808354040283529160200191611abd565b820191906000526020600020905b815481529060010190602001808311611aa057829003601f168201915b50505050509250818054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015611b595780601f10611b2e57610100808354040283529160200191611b59565b820191906000526020600020905b815481529060010190602001808311611b3c57829003601f168201915b50505050509150808054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015611bf55780601f10611bca57610100808354040283529160200191611bf5565b820191906000526020600020905b815481529060010190602001808311611bd857829003601f168201915b505050505090509950995099509950995099509950995099505b509193959799909294969850565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10611c5e57805160ff1916838001178555611c8c565b82800160010185558215611c8c579182015b82811115611c8b578251825591602001919060010190611c70565b5b509050611c999190611d38565b5090565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10611cd65780548555611d13565b82800160010185558215611d1357600052602060002091601f016020900482015b82811115611d12578254825591600101919060010190611cf7565b5b509050611d209190611d38565b5090565b602060405190810160405280600081525090565b611d5a91905b80821115611d56576000816000905550600101611d3e565b5090565b905600a165627a7a723058203a1604e0e952bc26834ac9162b44036200c0d15cae41b0f6be80146143b276b60029";
var contract_address = '0xb62d1e1aa71bb8c808008833c915f7d42f7c4a38';

console.log(`server is running on port ${port_num}`);
app.listen(port_num);

const maybeString = variable=>{
    if (typeof variable == 'undefined') return ''
    else return variable
}

const maybeNumber = variable=>{
    if (typeof variable == 'undefined') return 0
    else return variable
}

const intToStatus = status=>{
    if (status==0) return "vacant"
    if (status==1) return "sold"
    if (status==2) return "removed"
    return "vacant"
}

const statusToInt = status=>{
    if (status=="vacant")  return 0
    if (status=="sold")    return 1
    if (status=="removed") return 2
    return 0
}

const getContractStatus =out=>{
    if ( !(out.name) && !(out.serial) ) return "pending"
    else return "ok"
}

const updateMoment =()=>{
    var d = new Date()
    var DD   = d.getDate()       //Get the day as a number (1-31)
    var M    = d.getMonth() +1   //Get the month (0-11)
    var YYYY = d.getFullYear()   //Get the four digit year (yyyy)
    var HH   = d.getHours()      //Get the hour (0-23)
    var MM   = d.getMinutes()    //Get the minutes (0-59)
    var SS   = d.getSeconds()    //Get the seconds (0-59)
    return `${YYYY}-${M}-${DD} ${HH}:${MM}:${SS}`
}

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
			var out = {}
			out.status         = intToStatus(data[0])
			out.serial         = data[1]
			out.number         = +data[2]
			out.seat_sector    = data[3]
			out.seat_row       = data[4]
			out.seat_number    = data[5]
			out.customer       = data[6]
			out.customer_name  = data[7]
			out.event          = data[8]
			out.event_title    = data[9]
			out.category       = data[10]
			out.category_name  = data[11]
			out.order          = data[12]
			out.price          = +data[13]
			out.price_currency = data[14]
			out.updated_at     = data[15]
            out.contract_status = getContractStatus(out)
			res.json(out);
		});
	});
});

app.post('/tickets/:id', bodyParser.json(), (req,res,next)=> {
	if (req.query.auth_code != '123123123'){ return res.send('login error') }
	console.log('setTicketData1')
	web3.eth.contract(abi).at(contract_address).setTicketData1(
		maybeString(req.params.id), 
		statusToInt(req.body.status),        
		maybeString(req.body.serial),  

		maybeNumber(req.body.number),        
		maybeString(req.body.seat_sector),   
		maybeNumber(req.body.seat_row),    

		maybeNumber(req.body.seat_number),   
		maybeString(req.body.customer),      
		maybeString(req.body.customer_name), 

		maybeString(req.body.event),  

		{from:creator, gas:4995000},
		(err,c1)=>{
			if (err){ return res.json(err) }
            console.log('setTicketData2')

			web3.eth.contract(abi).at(contract_address).setTicketData2(

				maybeString(req.params.id), 
				maybeString(req.body.event_title),   
				maybeString(req.body.category),    

				maybeString(req.body.category_name), 
				maybeString(req.body.order),         
				maybeNumber(req.body.price),         

				maybeString(req.body.price_currency),
				updateMoment(),    

				{from:creator, gas:4995000},
				(err,c2)=>{
					if (err){ res.json(err) }
                    res.json({"transaction_hash":c2})
                }
			)
		}	
	)
});

// app.get('*?', (req,res,next)=> {return res.sendStatus(400)})
