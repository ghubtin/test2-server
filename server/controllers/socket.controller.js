const uuidv4 = require('uuid/v4');

module.exports = (client_socket, io, players, callback) => {

    client_socket.on('JOIN', ({id, displayName, x, y, z}, callback) => {
        console.log("JOIN");
        const player = {
            id: id,
            client_id: client_socket.id,
        };
        players.push(player);
        // console.log(players);
        const error = false;
        if(error){
            callback({error: 'error'});
        }
        //io.sockets.emit("JOIN", {players: players});
        client_socket.broadcast.emit('JOIN', {
            id: id,
            displayName: displayName,
            x: x,
            y: y,
            z: z
        });
    });

    client_socket.on('PING', ({msg}, callback) => {
        console.log(msg);
        const error = false;
        if(error){
            callback({error: 'error'});
        }
        io.sockets.emit("PONG", {msg: "PONG"});
    });

    client_socket.on('position_change', (data, callback) => {
        const error = false;
        if(error){
            callback({error: 'error'});
        }
        client_socket.broadcast.emit('position_change', data);
    });

    client_socket.on('LOAD', (data, callback) => {
        players.forEach(player => {
            if(player.client_id === client_socket.id){
                client_socket.broadcast.emit('PLAYER_DISCONNECTED', {
                    id: player.id,
                });
            }
        });
        callback(client_socket.id);

    });

    client_socket.on('disconnect', ()=> {
        players.forEach(player => {
            if(player.client_id === client_socket.id){
                client_socket.broadcast.emit('PLAYER_DISCONNECTED', {
                    id: player.id,
                });
            }
        });
        callback(client_socket.id);
        console.log(`User (with client_socket.id = ${client_socket.id}  has left`);
    })
};
