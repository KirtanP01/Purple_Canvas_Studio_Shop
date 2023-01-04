import axios from 'axios'
import { CART_ADD_ITEM } from '../constants/cartConstants'

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