import { Router } from 'express';
import { ProductManager } from '../managers/ProductManager.js';

const productsRouter = (io) => {
    const router = Router();
    const productManager = new ProductManager();

    router.get('/', async (req, res) => {
        try {
            const result = await productManager.getProducts(req.query);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ status: 'error', error: error.message });
        }
    });

    router.get('/:pid', async (req, res) => {
        try {
            const product = await productManager.getProductById(req.params.pid);
            if (!product) {
                return res.status(404).json({ status: 'error', error: "Producto no encontrado" });
            }
            res.status(200).json({ status: 'success', payload: product });
        } catch (error) {
            res.status(500).json({ status: 'error', error: error.message });
        }
    });

    router.post('/', async (req, res) => {
        try {
            const newProduct = await productManager.addProduct(req.body);
            const updatedProducts = await productManager.getProducts({});
            io.emit('update-products', updatedProducts.payload);
            res.status(201).json({ status: 'success', payload: newProduct });
        } catch (error) {
            res.status(400).json({ status: 'error', error: error.message });
        }
    });

    router.put('/:pid', async (req, res) => {
        try {
            const updatedProduct = await productManager.updateProduct(req.params.pid, req.body);
            if (!updatedProduct) {
                 return res.status(404).json({ status: 'error', error: "Producto no encontrado" });
            }
            res.status(200).json({ status: 'success', payload: updatedProduct });
        } catch (error) {
            res.status(400).json({ status: 'error', error: error.message });
        }
    });

    router.delete('/:pid', async (req, res) => {
        try {
            const deletedProduct = await productManager.deleteProduct(req.params.pid);
            if (!deletedProduct) {
                 return res.status(404).json({ status: 'error', error: "Producto no encontrado" });
            }
            const updatedProducts = await productManager.getProducts({});
            io.emit('update-products', updatedProducts.payload);
            res.status(200).json({ status: 'success', message: "Producto eliminado" });
        } catch (error) {
            res.status(500).json({ status: 'error', error: error.message });
        }
    });

    return router;
};

export default productsRouter;