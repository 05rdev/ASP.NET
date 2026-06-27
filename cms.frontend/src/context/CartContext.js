// src/context/CartContext.js
// Context API toàn cục quản lý trạng thái giỏ hàng xuyên suốt website
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

// 1. Tạo Context
const CartContext = createContext(null);

// 2. Provider bao bọc toàn bộ App
export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState(() => {
        const saved = localStorage.getItem('cartItems');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    /**
     * Thêm sản phẩm vào giỏ hàng.
     * Kiểm tra số lượng tồn kho trước khi thêm.
     */
    const addToCart = useCallback((product, qty = 1) => {
        setCartItems(prev => {
            const existed = prev.find(item => item.id === product.id);
            const currentQty = existed ? existed.quantity : 0;
            const newQty = currentQty + qty;

            if (product.stockQuantity !== undefined && product.stockQuantity !== null) {
                if (newQty > product.stockQuantity) {
                    alert(`Số lượng sản phẩm trong kho không đủ! (Tồn kho: ${product.stockQuantity}, Đã có: ${currentQty})`);
                    return prev;
                }
            }

            if (existed) {
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: newQty }
                        : item
                );
            }
            return [...prev, { ...product, quantity: qty }];
        });
    }, []);

    /**
     * Tăng số lượng sản phẩm trong giỏ
     */
    const increaseQty = useCallback((productId) => {
        setCartItems(prev =>
            prev.map(item => {
                if (item.id === productId) {
                    const newQty = item.quantity + 1;
                    if (item.stockQuantity !== undefined && item.stockQuantity !== null) {
                        if (newQty > item.stockQuantity) {
                            alert(`Số lượng sản phẩm trong kho không đủ! (Tối đa: ${item.stockQuantity})`);
                            return item;
                        }
                    }
                    return { ...item, quantity: newQty };
                }
                return item;
            })
        );
    }, []);

    /**
     * Giảm số lượng sản phẩm trong giỏ (tối thiểu = 1)
     */
    const decreaseQty = useCallback((productId) => {
        setCartItems(prev =>
            prev.map(item =>
                item.id === productId
                    ? { ...item, quantity: Math.max(1, item.quantity - 1) }
                    : item
            )
        );
    }, []);

    /**
     * Xóa một sản phẩm khỏi giỏ hàng
     */
    const removeFromCart = useCallback((productId) => {
        setCartItems(prev => prev.filter(item => item.id !== productId));
    }, []);

    /**
     * Dọn sạch toàn bộ giỏ hàng (dùng sau khi đặt hàng thành công)
     */
    const clearCart = useCallback(() => {
        setCartItems([]);
    }, []);

    /**
     * Tổng số lượng tất cả sản phẩm trong giỏ (hiển thị trên badge Header)
     */
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    /**
     * Tổng tiền của giỏ hàng
     */
    const totalAmount = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            increaseQty,
            decreaseQty,
            removeFromCart,
            clearCart,
            totalItems,
            totalAmount
        }}>
            {children}
        </CartContext.Provider>
    );
}

// 3. Custom hook để dùng Context dễ dàng hơn trong mọi component
export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart phải được dùng bên trong CartProvider');
    }
    return context;
}

export default CartContext;
