import { Button } from 'react-bootstrap';
import React, { useState } from 'react'
import { useAuth } from '../Contexts/AuthContext'

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const [error, setError] = useState("")
  const location = useLocation();
  const {currentUser, logout} = useAuth()

  async function handleLogout() {
    setError("")
    console.log('heyyyyyy')
    try {
        await logout()
    } catch {
        setError('Failed to log out')
    }
  }
    
  return (
    <>
    <Navbar className="m-3">
        <Navbar.Brand variant="primary" as={Link} to={"/"} >Gather</Navbar.Brand>    
        <Nav className="ms-auto d-flex flex-row justify-content-between">
            {currentUser ? <>{error ? <p>{error}</p> : null} <p>{currentUser.email}</p> <Button onClick={handleLogout}>logout</Button></>:  <> 
              {location.pathname !== "/sign-in" ? <Nav.Link as={Link} to={"/sign-in"}><Button variant="primary" size="sm">Sign in</Button></Nav.Link> : null }
              {location.pathname !== "/join" ? <Nav.Link as={Link} to={"/join"}><Button variant="primary" size="sm" style={{width:"3.9rem"}}>Join</Button></Nav.Link> : null }
            </> }
        </Nav>
        
    </Navbar>
    </>
  )
}
