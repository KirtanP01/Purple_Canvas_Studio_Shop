import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Table, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import { listProducts, deleteProduct, addProduct } from '../actions/productActions'
import { PRODUCT_ADD_RESET } from '../constants/productConstants'


const ProductListPage = () => {
    const params = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const pageNumber = params.pageNumber || 1

    const productList = useSelector(state => state.productList)
    const { loading, error, products, page, pages } = productList

    const productDelete = useSelector(state => state.productDelete)
    const { loading:loadingDelete, error:errorDelete, success:successDelete } = productDelete

    const productAdd = useSelector(state => state.productAdd)
    const { loading:loadingAdd, error:errorAdd, success:successAdd, product:addedProduct } = productAdd

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    useEffect(() => {
        dispatch({ type: PRODUCT_ADD_RESET })

        if(!userInfo.isAdmin) {
            navigate(`/login`)
        } 

        if(successAdd){
            navigate(`/admin/product/${addedProduct._id}/edit`)
        } else{
            //dispatch(listProducts())
            dispatch(listProducts('', pageNumber))
        }

    }, [dispatch, navigate, userInfo, successDelete, successAdd, addedProduct, pageNumber])

    const deleteHandler = (id) => {
        if(window.confirm('Are you sure?')) {
            dispatch(deleteProduct(id))
        }
    }
    const addProductHander = () => {
        dispatch(addProduct())
    }

  return (
    <>
        <Row className='align-items-center'>
            <Col>
                <h1>Products</h1>
            </Col>
            <Col style={{ textAlign:"right" }}>
                <Button className='my-3' onClick={addProductHander}>
                    <i className='fas fa-plus'></i> Add Product
                </Button>
            </Col>
        </Row>
        {loadingDelete && <Loader /> }
        {errorDelete && <Message variant='danger'>{errorDelete}</Message> }
        {loadingAdd && <Loader /> }
        {errorAdd && <Message variant='danger'>{errorAdd}</Message> }        
        {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message>
        : (
            <>
            <Table striped bordered hover responsive className='table-sm'>
                <thead className='table-head'>
                    <tr>
                        <th className='column-head'>ID</th>
                        <th className='column-head'>NAME</th>
                        <th className='column-head'>PRICE</th>
                        <th className='column-head'>SIZE</th>
                        <th className='column-head'>BRAND</th>
                        <th className='column-head'>ACTION</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product._id}>
                            <td>{product._id}</td>
                            <td>{product.name}</td>
                            <td>${product.price}</td>
                            <td>{product.size}</td>
                            <td>{product.brand}</td>
                            <td>
                                <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                    <Button variant='light' className='btn-sm'>
                                        <i className='fas fa-edit'></i>
                                    </Button>
                                </LinkContainer>
                                <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(product._id)}>
                                    <i className='fas fa-trash'></i>
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Paginate pages = {pages} page = {page} isAdmin = {true} />
            </>
        )}
    </>
  )
}

export default ProductListPage