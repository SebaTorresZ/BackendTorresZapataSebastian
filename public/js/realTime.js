const socket = io();

const addProductForm = document.getElementById('addProductForm');

addProductForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(addProductForm);
    const product = {
        title: formData.get('title'),
        description: formData.get('description'),
        code: formData.get('code'),
        price: Number(formData.get('price')),
        stock: Number(formData.get('stock')),
        category: formData.get('category'),
    };

    socket.emit('new-product', product);
    addProductForm.reset();
});

const deleteProductForm = document.getElementById('deleteProductForm');

deleteProductForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const productId = document.querySelector('input[name="id"]').value;
    
    socket.emit('delete-product', productId);
    deleteProductForm.reset();
});


socket.on('update-products', (products) => {
    const productsList = document.getElementById('productsList');
    productsList.innerHTML = ''; 
    products.forEach(product => {
        const li = document.createElement('li');
        li.textContent = `ID: ${product.id} | ${product.title} - (Precio: $${product.price})`;
        productsList.appendChild(li);
    });
});