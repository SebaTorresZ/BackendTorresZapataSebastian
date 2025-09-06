import { Router } from 'express';
import { CartManager } from '../managers/CartManager.js';

const router = Router();
const cartManager = new CartManager();

router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json({ status: 'success', payload: newCart });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
        }
        res.status(200).json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const updatedCart = await cartManager.addProductToCart(cid, pid);
        res.status(200).json({ status: 'success', payload: updatedCart });
    } catch (error) {
        res.status(404).json({ status: 'error', error: error.message });
    }
});



router.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body;
        const updatedCart = await cartManager.updateCart(cid, products);
        res.status(200).json({ status: 'success', payload: updatedCart });
    } catch (error) {
        res.status(400).json({ status: 'error', error: error.message });
    }
});

router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        
        if (typeof quantity !== 'number' || quantity < 1) {
            return res.status(400).json({ status: 'error', error: 'La cantidad debe ser un número entero positivo.' });
        }
        
        const updatedCart = await cartManager.updateProductQuantity(cid, pid, quantity);
        res.status(200).json({ status: 'success', payload: updatedCart });
    } catch (error) {
        res.status(404).json({ status: 'error', error: error.message });
    }
});

router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const updatedCart = await cartManager.removeProductFromCart(cid, pid);
        res.status(200).json({ status: 'success', payload: updatedCart });
    } catch (error) {
        res.status(404).json({ status: 'error', error: error.message });
    }
});

router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const updatedCart = await cartManager.clearCart(cid);
        res.status(200).json({ status: 'success', payload: updatedCart });
    } catch (error) {
        res.status(404).json({ status: 'error', error: error.message });
    }
});

export default router;