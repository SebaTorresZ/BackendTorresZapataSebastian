class ProductManager {
    constructor() {
        this.products = [];
        this.autoIncrementId = 1;
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
        console.error("Todos los campos son obligatorios");
        return;
    }

    const codeExists = this.products.some((product) => product.code === code);
        if (codeExists) {
        console.error("Ya existe un producto con ese código, favor validar nuevamente");
        return;
        }


    const newProduct = {
        id: this.autoIncrementId++,
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        };

    this.products.push(newProduct);
    console.log("Producto agregado correctamente:", newProduct);
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find((product) => product.id === id);

        if (product) {
        return product;
        } else {
        console.error("Producto no encontrado");
        }
        }
    }
