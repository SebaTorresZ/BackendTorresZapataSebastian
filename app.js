const express = require('express');
const http = require('http');
const exphbs = require('express-handlebars');
const path = require('path');
const ProductManager = require('./src/ProductManager');
const CartManager = require('./src/CartManager');
const axios = require('axios');

const app = express();
const httpServer = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(httpServer, {
    cors: {
        origin: '*',
    },
    allowEIO3: true,
    serveClient: true,
    transports: ['websocket'],
    httpCompression: true,
    cookie: false,
});

const port = 8080;
const serverUrl = `http://localhost:${port}`;

const productManager = new ProductManager('./lista-productos.json');
const cartManager = new CartManager('./carrito.json');

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'src', 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'none'; script-src 'self' http://localhost:8080 'unsafe-inline'; style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com; connect-src 'self' ws://localhost:8080 http://localhost:8080"
    );
    next();
});

app.get('/home', async (req, res) => {
    try {
        await productManager.loadProducts();
        const products = productManager.getProducts();
        res.render('home', { products });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

app.get('/realTimeProducts', async (req, res) => {
    try {
        await productManager.loadProducts();
        const products = productManager.getProducts();
        res.render('realTimeProducts', { products });
        io.emit('connectedClient', 'Cliente conectado');
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos en tiempo real' });
    }
});

io.on('connection', (socket) => {
    console.log("Cliente conectado a través de Socket.io");

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });

    socket.on('addProduct', (productData) => {
        try {
            productManager.addProduct(productData);
            io.emit('productAdded', productManager.getProducts());
        } catch (error) {
            console.error('Error al agregar producto:', error);
        }
    });

    socket.on('deleteProduct', (productId) => {
        try {
            productManager.deleteProduct(productId);
            io.emit('productDeleted', productId);
        } catch (error) {
            console.error('Error al eliminar producto:', error);
        }
    });
});

app.get('/', (req, res) => {
    res.send('¡Bienvenido a la aplicación!');
});

const server = httpServer.listen(port, () => {
    console.log(`Servidor corriendo en ${serverUrl}`);
});
