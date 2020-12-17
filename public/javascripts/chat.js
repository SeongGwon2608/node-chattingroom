var Chat = function(socket){
    this.socket = socket;
};

//채팅 메시지 전송
Chat.prototype.sendMessage = function(room, text){
    var message = {
        room: room,
        text: text
    };
    this.socket.emit('message', message);
};

//채팅방 변경
Chat.prototype.changeRoom = function(room){
    this.socket.emit('join', {
        newRoom: room
    });
};

Chat.prototype.processCommand = function(command){
    var words = command.split(' ');
    var command = words[0].substring(1, words[0].length).toLowerCase();
    var message = false;

    switch(command){
        case 'join':
            words.shift();
            var room = words.join(' ');
            this.changeRoom(room);
            break;
        case 'nick':
            words.shift();
            var name = words.join(' ');
            this.socket.emit('nameAttemp', name);
            break;
        default:
            message = 'Unrecognized command';
            break;
    }
    return message;
};