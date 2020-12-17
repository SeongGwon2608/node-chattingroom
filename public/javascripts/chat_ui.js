//위험할 수 있는(사용자가 입력한 메시지 출력)
function divEscapedContentElement(message){
    console.log("유저 입력 메시지 " + message);
    message  = message + '11111';
    return $('<div></div>').text(message);
}

//시스템이 생성한 메시지 출력
function divSystemContentElement(message){
    console.log("시스템 생성 메시지 " + message);
    return $('<div></div>').html('<i>' + message + '</i>');
}

//사용자 입력을 위한 함수
function processUserInput(chatApp, socket){
    var message = $('#send-message').val();
    var systemMessage;

    if(message.charAt(0) == '/'){
        systemMessage = chatApp.processCommand(message);
        if(systemMessage){
            $('#message').append(divSystemContentElement(systemMessage));
        }
    }else{
        chatApp.sendMessage($('#room').text(), message);
        $('#message').append(divEscapedContentElement(message));
        $('#message').scrollTop($('#message').prop('scrollHeight'));
    }
    $('#send-message').val('');
}

//애플리케이션 초기화 
var socket = io.connect();
$(document).ready(function(){
    var chatApp = new Chat(socket);
    socket.on('nameResult', function(result){
        var message;

        if(result.success){
            message = '당신의 현재 이름은 ' + result.name + ' 입니다.';
        }else{
            message = result.message;
        }
        $('#messages').append(divSystemContentElement(message));
    });

    socket.on('joinResult', function(result){
        $('#room').text(result.room);
        $('#messages').append(divSystemContentElement('Room changed'));
    });

    socket.on('message', function(message){
        var newElement = $('<div></div>').text(message.text);
        $('messages').append(newElement);
    });

    socket.on('rooms', function(rooms){
        $('#room-list').empty();
        for(var room in rooms){
            room = room.substring(1, room.length);
            if(room != ''){
                $('#room-list').append(divSystemContentElement(room));
            }
        }

        $('#room-list div').click(function(){
            chatApp.processCommand('/join ' + $(this).text());
            $('#send-message').focus();
        });
    });

    setInterval(function(){
        socket.emit('rooms');
    }, 1000);

    $('#send-message').focus(function(){});

    $('#send-form').submit(function(){
        processUserInput(chatApp, socket);
        return false;
    });
});