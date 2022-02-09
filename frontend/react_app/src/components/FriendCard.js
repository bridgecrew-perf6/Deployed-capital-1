import React, { useState, useEffect } from "react";
import { withRouter, useHistory } from "react-router-dom";
import '../index.css'
import { Row, Col, Button, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { defaultProfilePictureImageDataUri } from "../constants";

const FriendCard = (props) => {
  
  const history = useHistory();

  const curr_user_data = useSelector((state) => state.session.userData);

  const friends = props.friends;

  useEffect(() => { 
   
  }, [])

  return (
    <div>
        <Row style={{ margin: '10px 0px 0px 0px', padding: '0px' }}>
          <Col xl={10} lg={10} md={9} sm={8} xs={8}>
            <p style={{ fontWeight: 'bold', margin: '15px 0px 0px 20px', fontSize: '1.5rem', textAlign: 'left' }}>Friends</p>
          </Col>
          <Col xl={2} lg={2} md={3} sm={4} xs={4}>
            <Button
                size="md"
                style={{ backgroundColor: '#017EFA', color: 'white', outline: 'none', border: '1px solid #017EFA', margin: '20px 0px 0px 0px', float: 'right' }}
                type="submit">
                <span style={{}}>Add new</span>
            </Button>
          </Col>
        </Row>
        <Row style={{ padding: '10px', margin: '0px' }}>
        {friends && friends.length > 0?friends.map((item, idx) => {
            return(
                <Col key={idx} style={{ padding: '20px', margin: '0px' }} xl={3} lg={4} md={4} sm={6} xs={6}>
                    <Card className="friend_card">
                        <Card.Img style={{ borderRadius: '20px 20px 0px 0px', objectFit: 'contain', width: '100%', height: '100%' }} variant="top" src={defaultProfilePictureImageDataUri} />
                        <Card.Body style={{ padding: '15px 5px', margin: '0px', backgroundColor: '#F4F8FF' }}>
                            <Row style={{ padding: '0px', margin: '0px' }}>
                                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <Card.Title style={{ float: 'left'}}>Friend {item}</Card.Title>
                                </Col>
                            </Row>
                            <Row style={{ padding: '0px', margin: '0px' }}>
                                <Col style={{ padding: '5px', margin: '0px' }} xs={12} sm={12} md={12} lg={12} xl={6}>
                                    <Button
                                        size="sm"
                                        className="view_profile_btn">
                                        <span>View Profile</span>
                                    </Button>
                                </Col>
                                <Col style={{ padding: '5px', margin: '0px' }} xs={12} sm={12} md={12} lg={12} xl={6}>
                                    <Button
                                        size="sm"
                                        className="unfriend_btn">
                                        <span>Unfriend</span>
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>) 
            }):<p style={{ color: '#017EFA', cursor: 'pointer', margin: '20px auto', fontSize: '20px', fontWeight:'bold' }}>No Friends Yet !</p>}
        </Row>
    </div>
  );
}

export default withRouter(FriendCard);
