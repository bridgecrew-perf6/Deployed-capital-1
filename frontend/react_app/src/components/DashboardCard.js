import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import '../index.css'
import { Row, Col, Button } from "react-bootstrap";
import { defaultProfilePictureImageDataUri } from "../constants";
import axiosInstance from "./AxiosInstance";

const DashboardCard = (props) => {
  
  const users = props.userData.users;

  const userType = props.userData.type;

  useEffect(() => { 
    
  }, [])

  return (
    <div className="dashboard_card">
        <Row style={{ margin: '0px', padding: '0px' }}>
        <Col style={{ margin: '0px', padding: '0px' }} xl={12} lg={12} md={12} sm={12} xs={12}>
        {userType === 'contacts'?<p style={{padding: '5px 20px 0px 20px'}}></p>:
        <p style={{ color: '#017EFA', cursor: 'pointer', float: 'right', padding: '5px 20px 0px 20px', margin: '0px'}}>See list</p>
        }
        </Col>
        </Row>
        {users && users.length > 0?users.map((item, idx) => {
        return (<Row key={idx} style={{ margin: '0px', padding: '0px' }}>
        <Col style={{ margin: '0px', padding: '0px' }} xl={2} lg={2} md={2} sm={2} xs={2}>
            <img src={defaultProfilePictureImageDataUri} className="contact_circle" alt="contactPicture" />
        </Col>
        <Col style={{ margin: '0px', padding: '5px 20px 0px 20px' }} xl={10} lg={10} md={10} sm={10} xs={10}>
            <p style={{ float: 'left' }}>{item.name}</p>
        </Col>
        </Row>)
        })
        :<p style={{ color: '#0A194E', textAlign: 'center' }}>No {userType} yet !</p>}
        {userType === 'contacts'?<Row style={{ margin: '5px 0px', padding: '0px' }}>
            <Col style={{ margin: '0px', padding: '0px' }} xl={12} lg={12} md={12} sm={12} xs={12}>
                <p style={{ color: '#017EFA', cursor: 'pointer', float: 'left', padding: '0px 20px', margin: '0px'}}>See more</p>
            </Col>
        </Row>:''}
    </div>
  );
}

export default withRouter(DashboardCard);
