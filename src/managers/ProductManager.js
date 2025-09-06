import { ProductModel } from "../models/product.model.js";

export class ProductManager {

    constructor() {}

    async getProducts(params) {
        const { limit = 10, page = 1, sort, query } = params;
        const filter = query ? { category: query, status: true } : { status: true };
        const options = {
            page,
            limit,
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : undefined,
            lean: true 
        };

        const result = await ProductModel.paginate(filter, options);
        
        const response = {
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/products?limit=${limit}&page=${result.prevPage}&sort=${sort || ''}&query=${query || ''}` : null,
            nextLink: result.hasNextPage ? `/products?limit=${limit}&page=${result.nextPage}&sort=${sort || ''}&query=${query || ''}` : null,
        };
        
        return response;
    }

    async getProductById(id) {
        return await ProductModel.findById(id).lean();
    }
    
    async addProduct(productData) {
        return await ProductModel.create(productData);
    }
    
    async updateProduct(id, productData) {
        return await ProductModel.findByIdAndUpdate(id, productData, { new: true }).lean();
    }
    
    async deleteProduct(id) {
        return await ProductModel.findByIdAndDelete(id).lean();
    }
}