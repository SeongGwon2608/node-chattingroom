var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var cache = {};
var chatServer = require('./lib/chat_server');

//404에러 발생시 처리할 함수
function send404(response){
    response.writeHead(404, {'Content-Type' : 'text/plain'});
    response.write('Error 404: resource not found.');
    response.end();
}

//파일 데이터 전송
function sendFile(response, filePath, fileContents){
    response.writeHead(200, {
        "content-type": mime.getType(path.basename(filePath))
    });
    response.end(fileContents);
}

function serveStatic(response, cache, absPath){
    //파일이 메모리에 캐시되어있는지 확인
    if(cache[absPath]){
        sendFile(response, absPath, cache[absPath]);
    }else{
        fs.exists(absPath, function(exists){
            if(exists){
                fs.readFile(absPath, function(err, data){
                    console.log(absPath);
                    if(err){
                        send404(response);
                    }else{
                        cache[absPath] = data;
                        sendFile(response, absPath, data);
                    }
                });
            }else{
                send404(response);
            }
        })
    }
}

//http 서버 생성
var server = http.createServer(function(request, response){
    var filePath = false;
    if(request.url == '/'){
        filePath = 'public/index.html';
    }else{
        filePath = 'public' + request.url;
    }
    var absPath = './' + filePath;
    serveStatic(response, cache, absPath);
});

server.listen(8000, function(){
    console.log("Server listening om port 8000")
});


chatServer.listen(server);