import React, { useState, useEffect } from "react";
import { withRouter, useHistory } from "react-router-dom";
import SignIn from "./SignIn";
import logo from '../static/images/logo.svg';
import landing_img from '../static/images/landing_img.svg';
import { Row, Col } from "react-bootstrap";
import ForgotPassword from "./ForgotPassword";
import Image from 'react-bootstrap/Image'

const IndexPage = (props) => {
  
  const history = useHistory();

  const [pageStatus, setPageStatus] = useState({});

  useEffect(() => { 
    let path = history.location.pathname;
    if(path === '/' || path === '/signin' || path === '/signin/'){
        setPageStatus({'signin': true, 'signup': false, 'forgot_password': false});
    }else if(path === '/forgot_password' || path === '/forgot_password/'){
        setPageStatus({'signin': false, 'signup': false, 'access_code': false, 'forgot_password': true});
    }
  }, [history.location.pathname])


  return (
    <Row style={{ margin: '0px', padding: '0px', backgroundColor: 'white' }}>
      <Col style={{ padding: '0px', margin: '0px' }} xl={6} lg={6} md={12} sm={12} xs={12}>
        <Image fluid style={{ position: 'relative' }} className="landing_img" src={landing_img}></Image>
        <div className="landing_img_section">
              <p className="landing_section_1">EARN MORE <br/> PASSIVELY</p>
              <p className="landing_section_2">Get started on your journey to financial security</p>
            </div>
      </Col>
      <Col xl={6} lg={6} md={12} sm={12} xs={12}>
        <Row style={{ padding: '0px', margin: '8% 0% 0% 0%'}}>
          <Col style={{ padding: '0px', margin: '0px'}} xl={12} lg={12} md={12} sm={12} xs={12}>
            <img src={logo} style={{ height: '150px', width: '350px' }}></img>
          </Col>
        </Row>
        {pageStatus.signin?<SignIn/>:''}
        {pageStatus.forgot_password?<ForgotPassword/>:''}
      </Col>
    </Row>

  );
}

export default withRouter(IndexPage);
