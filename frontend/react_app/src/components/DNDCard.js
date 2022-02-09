import React, { useState, useEffect, useRef } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useHistory, withRouter, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CSRFToken from "../components/Csrf";
import "../index.css";
import axiosInstance from "../components/AxiosInstance";
import "react-datetime/css/react-datetime.css";
import {all_users} from '../redux'

const DNDCard = (props) => {

  const history = useHistory();
  const dispatch = useDispatch();


  const [signUpSuccessMsg, setSignUpSuccessMsg] = useState("");
  const [isFormSubmitError, setIsFormSubmitError] = useState(false);

  const [formData, setFormData] = useState({
    'name':'',
    'phone_number':''
  });
  const [formErrors, setFormErrors] = useState({
    'name':'',
    'phone_number':''
  });

  const emailRegex = RegExp(
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  );
  
  const curr_user_data = useSelector((state) => state.session.userData);
  const session_all_users = useSelector((state) => state.session.allUsers);

  useEffect(() => {
    //pass    
  }, [])

 
  const redirectPage = (page) => {
      history.push(page);
  }

  const formValid = (formErrors, formData) => {

    let valid = true;

    // validate form errors being empty
    Object.values(formErrors).forEach((val) => {
    val.length > 0 && (valid = false);
    });

    // validate the form was filled out
    Object.values(formData).forEach((val) => {
    val === null && (valid = false);
    });

    return valid;

  };

  const handleSubmit = (e) => {
    
    e.preventDefault();
    let post_data = {};
    let valid = false;
    if (formValid(formErrors, formData)) {
        valid = true;
        post_data = {...formData};
        post_data['user_id'] = curr_user_data.id;
    } else {
        valid = false;
        setSignUpSuccessMsg("Some of your fields are empty or incorrect");
        setTimeout(function () {
            setSignUpSuccessMsg("");
        }, 10000);
        console.error("FORM INVALID");
    }
    if (valid) {        
        axiosInstance
        .post("users/manage_dnd/", post_data)
        .then((res) => {
          if (res.data.ok) {
            let currAllUsers = [...session_all_users];
            currAllUsers.push(res.data.user);
            dispatch(all_users(currAllUsers));
            setFormData({
              'name': '',
              'phone_number':''
            });
            setIsFormSubmitError(false);
            setSignUpSuccessMsg('User added succesfully to the DND list.');
            setTimeout(function () {
              setSignUpSuccessMsg("");
            }, 10000);
          } else {
            setIsFormSubmitError(true);
            setSignUpSuccessMsg(res.data.error);
            setTimeout(function () {
              setSignUpSuccessMsg("");
            }, 10000);
            console.log("Error");
          }
        })
        .catch((err) => {
            setIsFormSubmitError(true);
            setSignUpSuccessMsg("Some error Occurred");
            setTimeout(function () {
              setSignUpSuccessMsg("");
            }, 10000);
            console.log(err);
        });
  }
  };

  const handleChange = (e, type, data) => {

    e.preventDefault();
    const { name, value } = e.target;
    validate(name, value);    

  };

  const validate = (name, value) => {
    switch (name) {
      // case "email":
      //     setFormData({ ...formData, email: value });
      //     if (emailRegex.test(value)) {
      //         if(value === curr_user_data.email){
      //           setFormErrors({ ...formErrors, email: "This email cannot be same as the your email." });
      //         }else{
      //           setFormErrors({ ...formErrors, email: "" });
      //         }
      //     } else {
      //       if (value.length > 0) {
      //         setFormErrors({ ...formErrors, email: "Invalid email address" });
      //       } else {
      //         setFormErrors({ ...formErrors, email: "" });
      //       }
      //     }
      //     break;
        case "name":
            setFormData({ ...formData, name: value });
            if (value.length <= 0) {
              setFormErrors({
                ...formErrors,
                name: "Name is required",
              });
            } else {
                setFormErrors({ ...formErrors, username: "" });
            }
          break;
        // case "username":
        //     setFormData({ ...formData, username: value });
        //     if (value.length <= 0) {
        //       setFormErrors({
        //         ...formErrors,
        //         username: "Username is required",
        //       });
        //     } else {
        //         if(value === curr_user_data.email){
        //             setFormErrors({ ...formErrors, email: "This username cannot be same as the your username." });
        //         }else{
        //             setFormErrors({ ...formErrors, username: "" });
        //         }
        //     }
        //   break;
        case "phone_number":
            setFormData({ ...formData, phone_number: value });
            if (value.length <= 0) {
              setFormErrors({
                ...formErrors,
                phone_number: "Phone is required",
              });
            }else if (value.length > 0 && value.length < 10) {
              setFormErrors({
                ...formErrors,
                phone_number: "Phone number is invalid",
              });
            }else if(value.length > 10 ) {
              setFormErrors({
                ...formErrors,
                phone_number: "Phone number should not be greater than 10 digits",
              });
            } 
            else if(value.length  === 10 ) {
                if(value === curr_user_data.email){
                    setFormErrors({ ...formErrors, email: "This phone number cannot be same as the your phone number." });
                }else{
                setFormErrors({ ...formErrors, phone_number: "" });
                }
            }
          break;
      default:
        break;
    }
  };


  return (
    <Row style={{ margin: '100px 0px 0px 0px', padding: '0px' }}>
      <Col className="dnd_section"  lg={{span: 6, offset: 3}} md={12} sm="12" xs="12">
        <Row style={{ margin: '0px', padding: '0px' }}>
          <Col style={{ margin: '10px 0px 0px 0px' }} lg="12" md="12" sm="12" xs="12">
            <span style={{  fontStyle: 'normal', fontSize: '30px' }}>Do not Disturb</span>
          </Col>
        </Row>
        <Row style={{ margin: '0px', padding: '0px' }}>
          <Col style={{ margin: '5px 0px 0px 0px' }} lg="12" md="12" sm="12" xs="12">
            <span style={{ fontStyle: 'normal', fontSize: '14px' }}>Add the users you want to add to the DND list.</span>
          </Col>
        </Row>
        <Row style={{ margin: '30px 0px 0px 0px', padding: '0px' }}>
          <Col lg="12" md="12" sm="12" xs="12">
            <Form className="custom_form_dnd" onSubmit={(e) => handleSubmit(e, "login", "")}>
                <CSRFToken/>
                <Row style={{ marginBottom: '10px' }}>
                  <Col lg={12} md={12} sm={12} xs={12}>
                    <Form.Group id="name">
                      <Form.Control
                          className="custom_bg_white"
                          name="name"
                          type="text"
                          placeholder="Name"
                          value={formData.name}
                          onChange={(e) => handleChange(e)}
                          required
                        >
                      </Form.Control>
                  </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col lg={12} md={12} sm={12} xs={12}>
                    <Form.Group id="phone_number">
                    <Form.Control
                        className="custom_bg_white"
                        name="phone_number"
                        type="number"
                        placeholder="Phone"
                        value={formData.phone_number}
                        onChange={(e) => handleChange(e)}
                        required
                      >
                    </Form.Control>
                    <Row style={{ padding: "0px", margin: "0px" }}>
                      <Col style={{ padding: "0px" }}>
                        {formErrors.phone_number && formErrors.phone_number.length > 0 && (
                        <span className="float-left error_message">
                          {formErrors.phone_number}
                        </span>
                      )}
                      </Col>
                    </Row>
                  </Form.Group>
                  </Col>
                </Row>
                <Row style={{ margin: '25px 0px 0px 0px',  padding: "0px 10px"  }}>
                    <Col style={{ margin: '0px', padding: '0px' }}>
                        <Button
                            disabled={!formData.name || !formData.phone_number}
                            size="lg"
                            className="btn-block"
                            style={{backgroundColor: '#017EFA', color: 'white', outline: 'none', border: '1px solid #017EFA' }}
                            type="submit"
                        >
                        <span style={{ fontSize: '16px', fontWeight: 'bolder' }}>Add</span>
                        </Button>
                    </Col>
                </Row>
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
            </Form>
          </Col>
          </Row>
        </Col>
      </Row>
  );
}

export default withRouter(DNDCard);

