import React, { useState, useRef } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import { useHistory, withRouter, useParams } from "react-router-dom";
import "../index.css";
import { USERS_API_URL } from "../constants"
import "react-datetime/css/react-datetime.css";
import PaymentCard from "../components/stripe/PaymentCard";
import { signup_data, user_created_success } from "../redux";
import { useDispatch, useSelector } from "react-redux";

const Subscription = (props) => {

    axios.defaults.xsrfCookieName = "csrftoken";
    axios.defaults.xsrfHeaderName = "X-CSRFToken";

    const curr_signup_data = useSelector((state) => state.session.signUpData);
    const paymentCardRef = useRef();
    const subscriptionAmount = 75;
    const [paidAmount, setPaidAmount] = useState(0);
    const [isPaid, setIsPaid] = useState(false);
    const [signUpSuccessMsg, setSignUpSuccessMsg] = useState("");
    const [isFormSubmitError, setIsFormSubmitError] = useState(false);
    const [windowDimensions, setWindowDimensions] = useState({
        height: window.innerHeight,
        width: window.innerWidth,
    });

    const history = useHistory();
    const dispatch = useDispatch();

    const register = () => {
        let post_data = {...curr_signup_data}
        axios
          .post(USERS_API_URL+"register/", post_data)
          .then((response) => {
            if (response.data.ok) {
                dispatch(signup_data());
                localStorage.removeItem("signUpData");
                setIsFormSubmitError(false);
                // history.push("/signin");
                if(post_data['sso']){
                    dispatch(user_created_success('sso_login'));
                }else{
                    dispatch(user_created_success('login'));
                }
            } else {
                dispatch(signup_data());
                localStorage.removeItem("signUpData");
                setIsFormSubmitError(true);
                let msg = '';
                Object.values(response.data.error).map(item => {
                    msg = item.map(innerItem => {
                        return innerItem + '\n';
                    })
                })
                setSignUpSuccessMsg(msg);
                setTimeout(function () {
                    setSignUpSuccessMsg("");
                }, 10000);
                console.log("Error");
            }
          })
          .catch((error) => {
            setIsFormSubmitError(true);
            setSignUpSuccessMsg("Some error Occurred");
            setTimeout(function () {
              setSignUpSuccessMsg("");
            }, 10000);
            console.log(error);
        });
    }
    const paymentMethod = (data) => {
        if(data['success']){
            setIsPaid(true);
            setPaidAmount(data['amount']);
            register();
        }else{
            setIsPaid(false);
            setPaidAmount(0);
        }
}
  
  return (
    <Row style={{ margin: '8% 0%', padding: '0%' }}>
      <Col className="shadow"  lg={{span: 6, offset: 3}} md={12} sm="12" xs="12">
        <Row style={{ margin: '0px', padding: '0px' }}>
          <Col style={{ margin: '10px 0px 0px 0px' }} lg="12" md="12" sm="12" xs="12">
            <span style={{  fontStyle: 'normal', fontSize: '30px' }}>Get started with us</span>
          </Col>
        </Row>
        
        <Row style={{ margin: '30px 0px 0px 0px', padding: '0px' }}>
            <Col lg="12" md="12" sm="12" xs="12">
                <PaymentCard amount={subscriptionAmount} onPaymentParent={paymentMethod} ref={paymentCardRef}/>
                {!signUpSuccessMsg ? (
                    ""
                  ) : (
                    <Row style={{ margin: "10px 0px 10px 0px", padding: "0px" }}>
                      <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                        <div
                          style={{ textAlign: 'center' }}
                          className={isFormSubmitError?"form_error_message":"form_success_message"}
                        >
                          {signUpSuccessMsg}
                        </div>
                      </Col>
                    </Row>
                  )}
            </Col>
          </Row>
        </Col>
      </Row>
  );
}

export default withRouter(Subscription);

