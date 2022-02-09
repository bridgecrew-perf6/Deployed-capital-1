import React from "react";
import { withRouter, useHistory } from "react-router-dom";
import '../index.css'
import { Row, Col, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import ProfileCard from "../components/ProfileCard";

const Profile = (props) => {
  
  const history = useHistory();
  const curr_user_data = useSelector((state) => state.session.userData);

  return (
    <Row style={{ padding: '10px 0px 0px 0px', margin: '0px', height: 'calc(100vh - 66px)' }}>
      <Col style={{ padding: '0px', margin: '0px' }} xl={12} lg={12} md={12} sm={12} xs={12}>
        <ProfileCard/>
      </Col>
    </Row>
  );
}

export default withRouter(Profile);
