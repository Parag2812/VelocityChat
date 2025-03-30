import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import http from 'http';
import cors from 'cors';
// import {socketIO} from'socket.io';
import helmet from 'helmet';
import morgan from 'morgan';




console.log("DATABASE_URL:", process.env.DATABASE_URL);
import { Server } from 'socket.io';
import { sequelize,runMigrations} from './models/index.js';


// Import your route modules (note the .js extension)
import userRoutes from './routes/user.js';
import chatRoutes from './routes/chat.js';
import messageRoutes from './routes/message.js';

const app = express();

// Middleware
app.use(express.json()); // Built-in JSON parser
app.use(cors());         // Enable CORS
app.use(helmet());       // Set various HTTP headers for security
app.use(morgan('dev'));  // Log HTTP requests





// Use routes
app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/messages', messageRoutes);


// Create the HTTP server after setting up the app
const server = http.createServer(app);

// Now initialize Socket.IO with the created server
const io = new Server(server);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected');

  // Example event handler:
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});



app.get('/api/test',(req, res)=>{
    res.send('Hello World from API');
});





// dotenv.config();

// mongoose.connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false,
// })
// .then(() => console.log('MongoDB Connected...'))
// .catch(err => console.log(err));


// // Socket.IO
// const io = socketIO(server);

// io.on('connection', (socket) => {
//     console.log('New user connected');

//     socket.on('joinRoom', ({ room, username }) => {
//         socket.join(room);
//         socket.emit('message', { user: 'admin', text: `${username}, welcome to the room!` });
//         socket.broadcast.to(room).emit('message', { user: 'admin', text: `${username} has joined the room!` });
//     });

//     socket.on('sendMessage', (msg) => {
//         io.to(msg.room).emit('message', msg);
//     });

//     socket.on('disconnect', () => {
//         console.log('User disconnected');
//     });
// });


// Test database connection and sync models
sequelize
  .authenticate()
  .then(async () => {
    console.log('Connected to PostgreSQL');
    await runMigrations(); // Run migrations after successful connection
    // return sequelize.sync({ alter: true }); // If you need to sync models (use with caution in production)
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });


const PORT = process.env.PORT || 3000;
server.listen(PORT,()=>{
    console.log(`Server listening on port ${PORT}`);
});


