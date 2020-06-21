const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const socketio = require('socket.io')
const http = require('http');
const cors = require('cors');
let players = [];
const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketio(server);

const PORT = 3000;


// BodyParser Middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


// Set global vars
app.use((req, res, next)=>{
    //res.locals.gameSessions = gameSessions; // equivalent to: 'var gameSessions = gameSessions'
    next();
});


/*

//setup use of the socket.io controller
io.on('connect', (socket) => {
    console.log("New socket connected");
    socket_controller(socket, io);
})


*/

// const dgram = require('dgram');
// const serverUDP = dgram.createSocket('udp4');
//
// const numDigits = (x) => {
//     return (Math.log10((x ^ (x >> 31)) - (x >> 31)) | 0) + 1;
// };
//
// const convertToFloat32 = (byte1, byte2, byte3, byte4) => {
//     const buffer = new ArrayBuffer(4);
//     const bytes = new Uint8Array(buffer);
//     bytes[0] = byte1;
//     bytes[1] = byte2;
//     bytes[2] = byte3;
//     bytes[3] = byte4;
//     const view = new DataView(buffer);
//     return view.getFloat32(0, false);
// };
//
// const convertToInt32 = (byte1, byte2, byte3, byte4) => {
//     const buffer = new ArrayBuffer(4);
//     const bytes = new Uint8Array(buffer);
//     bytes[0] = byte1;
//     bytes[1] = byte2;
//     bytes[2] = byte3;
//     bytes[3] = byte4;
//     const view = new DataView(buffer);
//     return view.getInt32(0, false);
// };
//
// const strToBytes = (str) => {
//     let bytes = []; // char codes
//     let bytesv2 = []; // char codes
//
//     for (let i = 0; i < str.length; ++i) {
//         let code = str.charCodeAt(i);
//         bytes = bytes.concat([code]);
//         bytesv2 = bytesv2.concat([code & 0xff, code / 256 >>> 0]);
//     }
//     return bytesv2;
// };
//
// // sending to one client only
// const sendString = (strMessage, serverUDP, address, port) =>{
//     const messageLength = strMessage.length;
//     let buf1 = Buffer.from(`${numDigits(messageLength)}${messageLength}${strMessage}`, 'utf8');
//     serverUDP.send(buf1, port, address, (err) => {
//         //callback
//     });
// };
//
// // sending to all clients, include sender
// const emitString = (strMessage, serverUDP) =>{
//     const messageLength = strMessage.length;
//     let buf1 = Buffer.from(`${numDigits(messageLength)}${messageLength}${strMessage}`, 'utf8');
//     players.forEach(player => {
//         serverUDP.send(buf1, player.port, player.address, (err) => {
//             //callback
//         });
//     });
// };
//
// // sending to all clients except id
// const broadcastString = (strMessage, serverUDP, id) =>{
//     const messageLength = strMessage.length;
//     let buf1 = Buffer.from(`${numDigits(messageLength)}${messageLength}${strMessage}`, 'utf8');
//     players.forEach(player => {
//         if(player.id !== id){
//             serverUDP.send(buf1, player.port, player.address, (err) => {
//                 //callback
//             });
//         }
//     });
// };
//
// serverUDP.on('error', (err) => {
//     console.log(`server error:\n${err.stack}`);
//     serverUDP.close();
// });
//
// serverUDP.on('message', (msg, rinfo) => {
//     console.log("message");
//     console.log(msg[0]);
//     let x, y, z, idBytes, displayNameLength, displayNameBytes, senderAddress, senderPort;
//     senderAddress = rinfo.address;
//     senderPort = rinfo.port;
//     console.log(senderAddress);
//     console.log(senderPort);
//     if(msg[0] === 255){ // POSITION CHANGE
//         x = convertToFloat32(msg[1], msg[2], msg[3], msg[4]);
//         y = convertToFloat32(msg[5], msg[6], msg[7], msg[8]);
//         z = convertToFloat32(msg[9], msg[10], msg[11], msg[12]);
//         id = msg.slice(13 ,msg.length);
//         console.log(`id: ${id} x: ${x} y: ${y} z: ${z}`);
//     }else if(msg[0] === 254){ // JOIN
//         x = convertToFloat32(msg[1], msg[2], msg[3], msg[4]);
//         y = convertToFloat32(msg[5], msg[6], msg[7], msg[8]);
//         z = convertToFloat32(msg[9], msg[10], msg[11], msg[12]);
//         displayNameLength = convertToInt32(msg[13], msg[14], msg[15], msg[16]);
//         displayNameBytes = msg.slice(17, 17+displayNameLength);
//         idBytes = msg.slice(17+displayNameLength ,msg.length);
//         console.log(`displayName: ${displayNameBytes} id: ${idBytes} x: ${x} y: ${y} z: ${z}`);
//         const idBytesView = new Uint8Array(idBytes);
//         const displayNameBytesView = new Uint8Array(displayNameBytes);
//         const id = new TextDecoder().decode(idBytesView);
//         const displayName = new TextDecoder().decode(displayNameBytesView);
//         players.push({
//             id: id.toString(),
//             address: senderAddress,
//             port: senderPort,
//         });
//         emitString("ramtin", serverUDP);
//     }else if(msg[0] === 253){ // connection
//         let buf1 = Buffer.from("1", 'utf8');
//         serverUDP.send(buf1, senderPort, senderAddress, (err) => {
//             //callback
//         });
//     }
//
// });

// serverUDP.on('listening', () => {
//     console.log("listening");
//     const address = serverUDP.address();
//     console.log(`server listening ${address.address}:${address.port}`);
// });

// serverUDP.bind((PORT), "www.unity-cloud-server.herokuapp.com", () => {
//     console.log("hosting");
// });
// serverUDP.bind((PORT), "127.0.0.1", () => {
//     console.log("hosting");
// });
// Prints: server listening 0.0.0.0:41234


const socket_controller = require('./server/controllers/socket.controller.js');
io.on('connection', (socket) => {

    console.log('We have a new connection!!!');
    socket_controller(socket, io, players, (client_socketID) => {
        players = players.filter(player => player.client_id !== client_socketID);
    });

});
// hello
// Use routes
const router = require('./server/routes/router');
app.use(router);

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.send('404');
});

server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
