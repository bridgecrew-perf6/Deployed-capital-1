import React, { useState, useEffect, useRef } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { useHistory, withRouter, useParams } from "react-router-dom";
import { user_created_success, user_data, signup_data } from "../redux";
import { useDispatch, useSelector } from "react-redux";
import CSRFToken from "../components/Csrf";
import "../index.css";
import axiosInstance from "../components/AxiosInstance";
import { USERS_API_URL } from "../constants"
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar } from '@fortawesome/free-regular-svg-icons'
import $ from 'jquery'

const SignUp = (props) => {

  axios.defaults.xsrfCookieName = "csrftoken";
  axios.defaults.xsrfHeaderName = "X-CSRFToken";

  const [windowDimensions, setWindowDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });
  const history = useHistory();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signUpSuccessMsg, setSignUpSuccessMsg] = useState("");
  const [isFormSubmitError, setIsFormSubmitError] = useState(false);
  const dispatch = useDispatch();
  const [isDisabled, setIsDisabled] = useState(false);
  const [openDateTimePicker, setOpenDateTimePicker] = useState(false);
  const birthDateRef = useRef();

  const termsCheckbox = 'I read/ confirm T&C and privacy policy to continue the authorization process';

  const [formData, setFormData] = useState({
    'first_name':'',
    'last_name':'',
    'birth_date':'',
    'username':'',
    'email':'',
    'access_code':'',
    'phone_number':'',
    'password':'',
    'confirm_password':'',
  });
  const [formErrors, setFormErrors] = useState({
    'first_name':'',
    'last_name':'',
    'birth_date':moment(new Date()),
    'username':'',
    'email':'',
    'access_code':'',
    'phone_number':'',
    'password':'',
    'confirm_password':'',
  });

  const [editMode, setEditMode] = useState(false);
  const [paramsUserId, setParamsUserId] = useState("");
  const emailRegex = RegExp(
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  );

  const passwordRegex = RegExp(
    /^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d)(?=\S*[^\w\s])\S{6,}$/
  );
 
  let { user_id } = useParams();
  
  const curr_user_data = useSelector((state) => state.session.userData);
  const session_is_auth = useSelector((state) => state.session.isLoggedIn);
  const [isAuth, setIsAuth] = useState(false);
  const [modifiedUserFormData, setModifiedUserFormData] = useState({});
  
  const today = moment();

  const birthDateProp = {
    placeholder: 'Birthday',
    disabled: false,
    className: 'birth_date'
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside, false);
    localStorage.removeItem('signUpData');
    dispatch(signup_data());
    if(history.location.pathname.includes('modify_profile')){
      setEditMode(true);
      setModifiedUserData();
    }
  }, [])

  useEffect(() => {
    if(session_is_auth){
        setIsAuth(true);
    }else{
        setIsAuth(false);
    }
  }, [session_is_auth])
  
  const handleClickOutside = (e) => {
    
    let ele = document.getElementsByClassName('rdtPicker')[0];
    if (ele && ele !== e.target && !ele.contains(e.target)) {    
      setOpenDateTimePicker(false);
    }
  };

  const disableFutureDate = (current) => {
    return current.isBefore(today);
  }

  const shallowEqual = (object1, object2) => {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
  
    if (keys1.length !== keys2.length) {
      return false;
    }
  
    for (let key of keys1) {
      if (object1[key] !== object2[key]) {
        return false;
      }
    }
  
    return true;
  }


  const setModifiedUserData = () => {
    setParamsUserId(user_id);
  }

  const redirectPage = (page) => {
      history.push(page);
  }

  const formValid = (formErrors, formData) => {

    let valid = true;
    if(isAuth){
      // validate form errors being empty
      Object.keys(formErrors).forEach((key) => {
        if(key !== 'email' || key !== 'password' || key !== 'confirm_password'){
          formErrors[key].length > 0 && (valid = false);
        }
      });

      // validate the form was filled out
      Object.keys(formData).forEach((key) => {
        if(key !== 'email' || key !== 'password' || key !== 'confirm_password'){
          formData[key] === null && (valid = false);
        }
      });

    }else{

      // validate form errors being empty
      Object.values(formErrors).forEach((val) => {
        val.length > 0 && (valid = false);
      });

      // validate the form was filled out
      Object.values(formData).forEach((val) => {
        val === null && (valid = false);
      });

    }

    return valid;
  };

  const openDateTimePickerMethod = () => {
    setOpenDateTimePicker(!openDateTimePicker)
  }

  const handleSubmit = (e, type, data, is_captcha_verified) => {
    if(type !== 'sso'){
      e.preventDefault();
    }
    let post_data = {};
    let valid = false;
    if (type === "sso") {
      post_data = data;
      valid = true;
    } else {
      if (formValid(formErrors, formData)) {
        valid = true;
        post_data = {...formData};
      } else {
        valid = false;
        setSignUpSuccessMsg("Some of your fields are empty or incorrect");
        setTimeout(function () {
          setSignUpSuccessMsg("");
        }, 10000);
        console.error("FORM INVALID");
      }
    }
    if (valid) {
      // if (post_data.hasOwnProperty("confirm_password")) {
      //   delete post_data["confirm_password"];
      // }
        axios
        .post(USERS_API_URL+"validate_email_username/", post_data)
        .then((res) => {
          if (res.data.ok) {
            dispatch(signup_data(post_data));
            localStorage.setItem("signUpData", JSON.stringify(post_data));
            history.push('/subscription');
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

  const passwordVisibilityToggle = (type) => {
    if (type === "password") {
      let password = !showPassword;
      setShowPassword(password);
    } else {
      let confirm_password = !showConfirmPassword;
      setShowConfirmPassword(confirm_password);
    }
  };

  const handleBirthDate = (date) => {
    setFormData({ ...formData, birth_date: date });
  }

  const handleChange = (e, type, data) => {

    let password = formData.password;
    let confirm_password = formData.confirm_password;
    let email = formData.email;
    let confirm_email = formData.confirm_email;

    if(type === 'dropdown'){
      validate(data, e.value, email, password, confirm_password, confirm_email);
    }else{
      e.preventDefault();
      const { name, value } = e.target;
      validate(name, value, email, password, confirm_password, confirm_email);
    }

  };

  const validate = (name, value, email, password, confirm_password, confirm_email) => {
    switch (name) {
      case "email":
          setFormData({ ...formData, email: value });
          if (emailRegex.test(value)) {
              setFormErrors({ ...formErrors, email: "" });
          } else {
            if (value.length > 0) {
              setFormErrors({ ...formErrors, email: "Invalid email address" });
            } else {
              setFormErrors({ ...formErrors, email: "" });
            }
          }
          break;
        case "first_name":
            setFormData({ ...formData, first_name: value });
            if (value.length <= 0) {
              setFormErrors({
                ...formErrors,
                first_name: "First name is required",
              });
            } else {
              setFormErrors({ ...formErrors, first_name: "" });
            }
          break;
        case "last_name":
            setFormData({ ...formData, last_name: value });
            if (value.length <= 0) {
              setFormErrors({
                ...formErrors,
                last_name: "Last name is required",
              });
            } else {
              setFormErrors({ ...formErrors, last_name: "" });
            }
          break;
        case "access_code":
            setFormData({ ...formData, access_code: value });
          break;
        case "username":
            setFormData({ ...formData, username: value });
            if (value.length <= 0) {
              setFormErrors({
                ...formErrors,
                username: "Username is required",
              });
            } else {
              setFormErrors({ ...formErrors, username: "" });
            }
          break;
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
              setFormErrors({ ...formErrors, phone_number: "" });
            }
          break;
      case "password":
        setFormData({ ...formData, password: value });
        if (passwordRegex.test(value)) {
          if(confirm_password.length > 0){
            if(value === confirm_password){
              setFormErrors({ ...formErrors,  password: "" , confirm_password: ""});
            }else{
              setFormErrors({ ...formErrors, password: "Password and Confirm password should be the same" });
            }
          }else{
            setFormErrors({ ...formErrors, password: "" });
          }
        } else {
          if (value.length > 0) {
            setFormErrors({
              ...formErrors,
              password: "password must contain minimum 6, at least one uppercase letter, one lowercase letter, one number and one special character",
            });
          } else {
            setFormErrors({ ...formErrors, password: "" });
          }
        }
        break;
      case "confirm_password":
        setFormData({ ...formData, confirm_password: value });
        if (value.length > 0 && value !== password) {
          setFormErrors({
            ...formErrors,
            confirm_password: "Password and Confirm password should be the same",
          });
        } else {
          setFormErrors({ ...formErrors, confirm_password: "" });
        }
        break;
      default:
        break;
    }
  };

  const generatePassword = () => {
    var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$^&%*()+=-[]\/{}|:<>?,.",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

  const responseGoogle = (response) => {
    let profileObj = response.profileObj;
    let randomPassword = generatePassword();
    handleSubmit({}, "sso", { email: profileObj.email, 'password': randomPassword, sso: true })
  }

  const spinner = (display) => {
    display
      ? (document.getElementById("overlay").style.display = "block")
      : (document.getElementById("overlay").style.display = "none");
  };

  const spinnerStop = () => {
    spinner(false);
  };

  return (
    <Row style={{ margin: '1% 0%', padding: '0%' }}>
      <Col className="shadow"  lg={{span: 6, offset: 3}} md={12} sm="12" xs="12">
        <Row style={{ margin: '0px', padding: '0px' }}>
          <Col style={{ margin: '10px 0px 0px 0px' }} lg="12" md="12" sm="12" xs="12">
            <span style={{  fontStyle: 'normal', fontSize: '30px' }}>Get started with us</span>
          </Col>
        </Row>
        <Row style={{ margin: '0px', padding: '0px' }}>
          <Col style={{ margin: '5px 0px 0px 0px' }} lg="12" md="12" sm="12" xs="12">
            <span style={{ fontStyle: 'normal', fontSize: '14px' }}>Please enter your credentials</span>
          </Col>
        </Row>
        <Row style={{ margin: '30px 0px 0px 0px', padding: '0px' }}>
          <Col lg="12" md="12" sm="12" xs="12">
            <Form className="custom_form" onSubmit={(e) => handleSubmit(e, "login", "")}>
                <CSRFToken/>
                <Row>
                  <Col lg={6} md={6} sm={6} xs={6}>
                    <Form.Group id="first_name">
                    <Form.Control
                        className="form_field_custom"
                        name="first_name"
                        type="first_name"
                        placeholder="First Name"
                        value={formData.first_name}
                        onChange={(e) => handleChange(e)}
                        required
                      >
                    </Form.Control>
                    <Row style={{ padding: "0px", margin: "0px" }}>
                      <Col style={{ padding: "0px" }}>
                        {formErrors.first_name && formErrors.first_name.length > 0 && (
                        <span className="float-left error_message">
                          {formErrors.first_name}
                        </span>
                      )}
                      </Col>
                    </Row>
                  </Form.Group>
                  </Col>
                  <Col lg={6} md={6} sm={6} xs={6}>
                    <Form.Group id="last_name">
                    <Form.Control
                        className="form_field_custom"
                        name="last_name"
                        type="last_name"
                        placeholder="Last Name"
                        value={formData.last_name}
                        onChange={(e) => handleChange(e)}
                        required
                      >
                    </Form.Control>
                    <Row style={{ padding: "0px", margin: "0px" }}>
                      <Col style={{ padding: "0px" }}>
                        {formErrors.last_name && formErrors.last_name.length > 0 && (
                        <span className="float-left error_message">
                          {formErrors.last_name}
                        </span>
                      )}
                      </Col>
                    </Row>
                  </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col lg={12} md={12} sm={12} xs={12}>
                    <Form.Group id="email">
                    <Form.Control
                        className="form_field_custom"
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => handleChange(e)}
                        required
                      >
                    </Form.Control>
                    <Row style={{ padding: "0px", margin: "0px" }}>
                      <Col style={{ padding: "0px" }}>
                        {formErrors.email && formErrors.email.length > 0 && (
                        <span className="float-left error_message">
                          {formErrors.email}
                        </span>
                      )}
                      </Col>
                    </Row>
                  </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col lg={12} md={12} sm={12} xs={12}>
                    <Form.Group id="username">
                    <Form.Control
                        className="form_field_custom"
                        name="username"
                        type="text"
                        placeholder="Username"
                        value={formData.username}
                        onChange={(e) => handleChange(e)}
                        required
                      >
                    </Form.Control>
                    <Row>
                      <Col>
                        {formErrors.username && formErrors.username.length > 0 && (
                        <span className="float-left error_message">
                          {formErrors.username}
                        </span>
                      )}
                      </Col>
                    </Row>
                  </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col lg={12} md={12} sm={12} xs={12}>
                    <Form.Group id="phone_number">
                    <Form.Control
                        className="form_field_custom"
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
                <Row>
                  <Col lg={12} md={12} sm={12} xs={12}>
                  <Form.Group id="birth_date">
                    <Datetime id="birthdate_input" open={openDateTimePicker} isValidDate={disableFutureDate} dateFormat="DD-MM-YYYY" onChange={() => handleBirthDate()} value={formData.birth_date} timeFormat={false} inputProps={birthDateProp}/>
                  </Form.Group>
                  <FontAwesomeIcon onClick={() => openDateTimePickerMethod()} className="calendar_icon" icon={faCalendar} />
                  </Col>
                </Row>
                <Row>
                  <Col lg={12} md={12} sm={12} xs={12}>
                    <Form.Group id="register_password">
                    <Form.Control
                      className="form_field_custom"
                        autoComplete="off"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleChange(e)}
                        placeholder="Password"
                        required
                      >
                    </Form.Control>
                    <Row
                      style={{ margin: "8px 0px 0px 0px", padding: "0px" }}
                      >
                      <Col sm={12} xs={12} md={12} style={{ padding: "0px" }}>
                          {formErrors.password.length > 0 && (
                          <span className="float-left error_message">
                              {formErrors.password}
                          </span>
                          )}
                      </Col>
                      </Row>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col lg={12} md={12} sm={12} xs={12}>
                  <Form.Group id="confirm_password">
                    <Form.Control
                      className="form_field_custom"
                      autoComplete="off"
                      name="confirm_password"
                      type= "password"
                      value={formData.confirm_password}
                      onChange={(e) => handleChange(e)}
                      placeholder="Confirm Password"
                      required
                    ></Form.Control>
                  <Row style={{ padding: "0px", margin: "0px" }}>
                    <Col style={{ padding: "0px" }}>
                      {formErrors.confirm_password && formErrors.confirm_password.length > 0 &&
                        formErrors.password.length <= 0 && (
                          <span className="float-left error_message">
                            {formErrors.confirm_password}
                          </span>
                        )}
                    </Col>
                  </Row>
                  </Form.Group>
                </Col>
                </Row>
                <Row>
                  <Col lg={12} md={12} sm={12} xs={12}>
                    <Form.Group id="access_code">
                    <Form.Control
                        className="form_field_custom"
                        name="access_code"
                        type="access_code"
                        placeholder="Access Code"
                        value={formData.access_code}
                        onChange={(e) => handleChange(e)}
                      >
                    </Form.Control>
                    <Row style={{ padding: "0px", margin: "0px" }}>
                      <Col style={{ padding: "0px" }}>
                        {formErrors.access_code && formErrors.access_code.length > 0 && (
                        <span className="float-left error_message">
                          {formErrors.access_code}
                        </span>
                      )}
                      </Col>
                    </Row>
                  </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col lg={12} md={12} sm={12} xs={12}>
                    <Form.Group id="terms_and_conditons">
                      <Form.Check 
                        type="checkbox"
                        id="terms_and_conditons_checkbox"
                        label={termsCheckbox}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row style={{ margin: '25px 0px 0px 0px',  padding: "0px 10px"  }}>
                    <Col style={{ margin: '0px', padding: '0px' }}>
                        <Button
                            disabled={!formData.password || !formData.confirm_password || !formData.username || !formData.email}
                            size="lg"
                            className="btn-block"
                            style={{backgroundColor: '#017EFA', color: 'white', outline: 'none', border: '1px solid #017EFA' }}
                            type="submit"
                        >
                        <span style={{ fontSize: '16px', fontWeight: 'bolder' }}>Sign up</span>
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
                <Row style={{ margin: "10px 0px 0px 0px", padding: "0px" }}>
                  <Col
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                  >
                    <div onClick={() => redirectPage('/signin')} style={{ textAlign: 'center', margin: '10px 0px 0px 0px' }}><div>Already have an account ? <b style={{ fontWeight: 'bolder', cursor: 'pointer' }}>Login</b></div></div>                  
                  </Col>
                </Row>
            </Form>
          </Col>
          </Row>
        </Col>
      </Row>
  );
}

export default withRouter(SignUp);

