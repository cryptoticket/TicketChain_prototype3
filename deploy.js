var config    = require('./config');
var solc      = require('solc');
var fs        = require('fs');
var assert    = require('assert');
var BigNumber = require('bignumber.js');
var creator   = '0xb9af8aa42c97f5a1f73c6e1a683c4bf6353b83e7';
var contract  = '0x11b1ea539e7dc0de066615594ee76519aca9894e';
var Web3  = require('web3');
var web3  = new Web3(new Web3.providers.HttpProvider(process.env.ETH_NODE));
var abi   = [{"constant":true,"inputs":[],"name":"creator","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"id","type":"string"},{"name":"event_title_","type":"string"},{"name":"category_","type":"string"},{"name":"category_name_","type":"string"},{"name":"order_","type":"string"},{"name":"price_","type":"int256"},{"name":"price_currency_","type":"string"},{"name":"updated_at_","type":"string"}],"name":"setTicketData2","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"id","type":"string"}],"name":"getTicketData2","outputs":[{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"int256"},{"name":"","type":"string"},{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"id","type":"string"},{"name":"status_","type":"int256"},{"name":"serial_","type":"string"},{"name":"number_","type":"int256"},{"name":"seat_sector_","type":"string"},{"name":"seat_row_","type":"int256"},{"name":"seat_number_","type":"int256"},{"name":"customer_","type":"string"},{"name":"customer_name_","type":"string"},{"name":"event_","type":"string"}],"name":"setTicketData1","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"id","type":"string"}],"name":"getTicketData1","outputs":[{"name":"","type":"int256"},{"name":"","type":"string"},{"name":"","type":"int256"},{"name":"","type":"string"},{"name":"","type":"int256"},{"name":"","type":"int256"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"payable":false,"type":"fallback"}]
var bcode = '0x60606040526000600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550341561004e57fe5b5b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b5b611c1c806100a16000396000f3006060604052361561006b576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806302d05d3f146100815780632d0e8ba7146100d35780635bc575f2146102e05780637fd30bf61461062a578063d0cf4a6f1461080f575b341561007357fe5b61007f5b60006000fd5b565b005b341561008957fe5b610091610af4565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34156100db57fe5b6102c6600480803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190803590602001909190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091905050610b1a565b604051808215151515815260200191505060405180910390f35b34156102e857fe5b610338600480803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091905050610e91565b6040518080602001806020018060200180602001888152602001806020018060200187810387528e8181518152602001915080519060200190808383600083146103a1575b8051825260208311156103a15760208201915060208101905060208303925061037d565b505050905090810190601f1680156103cd5780820380516001836020036101000a031916815260200191505b5087810386528d818151815260200191508051906020019080838360008314610415575b805182526020831115610415576020820191506020810190506020830392506103f1565b505050905090810190601f1680156104415780820380516001836020036101000a031916815260200191505b5087810385528c818151815260200191508051906020019080838360008314610489575b80518252602083111561048957602082019150602081019050602083039250610465565b505050905090810190601f1680156104b55780820380516001836020036101000a031916815260200191505b5087810384528b8181518152602001915080519060200190808383600083146104fd575b8051825260208311156104fd576020820191506020810190506020830392506104d9565b505050905090810190601f1680156105295780820380516001836020036101000a031916815260200191505b50878103835289818151815260200191508051906020019080838360008314610571575b8051825260208311156105715760208201915060208101905060208303925061054d565b505050905090810190601f16801561059d5780820380516001836020036101000a031916815260200191505b508781038252888181518152602001915080519060200190808383600083146105e5575b8051825260208311156105e5576020820191506020810190506020830392506105c1565b505050905090810190601f1680156106115780820380516001836020036101000a031916815260200191505b509d505050505050505050505050505060405180910390f35b341561063257fe5b6107f5600480803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190803590602001909190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190803590602001909190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190803590602001909190803590602001909190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091905050611310565b604051808215151515815260200191505060405180910390f35b341561081757fe5b610867600480803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190505061156a565b604051808a8152602001806020018981526020018060200188815260200187815260200180602001806020018060200186810386528e8181518152602001915080519060200190808383600083146108de575b8051825260208311156108de576020820191506020810190506020830392506108ba565b505050905090810190601f16801561090a5780820380516001836020036101000a031916815260200191505b5086810385528c818151815260200191508051906020019080838360008314610952575b8051825260208311156109525760208201915060208101905060208303925061092e565b505050905090810190601f16801561097e5780820380516001836020036101000a031916815260200191505b508681038452898181518152602001915080519060200190808383600083146109c6575b8051825260208311156109c6576020820191506020810190506020830392506109a2565b505050905090810190601f1680156109f25780820380516001836020036101000a031916815260200191505b50868103835288818151815260200191508051906020019080838360008314610a3a575b805182526020831115610a3a57602082019150602081019050602083039250610a16565b505050905090810190601f168015610a665780820380516001836020036101000a031916815260200191505b50868103825287818151815260200191508051906020019080838360008314610aae575b805182526020831115610aae57602082019150602081019050602083039250610a8a565b505050905090810190601f168015610ada5780820380516001836020036101000a031916815260200191505b509e50505050505050505050505050505060405180910390f35b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000600060018a6040518082805190602001908083835b60208310610b545780518252602082019150602081019050602083039250610b31565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020905088816009019080519060200190610ba192919061195c565b508781600a019080519060200190610bba92919061195c565b508681600b019080519060200190610bd392919061195c565b508581600c019080519060200190610bec92919061195c565b508481600d01819055508381600e019080519060200190610c0e92919061195c565b508281600f019080519060200190610c2792919061195c565b508060018b6040518082805190602001908083835b60208310610c5f5780518252602082019150602081019050602083039250610c3c565b6001836020036101000a03801982511681845116808217855250505050505090500191505090815260200160405180910390206000820154816000015560018201816001019080546001816001161561010002031660029004610cc39291906119dc565b506002820154816002015560038201816003019080546001816001161561010002031660029004610cf59291906119dc565b50600482015481600401556005820154816005015560068201816006019080546001816001161561010002031660029004610d319291906119dc565b5060078201816007019080546001816001161561010002031660029004610d599291906119dc565b5060088201816008019080546001816001161561010002031660029004610d819291906119dc565b5060098201816009019080546001816001161561010002031660029004610da99291906119dc565b50600a820181600a019080546001816001161561010002031660029004610dd19291906119dc565b50600b820181600b019080546001816001161561010002031660029004610df99291906119dc565b50600c820181600c019080546001816001161561010002031660029004610e219291906119dc565b50600d82015481600d0155600e820181600e019080546001816001161561010002031660029004610e539291906119dc565b50600f820181600f019080546001816001161561010002031660029004610e7b9291906119dc565b50905050600191505b5098975050505050505050565b610e99611a63565b610ea1611a63565b610ea9611a63565b610eb1611a63565b6000610ebb611a63565b610ec3611a63565b60006001896040518082805190602001908083835b60208310610efb5780518252602082019150602081019050602083039250610ed8565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902090508060090181600a0182600b0183600c0184600d015485600e0186600f01868054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610fe25780601f10610fb757610100808354040283529160200191610fe2565b820191906000526020600020905b815481529060010190602001808311610fc557829003601f168201915b50505050509650858054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561107e5780601f106110535761010080835404028352916020019161107e565b820191906000526020600020905b81548152906001019060200180831161106157829003601f168201915b50505050509550848054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561111a5780601f106110ef5761010080835404028352916020019161111a565b820191906000526020600020905b8154815290600101906020018083116110fd57829003601f168201915b50505050509450838054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156111b65780601f1061118b576101008083540402835291602001916111b6565b820191906000526020600020905b81548152906001019060200180831161119957829003601f168201915b50505050509350818054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156112525780601f1061122757610100808354040283529160200191611252565b820191906000526020600020905b81548152906001019060200180831161123557829003601f168201915b50505050509150808054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156112ee5780601f106112c3576101008083540402835291602001916112ee565b820191906000526020600020905b8154815290600101906020018083116112d157829003601f168201915b5050505050905097509750975097509750975097505b50919395979092949650565b600061131a611a77565b8a8160000181815250508981602001819052508881604001818152505087816060018190525086816080018181525050858160a0018181525050848160c00181905250838160e00181905250828161010001819052508060018d6040518082805190602001908083835b602083106113a75780518252602082019150602081019050602083039250611384565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020600082015181600001556020820151816001019080519060200190611400929190611b37565b50604082015181600201556060820151816003019080519060200190611427929190611b37565b506080820151816004015560a0820151816005015560c0820151816006019080519060200190611458929190611b37565b5060e0820151816007019080519060200190611475929190611b37565b50610100820151816008019080519060200190611493929190611b37565b506101208201518160090190805190602001906114b1929190611b37565b5061014082015181600a0190805190602001906114cf929190611b37565b5061016082015181600b0190805190602001906114ed929190611b37565b5061018082015181600c01908051906020019061150b929190611b37565b506101a082015181600d01556101c082015181600e019080519060200190611534929190611b37565b506101e082015181600f019080519060200190611552929190611b37565b50905050600191505b509a9950505050505050505050565b6000611574611a63565b600061157e611a63565b6000600061158a611a63565b611592611a63565b61159a611a63565b600060018b6040518082805190602001908083835b602083106115d257805182526020820191506020810190506020830392506115af565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020905080600001548160010182600201548360030184600401548560050154866006018760070188600801878054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156116c45780601f10611699576101008083540402835291602001916116c4565b820191906000526020600020905b8154815290600101906020018083116116a757829003601f168201915b50505050509750858054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156117605780601f1061173557610100808354040283529160200191611760565b820191906000526020600020905b81548152906001019060200180831161174357829003601f168201915b50505050509550828054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156117fc5780601f106117d1576101008083540402835291602001916117fc565b820191906000526020600020905b8154815290600101906020018083116117df57829003601f168201915b50505050509250818054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156118985780601f1061186d57610100808354040283529160200191611898565b820191906000526020600020905b81548152906001019060200180831161187b57829003601f168201915b50505050509150808054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156119345780601f1061190957610100808354040283529160200191611934565b820191906000526020600020905b81548152906001019060200180831161191757829003601f168201915b505050505090509950995099509950995099509950995099505b509193959799909294969850565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061199d57805160ff19168380011785556119cb565b828001600101855582156119cb579182015b828111156119ca5782518255916020019190600101906119af565b5b5090506119d89190611bb7565b5090565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10611a155780548555611a52565b82800160010185558215611a5257600052602060002091601f016020900482015b82811115611a51578254825591600101919060010190611a36565b5b509050611a5f9190611bb7565b5090565b602060405190810160405280600081525090565b6102006040519081016040528060008152602001611a93611bdc565b815260200160008152602001611aa7611bdc565b81526020016000815260200160008152602001611ac2611bdc565b8152602001611acf611bdc565b8152602001611adc611bdc565b8152602001611ae9611bdc565b8152602001611af6611bdc565b8152602001611b03611bdc565b8152602001611b10611bdc565b815260200160008152602001611b24611bdc565b8152602001611b31611bdc565b81525090565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10611b7857805160ff1916838001178555611ba6565b82800160010185558215611ba6579182015b82811115611ba5578251825591602001919060010190611b8a565b5b509050611bb39190611bb7565b5090565b611bd991905b80821115611bd5576000816000905550600101611bbd565b5090565b90565b6020604051908101604052806000815250905600a165627a7a723058206d244c4ef647ae6961d3a2caf939bc65c05c5f1bf749defce9aa3fdce315cc9a0029';

deployContract=()=>{ 
     var tempContract = web3.eth.contract(abi);
     tempContract.new({from:creator, gas:4995000, data:bcode}, (err,res)=>{
          if (err){console.log('deploy-err:',err); return err};
          console.log('res:', res.address);
     });
};

deployContract()

// web3.eth.getAccounts((err,acc)=>{
//      if (err){console.log('getAccounts-err:',err)}
//           console.log(acc[0])
//      deployContract(acc[0])
// });
