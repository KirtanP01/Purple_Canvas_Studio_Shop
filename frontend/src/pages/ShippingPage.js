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

    const [address, setAddress] = useState(shippingAddress ? shippingAddress.address : '')
    const [city, setCity] = useState(shippingAddress ? shippingAddress.city : '')
    const [postalCode, setPostalCode] = useState(shippingAddress ? shippingAddress.postalCode : '')
    const [stateCode, setStateCode] = useState(shippingAddress ? shippingAddress.stateCode : '')
    const [country, setCountry] = useState(shippingAddress ? shippingAddress.country : '')
    

    /*const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [postalCode, setPostalCode] = useState('')
    const [stateCode, setStateCode] = useState('')
    const [country, setCountry] = useState('')
    */

    //address=setAddress(useState(shippingAddress.address))
    //this.state = { fields: { address: shippingAddress.address, city: shippingAddress.city, postalCode: shippingAddress.postalCode, stateCode: shippingAddress.stateCode, country: shippingAddress.country } };
    
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
        isChecked ? dispatch(saveShippingAddress({ address: '1000 S Quentin Rd', city: 'Palatine', postalCode: '60067', stateCode: 'IL', country: 'USA' })) :
        dispatch(saveShippingAddress({ address, city, postalCode, stateCode, country }))
        navigate('/payment')
    }
    
    const [isChecked, setIsChecked] = useState(false);
    const handleChange = (e) => {
       setIsChecked(e.target.checked);
    }
    
      //<input type="checkbox"  name="schoolPickup" value={isChecked} onChange={handleChange} />
      //<label htmlFor="schoolPickup">&nbsp;&nbsp;School Pickup</label>

    return <FormContainer>
        <CheckoutSteps step1 step2 />
        <h1>Shipping</h1>
        <label> <input type="checkbox"  name="schoolPickup" value={isChecked} onChange={handleChange} /> &nbsp;School Pickup  </label>
        {isChecked ?
            <Form onSubmit={submitHandler}>
            <Form.Group controlId='address'>
                    <Form.Label>Address</Form.Label>
                    <Form.Control 
                        type='text' 
                        placeholder='Enter address' 
                        value="1000 S Quentin Rd"
                        onChange={(e) => setAddress(e.target.value)}
                    ></Form.Control>
                </Form.Group>
    
                <Form.Group controlId='city'>
                    <Form.Label>City</Form.Label>
                    <Form.Control 
                        type='city' 
                        placeholder='Enter city' 
                        value="Palatine"
                        onChange={(e) => setCity(e.target.value)}
                    ></Form.Control>
                </Form.Group>
    
                <Form.Group controlId='postalCode'>
                    <Form.Label>Postal Code</Form.Label>
                    <Form.Control 
                        type='postalCode' 
                        placeholder='Enter postalCode' 
                        value="60067"
                        onChange={(e) => setPostalCode(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                
                <Form.Group controlId='stateCode'>
                    <Form.Label>State</Form.Label>
                    <Form.Control 
                        type='stateCode' 
                        placeholder='Enter state' 
                        value="IL"
                        onChange={(e) => setStateCode(e.target.value)}
                    ></Form.Control>
                </Form.Group>
    
                <Form.Group controlId='country'>
                    <Form.Label>Country</Form.Label>
                    <Form.Control 
                        type='country' 
                        placeholder='Enter country' 
                        value="USA" 
                        onChange={(e) => setCountry(e.target.value)}
                    ></Form.Control>
                </Form.Group>
    
                <Button type='submit' variant='primary'>
                    Continue
                </Button>
            </Form>
         : 
         <Form onSubmit={submitHandler}>
         <Form.Group controlId='address'>
                 <Form.Label>Address</Form.Label>
                 <Form.Control 
                     type='text' 
                     placeholder='Enter address' 
                     value={address} 
                     onChange={(e) => setAddress(e.target.value)}
                 ></Form.Control>
             </Form.Group>
 
             <Form.Group controlId='city'>
                 <Form.Label>City</Form.Label>
                 <Form.Control 
                     type='city' 
                     placeholder='Enter city' 
                     value={city} 
                     onChange={(e) => setCity(e.target.value)}
                 ></Form.Control>
             </Form.Group>
 
             <Form.Group controlId='postalCode'>
                 <Form.Label>Postal Code</Form.Label>
                 <Form.Control 
                     type='postalCode' 
                     placeholder='Enter postalCode' 
                     value={postalCode} 
                     onChange={(e) => setPostalCode(e.target.value)}
                 ></Form.Control>
             </Form.Group>
             
             <Form.Group controlId='stateCode'>
                 <Form.Label>State</Form.Label>
                 <Form.Control 
                     type='stateCode' 
                     placeholder='Enter state' 
                     value={stateCode} 
                     onChange={(e) => setStateCode(e.target.value)}
                 ></Form.Control>
             </Form.Group>
 
             <Form.Group controlId='country'>
                 <Form.Label>Country</Form.Label>
                 <Form.Control 
                     type='country' 
                     placeholder='Enter country' 
                     value={country} 
                     onChange={(e) => setCountry(e.target.value)}
                 ></Form.Control>
             </Form.Group>
 
             <Button type='submit' variant='primary'>
                 Continue
             </Button>
         </Form>
         }
        
    </FormContainer>
}

export default ShippingPage