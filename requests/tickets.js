
app.get('/api/v1/ticket/:address/sell', (req,res,next)=> {
	contracts.call_API_method(SellTicket)(req.params.address, (err,ans)=>{
		if (err){ res.sendStatus(401) }
		else  res.json(ans);
	})
});

app.get('/api/v1/ticket/:address', (req,res,next)=> {
     contracts.call_API_method(IsTicketSold)(req.params.address, (err,ans)=>{
          if (err){ return res.sendStatus(401) }

          // TODO: object should be like this
          // http://docs.ticketchain2.apiary.io/#reference/0/tickets/sell-a-ticket
          res.json(ans);
     });
});

