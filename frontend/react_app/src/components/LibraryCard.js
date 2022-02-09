import React, { useState, useEffect } from "react";
import { withRouter, useHistory } from "react-router-dom";
import '../index.css'
import { Row, Col, Button, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import defaultProductImage from "../static/images/default_product_img.svg";

const LibraryCard = (props) => {
  
  const history = useHistory();

  const curr_user_data = useSelector((state) => state.session.userData);

  const products = props.products;

  useEffect(() => { 
   
  }, [])

  return (
    <div>
        <Row style={{ margin: '10px 0px 0px 0px', padding: '0px' }}>
          <Col xl={12} lg={12} md={12} sm={12} xs={12}>
            <p style={{ fontWeight: 'bold', margin: '15px 0px 0px 20px', fontSize: '1.5rem', textAlign: 'left' }}>Library</p>
          </Col>
        </Row>
        <Row style={{ padding: '10px', margin: '0px' }}>
        {products && products.length > 0?products.map((item, idx) => {
            return(
                <Col key={idx} style={{ padding: '20px', margin: '0px' }} xl={3} lg={4} md={4} sm={6} xs={6}>
                    <Card className="friend_card">
                        <Card.Img style={{ borderRadius: '20px 20px 0px 0px', objectFit: 'contain', width: '100%', height: '100%' }} variant="top" src={item.image?item.image:defaultProductImage} />
                        <Card.Body style={{ padding: '15px 5px', margin: '0px', backgroundColor: '#F4F8FF' }}>
                            <Row style={{ padding: '0px', margin: '0px' }}>
                                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <Card.Title style={{ padding: '0px 10px' }}><span style={{ float: 'left'}}>Product {idx} </span><span style={{ float: 'right', fontSize: '12px', color: '#327C41' }}> $100</span></Card.Title>
                                </Col>
                                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <div style={{ fontSize: '10px', padding: '10px 5px', fontStyle: 'italic', color: '#017EFA' }}>Product {idx} Description ...</div>
                                </Col>
                            </Row>
                            <Row style={{ padding: '0px', margin: '0px' }}>
                                <Col style={{ padding: '5px', margin: '0px' }} xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <Button
                                        size="sm"
                                        className="view_profile_btn">
                                        <span>Buy</span>
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>) 
            }):<p style={{ color: '#017EFA', cursor: 'pointer', margin: '20px auto', fontSize: '20px', fontWeight:'bold' }}>No Products Yet !</p>}
        </Row>
    </div>
  );
}

export default withRouter(LibraryCard);
