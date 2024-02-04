const express = require('express');
const ProductManager = require('./src/ProductManager');

const app = express();
const port = 8080;

const productManager = new ProductManager('./lista-productos.json');

app.use((req, res, next) => {
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'none'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com"
    );
    next();
});

app.get('/', (req, res) => {
    res.send('Página de inicio 😊.');
});

app.get('/products', async (req, res) => {
    const limit = req.query.limit;

    try {
        await productManager.loadProducts();
        const products = limit ? productManager.getProducts().slice(0, limit) : productManager.getProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

app.get('/products/:pid', async (req, res) => {
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

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
