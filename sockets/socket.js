const { createServer } = require("http");
const { Server } = require("socket.io");

 let clienturls,environment 
 // to be toggled depending on the client type
  /*localhost: */  environment = 'local'
 ///*liveserver: */  environment = 'live'
 // /*testserver: */ environment = 'test'
 
 if(environment === 'local'){
   /*localhost: */  clienturls = ['http://localhost:3000','http://localhost:3001']
 }
 else if(environment === 'live'){
   /*liveserver: */ clienturls = ['https://driverbase.app','http://driverbase.app'] // for production's sake
 }
 else if(environment === 'test'){
  /*testserver: */  clienturls = ['https://test.driverbase.app','http://test.driverbase.app'] // the api to be used when deployed to the test site
 }
 else{
    /*liveserver: */ clienturls = ['https://driverbase.app','http://driverbase.app'] // for production's sake
 }

const httpServer = createServer();
const allowedOrigins = clienturls
const io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins
    }
  });

io.on("connection", (socket) => {
    // CHAT APP LIVE UPDATE STUFF
    socket.on('msgfor',(data)=>{  // listen to message events
        // console.log(data)
        io.emit('msgfor'+data.uid,data) // tell a specific user that they have a new message from a user 
    })
    
});

httpServer.listen(3002);