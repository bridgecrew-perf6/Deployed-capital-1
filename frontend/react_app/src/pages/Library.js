import React, { useState, useEffect } from "react";
import { withRouter, useHistory } from "react-router-dom";
import '../index.css'
import { Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import LibraryCard from "../components/LibraryCard";

const Library = (props) => {
  
  const history = useHistory();

  const curr_user_data = useSelector((state) => state.session.userData);

  const [products, setProducts] = useState(Array.from(Array(30).keys()))

  useEffect(() => { 
   
  }, [])

  return (
    <Row style={{ margin: '0px', padding: '0px', height: products.length==0?'calc(100vh - 66px)':'100%' }}>
      <Col style={{ padding: '0px', margin: '0px' }} xl={12} lg={12} md={12} sm={12} xs={12}>
        <LibraryCard products={products}/>  
      </Col>
    </Row>
  );
}

export default withRouter(Library);