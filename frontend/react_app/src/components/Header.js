import React from "react";
import { useHistory } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar'
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import logo from '../static/images/logo.svg';
import { useSelector } from 'react-redux'

function Header(props) {
    
    const history = useHistory();
    const isLoggedIn = useSelector((state) => state.session.isLoggedIn);
    const redirectPage = (page) => {
        history.push(page);
    }

    return (
        <Navbar bg="light" variant="light" style={{ margin: '0px', margin: '0px' }}>
            <Navbar.Brand style={{ float: 'left', cursor: 'pointer' }} onClick={() => redirectPage(isLoggedIn?'/dashboard':'/')}>
                <Row style={{ margin: '0px', padding: '0px'}}>
                    <Col style={{ margin: '0px', padding: '0px'}} xs={3} sm={3} md={3} lg={3} xl={3}>
                        <img alt="Deployed_Capital" style={{ height: '50px', width: '80px' }} src={logo}/>
                    </Col>
                </Row>
            </Navbar.Brand>
            {/* <Nav className="me-auto">
                <Nav.Link onClick={() => redirectPage('/')}>Home</Nav.Link>
                <Nav.Link onClick={() => redirectPage('/gallery')}>Your Gallery</Nav.Link>
            </Nav> */}
        </Navbar>
    );
}

export default Header;
