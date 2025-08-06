import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';

export class CartManager {
    constructor(path) {
        this.path = path;
    }

    async getCarts() {
        const data = await fs.readFile(this.path, 'utf-8');
        return JSON.parse(data);
    }

    async getCartById(id) {
        const carts = await this.getCarts();
        const cart = carts.find(c => c.id === id);
        if (!cart) throw new Error(`Carrito con id ${id} no encontrado.`);
        return cart;
    }
    
    async createCart() {
        const carts = await this.getCarts();
        const newCart = {
            id: uuidv4(),
            products: []
        };
        carts.push(newCart);
        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
        return newCart;
    }

    async addProductToCart(cartId, productId) {
        const carts = await this.getCarts();
        const cartIndex = carts.findIndex(c => c.id === cartId);

        if (cartIndex === -1) {
            throw new Error(`Carrito con id ${cartId} no encontrado.`);
        }
        
        const cart = carts[cartIndex];
        const productIndexInCart = cart.products.findIndex(p => p.product === productId);

        if (productIndexInCart > -1) {
            cart.products[productIndexInCart].quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }
        
        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
        return cart;
    }
}