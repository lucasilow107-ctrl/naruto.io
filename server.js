const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

 Phục vụ các file tĩnh (HTML, CSS, JS, Hình ảnh) trong thư mục hiện tại
app.use(express.static(__dirname));

let players = {};
const MAX_PLAYERS = 12;  Giới hạn tối đa 12 người

io.on('connection', (socket) = {
     Kiểm tra số lượng người chơi
    if (Object.keys(players).length = MAX_PLAYERS) {
        socket.emit('server_full', 'Server đã đầy! Vui lòng thử lại sau.');
        socket.disconnect();  Ngắt kết nối nếu vượt quá 12 người
        return;
    }

    console.log('Một nhẫn giả vừa tham gia ' + socket.id);
    
     Thêm người chơi mới vào danh sách
    players[socket.id] = {
        id socket.id,
        x 500,  Tọa độ X xuất hiện ở Lobby
        y 500   Tọa độ Y xuất hiện ở Lobby
    };

     Gửi danh sách người chơi cho tất cả mọi người
    io.emit('updatePlayers', players);

     Khi người chơi di chuyển (Nhận dữ liệu từ Client)
    socket.on('playerMovement', (movementData) = {
        if(players[socket.id]) {
            players[socket.id].x = movementData.x;
            players[socket.id].y = movementData.y;
             Cập nhật vị trí mới cho toàn bộ server
            io.emit('updatePlayers', players);
        }
    });

     Khi người chơi thoát game
    socket.on('disconnect', () = {
        console.log('Một nhẫn giả đã rời đi ' + socket.id);
        delete players[socket.id];
        io.emit('updatePlayers', players);
    });
});

http.listen(3000, () = {
    console.log('Server Naruto .IO đang chạy tại httplocalhost3000');
});