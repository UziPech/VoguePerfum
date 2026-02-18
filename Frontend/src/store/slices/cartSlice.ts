import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product, CartItem } from '../../../types';

interface CartState {
    items: CartItem[];
    isOpen: boolean;
}

const initialState: CartState = {
    items: JSON.parse(localStorage.getItem('cart') || '[]'),
    isOpen: false,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<Product>) => {
            const existingItem = state.items.find(item => item.id === action.payload.id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.items.push({ ...action.payload, quantity: 1 });
            }
            localStorage.setItem('cart', JSON.stringify(state.items));
            state.isOpen = true; // Open cart when adding item
        },
        removeFromCart: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter(item => item.id !== action.payload);
            localStorage.setItem('cart', JSON.stringify(state.items));
        },
        updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
            const { id, quantity } = action.payload;
            const item = state.items.find(item => item.id === id);
            if (item) {
                if (quantity <= 0) {
                    state.items = state.items.filter(i => i.id !== id);
                } else {
                    item.quantity = quantity;
                }
                localStorage.setItem('cart', JSON.stringify(state.items));
            }
        },
        toggleCart: (state, action: PayloadAction<boolean | undefined>) => {
            state.isOpen = action.payload !== undefined ? action.payload : !state.isOpen;
        },
        clearCart: (state) => {
            state.items = [];
            localStorage.removeItem('cart');
        }
    },
});

export const { addToCart, removeFromCart, updateQuantity, toggleCart, clearCart } = cartSlice.actions;

// Selectors
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartTotal = (state: { cart: CartState }) =>
    state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
export const selectCartCount = (state: { cart: CartState }) =>
    state.cart.items.reduce((count, item) => count + item.quantity, 0);
export const selectIsCartOpen = (state: { cart: CartState }) => state.cart.isOpen;

export default cartSlice.reducer;
