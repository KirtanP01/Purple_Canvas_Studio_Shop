import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Image, ListGroup, Card, Button, Form, ListGroupItem } from 'react-bootstrap'
//import axios from 'axios'
import ProductRating from '../components/ProductRating'
import Message from '../components/Message'
import Loader from '../components/Loader'
//import products from '../products'
import { listProductDetails, createProductReview } from '../actions/productActions'
import{PRODUCT_REVIEW_RESET} from '../constants/productConstants'



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
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [size, setSize] = useState('')

  const dispatch = useDispatch()
  
  const productDetails = useSelector(state => state.productDetails)
  const { loading, error, product } = productDetails
  
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const productReviewCreate = useSelector(state => state.productReviewCreate)
  const { success:successProductReview, error:errorProductReview } = productReviewCreate

  //const history = useHistory()
  const navigate = useNavigate();

  useEffect(() => {
    if(successProductReview){
      alert('Product review submitted successfully!')
      setRating(0)
      setComment('')
      setSize('')
      dispatch({type:PRODUCT_REVIEW_RESET})

    }
    dispatch(listProductDetails(params.id))
  }, [dispatch, params, successProductReview])

  

  const addToCartHandler = () => {
    navigate(`/cart/${params.id}?qty=${qty}`)
  }

  const submitHandler = (e) => {
    e.preventDefault()
    //console.log('Rating ' + rating)
    //console.log('Comment ' + comment)
    dispatch(createProductReview(params.id,{rating, comment}))
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
          <>
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
                      Size: 
                    </Col>
                    <Col>
                      {product.size}
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
        <Row>
           <Col md={6}></Col>
           <h2>Reviews</h2>
           {product.reviews.length === 0 && <Message>No reviews available</Message>} 
           <ListGroup variant='flush'>
            {product.reviews.map(review =>(
              <ListGroupItem key ={review._id}>
                <strong>{review.name}</strong>
                <ProductRating text='' value={review.rating} />
                <p>{review.createdAt.substring(0, 10)}</p>
                <p>{review.comment}</p>
              </ListGroupItem>
            ))}
              <ListGroupItem>
                <h2>Write a product reviews</h2>
                {errorProductReview && <Message variant='danger'>{errorProductReview} </Message>}
                {userInfo
                ? <Form onSubmit={submitHandler}>  
                      <Form.Group controlId='rating'>
                        <Form.Label>Rating</Form.Label>
                          <Form.Control 
                            as='select' 
                            value={rating} 
                            onChange={(e) => setRating(e.target.value)} >
                              <option value={Number('0')}>Select....</option>
                              <option value={Number('1')}>1 - Poor</option>
                              <option value={Number('2')}>2 - Fair</option>
                              <option value={Number('3')}>3 - Good</option>
                              <option value={Number('4')}>4 - Very Good</option>
                              <option value={Number('5')}>5 - Excellent</option>
                          </Form.Control>
                      </Form.Group >
                      <Form.Group controlId='comment'>
                        <Form.Label>Comment</Form.Label>
                        <Form.Control 
                          as='textarea' 
                          row='3' 
                          value={comment} 
                          onChange={(e) => setComment(e.target.value)} >
                        </Form.Control>
                      </Form.Group>
                      <Button type='submit' variant='primary'>Submit</Button>
                  </Form>

                :<Message>Please <Link to='/login'>Sign-in</Link> to write a review</Message> 

                }
              </ListGroupItem>
           </ListGroup> 
        </Row>
        </>
      )}
    </>
  )
}

export default ProductDisplayPage