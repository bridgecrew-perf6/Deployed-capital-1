import React, { useState } from "react";
import { withRouter, useHistory } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import Survey from "../components/Survey"
import { useSelector } from "react-redux";
import DNDCard from "../components/DNDCard";

const Dashboard = (props) => {
  
  const history = useHistory();

  const curr_user_data = useSelector((state) => state.session.userData);

  const redirectPage = (page) => {
    history.push(page);
  }

  return (
      <div style={{ height: 'calc(100vh - 166px)' }}>
        <DNDCard/>
      </div>
  );
}

export default withRouter(Dashboard);