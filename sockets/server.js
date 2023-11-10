const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const allowedOrigins = ["http://driverbase.app", "https://driverbase.app","http://localhost:3000","http://localhost:3001"]
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