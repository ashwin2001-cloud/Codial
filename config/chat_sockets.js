module.exports.chatSockets= function(socketServer){

    //we require socket-io here, and not in index.js file
    let io= require('socket.io')(socketServer, {
        cors: {
          origin: "http://localhost:8001",
          methods: ["GET", "POST"]
        }
      });
    
    //in this case, we write 'connection' and not 'connect'
    io.sockets.on('connection', function(socket){
        console.log('new connection received', socket.id);

        socket.on('disconnect', function(){
            console.log('socket disconnected');
        });

        socket.on('join_room', function(data){
            console.log('request for joining room received', data);

            socket.join(data.chatroom);
            io.in(data.chatroom).emit('user_joined', data);
        });

        socket.on('send_message', function(data){
            io.in(data.chatroom).emit('receive_message', data);
        });
    })

}