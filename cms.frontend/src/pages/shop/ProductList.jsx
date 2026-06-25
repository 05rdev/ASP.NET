import React from 'react';
import ProductCard from '../../components/ProductCard';




function ProductList({ products }) {
    return (
        <div className="row">
            {products.map(product => (
                // Chia cấu trúc col-md-4 (3 cột 1 hàng trên PC) chuẩn Bootstrap 4
                <div className="col-md-4 col-sm-6 mb-4" key={product.id}>
                    <ProductCard item={product} />
                </div>
            ))}
        </div>
    );
}




export default ProductList;
