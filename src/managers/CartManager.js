import { CartModel } from "../models/cart.model.js";

export class CartManager {

    constructor() {}

    async createCart() {
        return await CartModel.create({ products: [] });
    }

    async getCartById(id) {
        return await CartModel.findById(id).lean();
    }
    
    async addProductToCart(cid, pid) {
        const cart = await CartModel.findById(cid);
        if (!cart) throw new Error("Carrito no encontrado");

        const productIndex = cart.products.findIndex(p => p.product.equals(pid));
        
        if (productIndex > -1) {
            cart.products[productIndex].quantity += 1;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }
        
        await cart.save();
        return cart;
    }

    async updateCart(cid, products) {
        return await CartModel.findByIdAndUpdate(cid, { products }, { new: true }).lean();
    }
    
    async updateProductQuantity(cid, pid, quantity) {
        const cart = await CartModel.findById(cid);
        if (!cart) throw new Error("Carrito no encontrado");

        const productIndex = cart.products.findIndex(p => p.product.equals(pid));
        
        if (productIndex > -1) {
            cart.products[productIndex].quantity = quantity;
        } else {
            throw new Error("Producto no encontrado en el carrito");
        }
        
        await cart.save();
        return cart;
    }
    
    async removeProductFromCart(cid, pid) {
        return await CartModel.findByIdAndUpdate(
            cid,
            { $pull: { products: { product: pid } } },
            { new: true }
        ).lean();
    }

    async clearCart(cid) {
        return await CartModel.findByIdAndUpdate(
            cid,
            { $set: { products: [] } },
            { new: true }
        ).lean();
    }
}