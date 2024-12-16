import express from 'express';
import AppRoute from './routes/app.route.js'
import cors from 'cors';
import { createServer } from 'http';
// import * as SocketIO from 'socket.io'
import dotenv from 'dotenv';

const app = express();
const server = createServer(app);


app.use(cors());

app.use("/uploads", express.static('uploads'));

app.use(express.json()); // para que el servidor pueda recibir los datos en formato json
app.use('/', AppRoute);

dotenv.config();

server.listen(2025, () => {
    console.log('Servidor corriendo en http://localhost:2025/')
});

process.on('SIGINT', async () => {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
    process.exit(0);
  });
