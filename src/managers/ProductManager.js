import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';

export class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async getProducts(limit) {
        const data = await fs.readFile(this.path, 'utf-8');
        const products = JSON.parse(data);
        if (limit) {
            return products.slice(0, parseInt(limit));
        }
        return products;
    }

    async getProductById(id) {
        const products = await this.getProducts();
        const product = products.find(p => p.id === id);
        if (!product) throw new Error(`Producto con id ${id} no encontrado.`);
        return product;
    }

    async addProduct(productData) {
        const { title, description, code, price, status = true, stock, category, thumbnails } = productData;
        if (!title || !description || !code || price === undefined || stock === undefined || !category) {
            throw new Error("Faltan campos obligatorios.");
        }

        const products = await this.getProducts();
        if (products.some(p => p.code === code)) {
            throw new Error(`Ya existe un producto con el código ${code}.`);
        }

        const newProduct = {
            id: uuidv4(),
            title, description, code,
            price: Number(price),
            status,
            stock: Number(stock),
            category,
            thumbnails: thumbnails || []
        };

        products.push(newProduct);
        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
        return newProduct;
    }

    async updateProduct(id, updatedFields) {
        const products = await this.getProducts();
        const productIndex = products.findIndex(p => p.id === id);

        if (productIndex === -1) {
            throw new Error(`Producto con id ${id} no encontrado.`);
        }
        
        delete updatedFields.id;
        products[productIndex] = { ...products[productIndex], ...updatedFields };

        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
        return products[productIndex];
    }

    async deleteProduct(id) {
        let products = await this.getProducts();
        const initialLength = products.length;
        products = products.filter(p => p.id !== id);

        if (products.length === initialLength) {
            throw new Error(`Producto con id ${id} no encontrado para eliminar.`);
        }

        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
        return { message: `Producto con id ${id} eliminado.` };
    }
}