const fs = require('fs');

class ProductManager {
    constructor(filePath) {
        this.products = [];
        this.autoIncrementId = 1;
        this.path = filePath;
        this.loadProducts(); 
    }

    async loadProducts() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            this.products = JSON.parse(data);
        } catch (error) {
            this.products = [];
        }
    }

    async saveProducts() {
        try {
            const data = JSON.stringify(this.products, null, 2);
            await fs.promises.writeFile(this.path, data);
        } catch (error) {
            console.error('Error al guardar productos en el archivo', error);
        }
    }

    addProduct({ title, description, price, code, stock, status = true, category, thumbnails = [] }) {
        if (!title || !description || !price || !code || !stock || !category) {
            console.error('Todos los campos son obligatorios');
            return;
        }

        const codeExists = this.products.some((product) => product.code === code);
        if (codeExists) {
            console.error('Ya existe un producto con ese código, favor validar nuevamente');
            return;
        }

        const newProduct = {
            id: this.autoIncrementId++,
            title,
            description,
            price,
            code,
            stock,
            status,
            category,
            thumbnails,
        };

        this.products.push(newProduct);
        console.log('Producto agregado correctamente:', newProduct);

        this.saveProducts();
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find((product) => product.id === id);

        if (product) {
            return product;
        } else {
            console.error('Producto no encontrado');
        }
    }

    updateProduct(id, updatedFields) {
        const index = this.products.findIndex((product) => product.id === id);

        if (index !== -1) {
            this.products[index] = { ...this.products[index], ...updatedFields };
            console.log('Producto actualizado correctamente:', this.products[index]);
            this.saveProducts();
        } else {
            console.error('Producto no encontrado');
        }
    }

    deleteProduct(id) {
        const index = this.products.findIndex((product) => product.id === id);

        if (index !== -1) {
            const deletedProduct = this.products.splice(index, 1)[0];
            console.log('Producto eliminado correctamente:', deletedProduct);
            this.saveProducts();
        } else {
            console.error('Producto no encontrado');
        }
    }
}

module.exports = ProductManager;
