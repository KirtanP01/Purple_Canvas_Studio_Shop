import React from 'react'
import { Link } from 'react-router-dom'
import { Card } from 'react-bootstrap'
import ProductRating from './ProductRating'

const Product = ({ product }) => {
  return (
    <Card className='my-3 p-3 rounded h-100'>
        <Link to={`/product/${product._id}`}>
            <Card.Img src={product.image} variant='top' style={{height: '200px', objectFit: 'cover'}} />
        </Link>

        <Card.Body className='d-flex flex-column'>
            <Link to={`/product/${product._id}`}>
                <Card.Title as='div' className='mb-2'>
                    <strong>{product.name}</strong>
                </Card.Title>
            </Link>

            <Card.Text as='div' className='mb-2'>
                <ProductRating 
                value={product.rating} 
                text={`${product.numReviews} reviews`} 
                // Use below line to set the stars to certain color
                //color='any color'
                />
            </Card.Text>

            <Card.Text as='h3' className='mt-auto text-primary'>
                ${product.price}
            </Card.Text>
        </Card.Body>
    </Card>
  )
}

export default Product