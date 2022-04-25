import Koa from "koa";
import { createServer } from "https";
import { Server } from "socket.io";
import cors from '@koa/cors';
import fs from 'fs'

const PORT = process.env.PORT || 5000

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

const app = new Koa();
app.use(cors())
const server = createServer(options, app.callback());
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on("connection", (socket) => {
  try {
    
    console.log('New user connected', socket.id)
    
    socket.on('whoAmI', () => {
      console.log('whoAmI', socket.id)
      socket.emit('getMe', { id: socket.id })
    })
    
    socket.on('new_tag', (data) => {
      console.log('new_tag', data)
      socket.to(data.channelId).emit('receive_new_tag', data)
    })
  } catch (error) {
   console.log('errir', error) 
   console.log('errir', error.message) 
  }
});

server.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`)
});