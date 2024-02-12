const express = require('express');
const ProductManager = require('./src/ProductManager');
const CartManager = require('./src/CartManager');
const axios = require('axios');

const app = express();
const port = 8080;
const serverUrl = `http://localhost:${port}`;

const productManager = new ProductManager('./lista-productos.json');
const cartManager = new CartManager('./carrito.json');

app.use(express.json());

// Middleware para definir la CSP
app.use((req, res, next) => {
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'none'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com"
    );
    next();
});

// Ruta de bienvenida para la raíz
app.get('/', (req, res) => {
    res.send('¡Bienvenido a la aplicación!');
});

// Rutas para productos
const productRouter = express.Router();

productRouter.get('/', async (req, res) => {
    const limit = req.query.limit;

    try {
        await productManager.loadProducts();
        const products = limit ? productManager.getProducts().slice(0, limit) : productManager.getProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

// Ruta GET /:pid para obtener un producto por su id
productRouter.get('/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid);

    try {
        await productManager.loadProducts();
        const product = productManager.getProductById(productId);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener producto' });
    }
});

// Ruta POST / para agregar un nuevo producto
productRouter.post('/', (req, res) => {
    const productData = req.body;

    try {
        productManager.addProduct(productData);
        res.status(201).json({ message: 'Producto agregado correctamente' });
    } catch (error) {
        res.status(400).json({ error: 'Error al agregar producto' });
    }
});

// Ruta PUT /:pid para actualizar un producto por su id
productRouter.put('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    const updatedFields = req.body;

    try {
        productManager.updateProduct(productId, updatedFields);
        res.json({ message: 'Producto actualizado correctamente' });
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar producto' });
    }
});

// Ruta DELETE /:pid para eliminar un producto por su id
productRouter.delete('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);

    try {
        productManager.deleteProduct(productId);
        res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(400).json({ error: 'Error al eliminar producto' });
    }
});

app.use('/products', productRouter);

// Rutas para carritos
const cartRouter = express.Router();

cartRouter.post('/', async (req, res) => {
    try {
        const cartId = await cartManager.createCart();
        res.json({ cartId });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear carrito' });
    }
});

cartRouter.get('/:cid', async (req, res) => {
    const cartId = req.params.cid;

    try {
        const cart = await cartManager.getCartById(cartId);

        if (cart) {
            res.json(cart);
        } else {
            res.status(404).json({ error: 'Carrito no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener carrito' });
    }
});

cartRouter.post('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        const addedProduct = await cartManager.addProductToCart(cartId, productId);
        res.json(addedProduct);
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar producto al carrito' });
    }
});

app.use('/carts', cartRouter);

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en ${serverUrl}`);
});

// Función para hacer solicitudes GET
async function testGET(url) {
    try {
        const response = await axios.get(url);
        console.log('GET:', response.data);
    } catch (error) {
        console.error('Error en GET:', error.response.data);
    }
}

// Función para hacer solicitudes POST
async function testPOST(url, data) {
    try {
        const response = await axios.post(url, data);
        console.log('POST:', response.data);
    } catch (error) {
        console.error('Error en POST:', error.response.data);
    }
}

// Función para hacer solicitudes PUT
async function testPUT(url, data) {
    try {
        const response = await axios.put(url, data);
        console.log('PUT:', response.data);
    } catch (error) {
        console.error('Error en PUT:', error.response.data);
    }
}

// Función para hacer solicitudes DELETE
async function testDELETE(url) {
    try {
        const response = await axios.delete(url);
        console.log('DELETE:', response.data);
    } catch (error) {
        console.error('Error en DELETE:', error.response.data);
    }
}
