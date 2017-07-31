var express  = require('express');
var app      = express();
var port_num = 3000;
var fs       = require('fs');
var insert_file = (filename)=> eval(fs.readFileSync(filename)+'');

var contracts = require('./helpers/contracts.js')

insert_file('requests/info.js');
insert_file('requests/tickets.js');

console.log(`server is running on port ${port_num}`) 
app.listen(port_num)