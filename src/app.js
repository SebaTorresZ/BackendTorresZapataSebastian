import express from 'express';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './database.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js'; 

connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

const httpServer = app.listen(PORT, () => {
    console.log(`✅ Servidor escuchando en el puerto ${PORT}`);
});

const io = new Server(httpServer);

app.use('/api/products', productsRouter(io)); 
app.use('/api/carts', cartsRouter); 
app.use('/', viewsRouter); 

io.on('connection', (socket) => {
    console.log('🔌 Nuevo cliente conectado');
});