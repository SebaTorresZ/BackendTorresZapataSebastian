const fs = require('fs');

class CartManager {
    constructor(filePath) {
        this.carts = [];
        this.path = filePath;
        this.loadCarts(); 
    }

    async loadCarts() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            this.carts = JSON.parse(data);
        } catch (error) {
            this.carts = [];
        }
    }

    async saveCarts() {
        try {
            const data = JSON.stringify(this.carts, null, 2);
            await fs.promises.writeFile(this.path, data);
        } catch (error) {
            console.error('Error al guardar carritos en el archivo', error);
        }
    }

    async createCart() {
        const newCart = {
            id: Date.now().toString(), // Genera un ID único basado en el tiempo actual
            products: []
        };

        this.carts.push(newCart);
        await this.saveCarts();
        console.log('Carrito creado correctamente:', newCart);

        return newCart.id;
    }

    async getCartById(id) {
        const cart = this.carts.find(cart => cart.id === id);

        if (cart) {
            return cart;
        } else {
            console.error('Carrito no encontrado');
            return null;
        }
    }

    async addProductToCart(cartId, productId) {
        const cart = await this.getCartById(cartId);
        if (!cart) return;

        const productIndex = cart.products.findIndex(product => product.id === productId);
        if (productIndex !== -1) {
            // Si el producto ya está en el carrito, incrementa la cantidad
            cart.products[productIndex].quantity++;
        } else {
            // Si el producto no está en el carrito, agrégalo con cantidad 1
            cart.products.push({ id: productId, quantity: 1 });
        }

        await this.saveCarts();
        console.log('Producto agregado al carrito correctamente');
        return cart;
    }
}

module.exports = CartManager;
