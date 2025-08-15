import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import { CheckoutSteps } from '../components/CheckoutSteps'
//import Checkbox,{checked} from '../components/CheckBox'
import { saveShippingAddress } from '../actions/cartActions'

const ShippingPage = ({  }) => {

    const cart = useSelector(state => state.cart)
    const { shippingAddress } = cart

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    useEffect(() => {
        if(!userInfo){
            navigate('/login')
        }
    }, [userInfo])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(saveShippingAddress({ address: '728 Kentshire Cir', city: 'Elgin', postalCode: '60124', stateCode: 'IL', country: 'USA' }))
        navigate('/payment')
    }

    return <FormContainer>
        <CheckoutSteps step1 step2 />
        <h1>Shipping</h1>
        <h3>Pickup Address</h3>
        <Form onSubmit={submitHandler}>
            <Form.Group controlId='address'>
                <Form.Label>Address</Form.Label>
                <Form.Control 
                    type='text' 
                    value="728 Kentshire Cir"
                    readOnly
                ></Form.Control>
            </Form.Group>

            <Form.Group controlId='city'>
                <Form.Label>City</Form.Label>
                <Form.Control 
                    type='text' 
                    value="Elgin"
                    readOnly
                ></Form.Control>
            </Form.Group>

            <Form.Group controlId='postalCode'>
                <Form.Label>Postal Code</Form.Label>
                <Form.Control 
                    type='text' 
                    value="60124"
                    readOnly
                ></Form.Control>
            </Form.Group>
            
            <Form.Group controlId='stateCode'>
                <Form.Label>State</Form.Label>
                <Form.Control 
                    type='text' 
                    value="IL"
                    readOnly
                ></Form.Control>
            </Form.Group>

            <Form.Group controlId='country'>
                <Form.Label>Country</Form.Label>
                <Form.Control 
                    type='text' 
                    value="USA" 
                    readOnly
                ></Form.Control>
            </Form.Group>

            <Button type='submit' variant='primary'>
                Continue
            </Button>
        </Form>
    </FormContainer>
}

export default ShippingPage