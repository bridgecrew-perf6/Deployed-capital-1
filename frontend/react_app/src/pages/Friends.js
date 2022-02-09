import React, { useState, useEffect } from "react";
import { withRouter, useHistory } from "react-router-dom";
import '../index.css'
import { Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FriendCard from "../components/FriendCard";

const Friends = (props) => {
  
  const history = useHistory();

  const curr_user_data = useSelector((state) => state.session.userData);

  const [friends, setFriends] = useState(Array.from(Array(0).keys()))

  useEffect(() => { 
   
  }, [])

  return (
    <Row style={{ margin: '0px', padding: '0px', height: friends.length==0?'calc(100vh - 66px)':'100%' }}>
      <Col style={{ padding: '0px', margin: '0px' }} xl={12} lg={12} md={12} sm={12} xs={12}>
        <FriendCard friends={friends}/>  
      </Col>
    </Row>
  );
}

export default withRouter(Friends);
