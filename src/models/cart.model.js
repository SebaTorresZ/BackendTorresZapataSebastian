import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ],
        default: []
    }
});

cartSchema.pre('findOne', function(next) {
    this.populate('products.product');
    next();
});

export const CartModel = mongoose.model('Cart', cartSchema);