import React, {useState} from "react"
import{Form, Button, Col, Row} from 'react-bootstrap'
import {useParams, useNavigate } from 'react-router-dom'

const SearchBox = () => {
    
    const[keyword,setKeyword] = useState('')
    
    const params = useParams()
    const navigate = useNavigate();

    
    const submitHandler = (e)=>{
        e.preventDefault()
        if(keyword.trim()){
            navigate(`/search/${keyword}`)
        }
        else{
            navigate('/')
        }
    }

    return(
 
        <Form onSubmit={submitHandler} className='form-inline'>
            <Row>
                <Col>
                    <Form.Control
                        type ='text'
                        name='q'
                        onChange={(e)=> setKeyword(e.target.value)}
                        placeholder='Search Product...'
                        className='mr-sm-2 ml-sm-8'>
                    </Form.Control>
                </Col>
                <Col>
                    <Button type='submit' variant='outline-success' className='p-2'>Search</Button>
                </Col>
            </Row>
        </Form> 
    )

}

export default SearchBox
