import { createContext, useReducer, useContext } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TO_CART':
            const item = action.payload;
            const existItem = state.cartItems.find((x) => x.product === item.product);

            if (existItem) {
                return {
                    ...state,
                    cartItems: state.cartItems.map((x) =>
                        x.product === existItem.product ? item : x
                    ),
                };
            } else {
                return {
                    ...state,
                    cartItems: [...state.cartItems, item],
                };
            }
        case 'REMOVE_FROM_CART':
            return {
                ...state,
                cartItems: state.cartItems.filter((x) => x.product !== action.payload),
            };
        case 'SAVE_SHIPPING_ADDRESS':
            return {
                ...state,
                shippingAddress: action.payload,
            };
        case 'SAVE_PAYMENT_METHOD':
            return {
                ...state,
                paymentMethod: action.payload,
            };
        case 'CLEAR_CART':
            return {
                ...state,
                cartItems: [],
            };
        default:
            return state;
    }
};

export const CartProvider = ({ children }) => {
    const initialState = {
        cartItems: localStorage.getItem('cartItems')
            ? JSON.parse(localStorage.getItem('cartItems'))
            : [],
        shippingAddress: localStorage.getItem('shippingAddress')
            ? JSON.parse(localStorage.getItem('shippingAddress'))
            : {},
        paymentMethod: 'PayPal',
    };

    const [state, dispatch] = useReducer(cartReducer, initialState);

    const addToCart = (item) => {
        dispatch({ type: 'ADD_TO_CART', payload: item });
        localStorage.setItem('cartItems', JSON.stringify([...state.cartItems, item] /* This logic needs to be careful about current state vs new item, doing helper below is better */));
        // Fixing local storage sync in effect or helper
    };

    // Better implementation of helpers to ensuring storage sync
    const addToCartHandler = (item) => {
        // Logic to handle existing item update for localStorage
        let newItems;
        const existItem = state.cartItems.find((x) => x.product === item.product);
        if (existItem) {
            newItems = state.cartItems.map((x) => x.product === existItem.product ? item : x);
        } else {
            newItems = [...state.cartItems, item];
        }
        dispatch({ type: 'ADD_TO_CART', payload: item });
        localStorage.setItem('cartItems', JSON.stringify(newItems));
    }

    const removeFromCartHandler = (id) => {
        dispatch({ type: 'REMOVE_FROM_CART', payload: id });
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems.filter(x => x.product !== id)));
    };

    const saveShippingAddress = (data) => {
        dispatch({ type: 'SAVE_SHIPPING_ADDRESS', payload: data });
        localStorage.setItem('shippingAddress', JSON.stringify(data));
    };

    const savePaymentMethod = (data) => {
        dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: data });
        localStorage.setItem('paymentMethod', JSON.stringify(data));
    };

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
        localStorage.removeItem('cartItems');
    };

    return (
        <CartContext.Provider value={{ ...state, addToCart: addToCartHandler, removeFromCart: removeFromCartHandler, saveShippingAddress, savePaymentMethod, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
