pragma solidity ^0.4.11;

contract TicketLedger {
     address public  creator = 0x0;

     mapping (string => Ticket) tickets;

     modifier onlyByCreator(){
          if(msg.sender!=creator)
               throw;
          _;
     }

     enum Status {
          Vacant,
          Sold,
          Removed
     }

     struct Ticket {
          int status;
          string serial;
          int number;
        
          string seat_sector;
          int seat_row;
          int seat_number;

          string customer;
          string customer_name;

          string event_record;
          string event_title;
          string category;
          string category_name;

          string order;
          int price;
          string price_currency;

          string updated_at;
     }

     function TicketLedger(){
          creator = msg.sender;
     }

     function changeCreator(address newCreator) onlyByCreator{
          creator = newCreator;
     }

     function getTicketData1(string id) constant returns (
          int, string, int, 
          string, int, int, 
          string, string, string
          ){
          Ticket t = tickets[id];
          return (t.status,      t.serial,        t.number, 
                  t.seat_sector, t.seat_row,      t.seat_number, 
                  t.customer,    t.customer_name, t.event_record
                  );
     }

     function getTicketData2(string id) constant returns (
          string, string, string, 
          string, int,    string, 
          string
          ){
          Ticket t = tickets[id];
          return (t.event_title, t.category,      t.category_name, 
                  t.order,       t.price,         t.price_currency, 
                  t.updated_at
                  );
     }

     function setTicketData1(
          string id,              int status_,         string serial_, 
          int number_,            string seat_sector_, int seat_row_, 
          int seat_number_,       string customer_,    string customer_name_, 
          string event_
          ) onlyByCreator returns (bool success){
          Ticket memory newTicket;
          newTicket.status         = status_;
          newTicket.serial         = serial_;
          newTicket.number         = number_;
          newTicket.seat_sector    = seat_sector_;
          newTicket.seat_row       = seat_row_;
          newTicket.seat_number    = seat_number_;
          newTicket.customer       = customer_;
          newTicket.customer_name  = customer_name_;
          newTicket.event_record   = event_;

          tickets[id] = newTicket;
          success = true;
          return;
     }
     
     function setTicketData2(
          string id,              string event_title_, string category_, 
          string category_name_,  string order_,       int price_,       
          string price_currency_, string updated_at_
          ) onlyByCreator returns (bool success){
          Ticket t = tickets[id];

          t.event_title    = event_title_;
          t.category       = category_;
          t.category_name  = category_name_;
          t.order          = order_;
          t.price          = price_;
          t.price_currency = price_currency_;
          t.updated_at     = updated_at_;
        
          tickets[id] = t;
          success = true;
          return;
     }

     function (){
          throw;
     }
}
 

// status        
// serial        
// number        
// seat_sector   
// seat_row      
// seat_number   
// customer      
// customer_name 
// event_record  
// event_title   
// category      
// category_name 
// order         
// price         
// price_currency
// updated_at    