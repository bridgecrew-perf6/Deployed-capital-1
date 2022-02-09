import React, { useState, useEffect } from "react";
import { withRouter, useHistory } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartBar, faIdBadge } from '@fortawesome/free-regular-svg-icons'
import { faCog, faHome, faIndent, faUserTimes } from '@fortawesome/free-solid-svg-icons'
import logo from '../static/images/logo.svg'

const IndexPage = (props) => {
  
  const history = useHistory();

  const [pages, setPages] = useState([
      {name: 'Home Page', location: '/robot_writeup', icon: faHome},
      {name: 'Dashboard', location: '/dashboard', icon: faChartBar},
      // {name: 'Friends', location: '/friends', icon: faIdBadge},
      {name: 'Library', location: '/library', icon: faIndent},
      {name: 'Do not Disturb', location: '/do_not_disturb', icon: faUserTimes},
      {name: 'Profile Settings', location: '/profile_settings', icon: faCog},
  ]);

  useEffect(() => { 
    
  }, [])

  const redirectPage = (page) => {
    history.push(page);
  }

  return (
    <Row style={{ margin: '0px', padding: '0px' }} className="side_bar">
      <Col style={{ margin: '0px', padding: '0px' }} xl={12} lg={12} md={12} sm={12} xs={12}>
            <Row style={{ padding: '0px', margin: '0px 0px 10px 0px', padding: '10px 0px 0px 0px'}}>
                <Col style={{ padding: '0px', margin: '0px'}} lg="12" md="12" sm="12" xs="12">
                    <img src={logo} style={{ cursor: 'pointer', height: '50px', width: '80px' }}></img>
                </Col>
            </Row>
            {pages.map((item, idx) => {
            return (<Row key={idx} style={{ margin: '0px 0px 0px 0px', padding: '0px' }}>
                <Col style={{ padding: '0px 0px 0px 20px', margin: '0px'}} xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Row onClick={() => redirectPage(item.location)} className="dashboard_items" style={{ cursor: 'pointer', margin: '3px 0px', padding: '12px' }}>
                        <Col style={{ margin: '0px', padding: '0px' }} xs={1} sm={1} md={1} lg={1} xl={1}>
                            <FontAwesomeIcon color='white' icon={item.icon}/>
                        </Col>
                        <Col style={{ margin: '0px', padding: '0px 10px 0px 15px' }} xs={11} sm={11} md={11} lg={11} xl={11}>
                            <p className="dashboard_items_name">{item.name}</p>
                        </Col>
                    </Row>
                </Col>
            </Row>)
            })
            }
      </Col>
    </Row>
  );
}

export default withRouter(IndexPage);
