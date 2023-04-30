import axios from 'axios'
import { 
    CART_ADD_ITEM, 
    CART_REMOVE_ITEM, 
    CART_SAVE_SHIPPING_ADDRESS, 
    CART_SAVE_PAYMENT_METHOD,
    CART_RESET,
} from '../constants/cartConstants'

export const addToCart = (id, qty) => async (dispatch, getState) => {
    //console.log('Quantity1: ' + qty)
    //console.log('Product1: ' + id)
    const { data } = await axios.get(`/api/products/${id}`)
    //console.log('Quantity2: ' + qty)
    //console.log('Product2: ' + id)
    dispatch({
        type: CART_ADD_ITEM,
        payload: {
            product: data._id,
            name: data.name,
            image: data.image,
            price: data.price,
            quantityInStock: data.quantityInStock,
            qty,
        },
    })

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}

export const removeFromCart = (id) => (dispatch, getState) => {
    dispatch({
        type: CART_REMOVE_ITEM,
        payload: id
    })

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}

export const saveShippingAddress = (data) => (dispatch) => {
    dispatch({
        type: CART_SAVE_SHIPPING_ADDRESS,
        payload: data
    })

    localStorage.setItem('shippingAddress', JSON.stringify(data))
}

export const savePaymentMethod= (data) => (dispatch) => {
    dispatch({
        type: CART_SAVE_PAYMENT_METHOD,
        payload: data
    })

    localStorage.setItem('paymentMethod', JSON.stringify(data))
}

export const cartReset= (data) => (dispatch) => {
    dispatch({
        type: CART_RESET,
        payload: data
    })

    localStorage.setItem('paymentMethod', JSON.stringify(data))
}