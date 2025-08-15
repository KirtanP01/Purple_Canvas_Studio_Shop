import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import { logout } from '../actions/userActions'
import SearchBox, {SerachBox} from './SearchBox'
import { CART_RESET } from '../constants/cartConstants'

const Header = () => {
  const dispatch = useDispatch()

  const userLogin = useSelector(state => state.userLogin)
  const {userInfo} = userLogin

  const logoutHandler = () => {
    dispatch({ type: CART_RESET })
    dispatch(logout())
  }

  return (
    <header>
        <Navbar className='color-nav' variant='dark' expand='lg' collapseOnSelect fixed="top">
        <Container fluid>
          <LinkContainer to='/'>
            <Navbar.Brand className="d-flex align-items-center">
              <img 
                src="/logo/purple_canvas_studio_logo.png" 
                alt="Purple Canvas Studio Logo" 
                height="80" 
                className="me-2 d-none d-sm-inline"
                style={{verticalAlign: 'middle'}}
              />
              <img 
                src="/logo/purple_canvas_studio_logo.png" 
                alt="Purple Canvas Studio Logo" 
                height="50" 
                className="me-2 d-sm-none"
                style={{verticalAlign: 'middle'}}
              />
              <span className="d-none d-md-inline">Purple Canvas Studio</span>
              <span className="d-md-none">Purple Canvas</span>
              <small style={{fontSize: '0.6em', marginLeft: '4px'}}>LLC</small>
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
          <SearchBox />
            <Nav className='ms-auto'>
              <LinkContainer to='/cart'>
                <Nav.Link><i className='fas fa-shopping-cart'></i><span className="d-none d-sm-inline ms-1">Cart</span></Nav.Link>
              </LinkContainer>
              {userInfo ? (
                <NavDropdown title={userInfo.name} id='username'>
                  <LinkContainer to='/profile'>
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                </NavDropdown>
              ) : <LinkContainer to='/login'>
              <Nav.Link><i className='fas fa-user'></i><span className="d-none d-sm-inline ms-1">Sign In</span></Nav.Link>
            </LinkContainer>}
            {userInfo && userInfo.isAdmin && (
              <NavDropdown title='Admin' id='adminmenu'>
                <LinkContainer to='/admin/userlist'>
                  <NavDropdown.Item>Users</NavDropdown.Item>
                </LinkContainer>
                
                <LinkContainer to='/admin/productlist'>
                  <NavDropdown.Item>Products</NavDropdown.Item>
                </LinkContainer>

                <LinkContainer to='/admin/orderlist'>
                  <NavDropdown.Item>Orders</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
            )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default Header