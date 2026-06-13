import React from 'react';
import ProductCard from '../../components/ProductCard';

function ProductList({ products }) {
    return (
        <div className="row">
            {products.map((product) => (
                <div className="col-xl-4 col-lg-4 col-sm-6 col-12 mb-4" key={product.id}>
                    <ProductCard item={product} />
                </div>
            ))}
        </div>
    );
}

export default ProductList;
