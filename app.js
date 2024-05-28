import express from 'express';
import AppRoute from './routes/app.route.js'
import cors from 'cors';
import { createServer } from 'http';
import * as SocketIO from 'socket.io'
import 'dotenv/config'


// require('dotenv').config({path: './.env'});
const app = express();
const server = createServer(app);



const serverSocket = new SocketIO.Server(server, {
    cors:{
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    },
    transports: ['websocket']
});

const socketClient = serverSocket.on('connection', (socket) => {
    socket.emit('welcome', 'soy el servidor web');
    
    socket.on('disconect', () => {
    })
})

app.use(cors());

app.all('*', (req, res, next) => {
    if (socketClient) {
        req.socketClient = socketClient
    }
    next()
})

app.use(express.json()); // para que el servidor pueda recibir los datos en formato json
app.use('/', AppRoute);
app.get('dotenv');

server.listen(2025, () => {
    console.log('Servidor corriendo en http://localhost:2025/')
});

