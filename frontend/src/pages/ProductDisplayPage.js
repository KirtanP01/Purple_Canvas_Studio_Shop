import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap'
//import axios from 'axios'
import ProductRating from '../components/ProductRating'
import Message from '../components/Message'
import Loader from '../components/Loader'
//import products from '../products'
import { listProductDetails } from '../actions/productActions'



const ProductDisplayPage = ({ history, match }) => {

  //const {id} = useParams()
  //const product = products.find(p => p._id === id)

  //const [product, setProduct] = useState({})

  /** useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await axios.get(`/api/products/${params.id}`)
      setProduct(data)
    }

    fetchProduct()
  }, [params])
  */

  const params = useParams()

  const [qty, setQty] = useState(1)

  const dispatch = useDispatch()
  
  const productDetails = useSelector(state => state.productDetails)
  const { loading, error, product } = productDetails
  
  //const history = useHistory()
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(listProductDetails(params.id))
  }, [dispatch, params])

  

  const addToCartHandler = () => {
    navigate(`/cart/${params.id}?qty=${qty}`)
  }

  return (
    <>
      <Link className='btn btn-dark my-3' to='/'>
        Go Back
      </Link>
      {loading 
        ? <Loader/> 
        : error 
        ? <Message variant='danger'>{error}</Message> 
        : (
          <Row>
          <Col md={6}>
            <Image src={product.image} alt={product.name} fluid></Image>
          </Col>
          <Col md={3}>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h3>{product.name}</h3>
              </ListGroup.Item>
              <ListGroup.Item>
                <ProductRating 
                value={product.rating}
                text={`${product.numReviews} reviews`} 
                /> 
              </ListGroup.Item>
              <ListGroup.Item>
                Price: ${product.price}
              </ListGroup.Item>
              <ListGroup.Item>
                Description: {product.description}
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={3}>
            <Card>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      Price: 
                    </Col>
                    <Col>
                      <strong>${product.price}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      Status: 
                    </Col>
                    <Col>
                      {product.quantityInStock > 0 ? 'In Stock' : 'Out Of Stock'}
                    </Col>
                  </Row>
                </ListGroup.Item>
                {product.quantityInStock > 0 && (
                  <ListGroup.Item>
                    <Row>
                      <Col className='my-2'>Qty</Col>
                      <Col>
                        <Form.Control
                          className='form-select'
                          as='select' 
                          value={qty} 
                          onChange={(e) => setQty(e.target.value)}>
                            {[...Array(product.quantityInStock).keys()].map((x) => (
                              <option key={x + 1} value={x + 1}>
                                {x + 1}
                              </option>
                            ))}
                        </Form.Control>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )}
                <ListGroup.Item>
                  <Button
                    onClick={addToCartHandler}
                    className='col-12' 
                    type='button' 
                    disabled={product.quantityInStock===0}
                  >
                    Add To Cart
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}
    </>
  )
}

export default ProductDisplayPage