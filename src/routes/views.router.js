import { Router } from 'express';
import { ProductManager } from '../managers/ProductManager.js';
import { CartManager } from '../managers/CartManager.js';

const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

router.get('/products', async (req, res) => {
    try {
        const productsData = await productManager.getProducts(req.query);
        res.render('products', { 
            ...productsData, 
            title: "Lista de Productos" 
        });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
});

router.get('/carts/:cid', async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid);
        if (!cart) {
            return res.status(404).send('Carrito no encontrado');
        }
        res.render('cart', { 
            ...cart, 
            title: "Contenido del Carrito" 
        });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
});

export default router;