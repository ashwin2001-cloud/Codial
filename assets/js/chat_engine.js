// through chat_engine.js file, we can communicate with the chat_sockets.js file
// chat_engine.js is the subscriber and chat_sockets.js is the observer

class ChatEngine{
    constructor(chatBoxId, userEmail){
        this.chatBox= $(`#${chatBoxId}`);
        this.userEmail= userEmail;
        this.socket= io.connect('http://localhost:5000');

        //if userEmail is present, then only connectionHandler() is called
        if(this.userEmail){
            this.connectionHandler();
        }
    }

    connectionHandler(){

        let self= this;

        //when connect event occurs
        this.socket.on('connect', function(){
            console.log('connection established using sockets...');
            
            //emit means sending an event
            self.socket.emit('join_room', {
                user_email: self.userEmail,
                chatroom: "Codial Room"
            })

            //on means detecting an event sent by client
            self.socket.on('user_joined', function(data){
                console.log('user joined!', data);
            })
        })
        
        //event when 'send' is clicked
        $('#send-message').click(function(){
            let msg= $('#chat-message-input').val();

            //if message is not empty
            if(msg != ''){
                self.socket.emit('send_message', {
                    message: msg,
                    user_email: self.userEmail,
                    chatroom: 'Codial Room'
                })

            }
        })

        self.socket.on('receive_message', function(data){
            console.log('message received', data.message);

            let newMessage= $('<li>');

            //checking whether message is 'self-message' or 'other-message'
            let messageType= 'other-messages';
            if(data.user_email == self.userEmail){
                messageType='self-messages';
            }

            newMessage.append($('<span>', {
                'html': data.message
            }))

            newMessage.append($('<sub>', {
                'html': data.user_email
            }))

            newMessage.addClass(messageType);
            $('#chat-messages-list').append(newMessage);

        })
    }
    
}