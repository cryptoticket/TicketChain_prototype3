pragma solidity ^0.4.4;

contract TicketLedger {
     address public  creator = 0x0;

     mapping (string => bool) tickets;

     function sellticket(string num) {
          tickets[num] = true;
     }

     function isticketsold(string num) constant returns (bool){
          // TODO: check num format here
          return tickets[num];
     }

     function TicketLedger(){
          creator = msg.sender;
     }

     /// This function is called when someone sends money to this contract directly.
     function (){
          throw;
     }
}
