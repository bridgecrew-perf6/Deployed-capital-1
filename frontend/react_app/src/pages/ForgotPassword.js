import React, { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link, useHistory, withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CSRFToken from "../components/Csrf";
import "../index.css";
import axios from "axios";
import { USERS_API_URL, RECAPTCHA_SITE_KEY } from "../constants"
import { user_password_reset_success } from "../redux";
import axiosInstance from "../components/AxiosInstance";

const ForgotPassword = (props) => {

  const history = useHistory();
  const dispatch = useDispatch();

  const curr_user_data = useSelector((state) => state.session.userData);

  const [resetPasswordFormData, setResetPasswordFormData] = useState({
    resetPassword: "",
    resetPasswordConfirm: "",
  });
  const [resetEmailFormData, setResetEmailFormData] = useState({
    resetEmail: "",
  });
  const [tabKey, setTabKey] = useState("email");

  const [formErrors, setFormErrors] = useState({
    resetEmail: "",
    resetPassword: "",
    resetPasswordConfirm: "",
  });

  const [resetPasswordMethodError, setResetPasswordMethodError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [resetPasswordSuccessMsg, setResetPasswordSuccessMsg] = useState("");
  const [isIncorrectEmail, setIsIncorrectEmail] = useState(false);
  const [isIncorrectPassword, setIsIncorrectPassword] = useState("");
  const [incorrectEmailMsg, setIncorrectEmailMsg] = useState("");
  const [isValidResetEmail, setIsValidResetEmail] = useState(false);
  const [isValidResetPassword, setIsValidResetPassword] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const emailRegex = RegExp(
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  );

  const passwordRegex = RegExp(
    /^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d)(?=\S*[^\w\s])\S{6,}$/
  );
  
  const session_user_created_success = useSelector(
    (state) => state.session.userCreatedSuccess
  );

  const redirectPage = (page) => {
    history.push(page);
  }

  const formValid = (formErrors, formData, type) => {
    let valid = true;

    // validate form errors being empty
    Object.values(formErrors).forEach((val) => {
      val.length > 0 && (valid = false);
    });
    if (Object.values(formData).length <= 0) {
      valid = false;
    }
    Object.values(formData).forEach((val) => {
      if (!val || val === "") {
        valid = false;
      }
    });

    return valid;
  };

  const resetPassword = () => {
    if (formValid(formErrors, resetPasswordFormData, "password")) {
      setIsValidResetPassword(true);
      let post_data = {};
      post_data["password"] = resetPasswordFormData.resetPassword;
      post_data["email"] = resetEmailFormData.resetEmail;
      axios
        .post(USERS_API_URL+"reset_password_login/", post_data)
        .then((res) => {
          if (res.data.ok) {
            setResetPasswordMethodError(false);
            dispatch(user_password_reset_success());
            setResetPasswordFormData({
                resetPassword: "",
                resetPasswordConfirm: "",
            });
            setResetEmailFormData({
              resetEmail: ""
            });
            // history.push('/signin');
            setResetPasswordSuccessMsg("Password has been reset successfully, Login with your new password.")
            setTimeout(function(){
              setResetPasswordSuccessMsg("")
            }, 10000)
          } else {
            setResetPasswordMethodError(true);
            setResetPasswordFormData({
                resetPassword: "",
                resetPasswordConfirm: "",
            });
            console.log("error");
          }
        })
        .catch((err) => {
          setResetPasswordMethodError(true);
          setResetPasswordFormData({
            resetPassword: "",
            resetPasswordConfirm: "",
        });
          console.log("Error");
        });
    } else {
      setIsValidResetPassword(false);
      setFormErrors({ ...formErrors, resetPassword: "" });
      setFormErrors({ ...formErrors, resetPasswordConfirm: "" });
      setIsIncorrectPassword(true);
      console.error("FORM INVALID - DISPLAY ERROR MESSAGE");
    }
  };

  const handleChange = (e) => {

    e.preventDefault();
    const { name, value } = e.target;
    let password = resetPasswordFormData.resetPassword;
    // if (tabKey == "password") {
    //   let curr_reset_password = document.getElementById("forgot_password_password").value;
    //   let curr_reset_confirm_password = document.getElementById(
    //     "forgot_password_confirm_password"
    //   ).value;
    //   if (
    //     curr_reset_password !== curr_reset_confirm_password &&
    //     curr_reset_password.length > 0 &&
    //     curr_reset_confirm_password.length > 0
    //   ) {
    //     formErrors.resetPasswordConfirm =
    //       "password and confirm password should be the same";
    //   } else {
    //     formErrors.resetPasswordConfirm = "";
    //   }
    // }
    validate(name, value, password);
  };

  

  const validate = (name, value, password) => {
    setIncorrectEmailMsg("");
    switch (name) {
      case "resetEmail":
        setResetEmailFormData({ ...resetEmailFormData, resetEmail: value });
        if (emailRegex.test(value)) {
          setFormErrors({ ...formErrors, resetEmail: "" });
        } else if (value.length === 0) {
          setFormErrors({
            ...formErrors,
            resetEmail: "email field is required",
          });
        } else {
          if (value.length > 0) {
            setFormErrors({
              ...formErrors,
              resetEmail: "invalid email address",
            });
          } else {
            setIsIncorrectEmail(false);
            setFormErrors({ ...formErrors, resetEmail: "" });
          }
        }
        break;
      case "resetPassword":
        setIsIncorrectPassword(false);
        setResetPasswordFormData({
          ...resetPasswordFormData,
          resetPassword: value,
        });
        if (passwordRegex.test(value)) {
          setFormErrors({ ...formErrors, resetPassword: "" });
        } else if (value.length == 0) {
          setFormErrors({
            ...formErrors,
            resetPassword: "password field is required",
          });
        } else {
          if (value.length > 0) {
            setFormErrors({
              ...formErrors,
              resetPassword:
                "password must contain minimum 6, at least one uppercase letter, one lowercase letter, one number and one special character",
            });
          } else {
            setFormErrors({ ...formErrors, resetPassword: "" });
          }
        }
        break;
      case "resetPasswordConfirm":
        setResetPasswordFormData({
          ...resetPasswordFormData,
          resetPasswordConfirm: value,
        });
        if (value.length > 0 && value !== password) {
          setFormErrors({
            ...formErrors,
            resetPasswordConfirm:
              "password and confirm password should be the same",
          });
        } else if (value.length == 0) {
          setFormErrors({
            ...formErrors,
            resetPasswordConfirm: "confirm password field is required",
          });
        } else {
          setIsIncorrectPassword(false);
          setFormErrors({ ...formErrors, resetPasswordConfirm: "" });
        }
        break;
      default:
        break;
    }
  };

  const validateEmail = () => {
    
    let post_data = {};
    if (formValid(formErrors, resetEmailFormData, "email")) {
      post_data["email"] = resetEmailFormData.resetEmail;
      axios
        .post(USERS_API_URL+"validate_email/", post_data)
        .then((res) => {
          if (res.data.ok) {
            setIsValidResetEmail(true);
            setTabKey("password");
          } else {
            setIsValidResetEmail(false);
            setFormErrors({ ...formErrors, resetEmail: "" });
            setIsIncorrectEmail(true);
            setIncorrectEmailMsg("No such user exists");
          }
        })
        .catch((err) => {
          setIsValidResetEmail(false);
          setFormErrors({ ...formErrors, resetEmail: "" });
          setIsIncorrectEmail(true);
          setIncorrectEmailMsg("No such user exists");
        });
      console.log("VALID");
    } else {
      setIsValidResetEmail(false);
      setFormErrors({ ...formErrors, resetEmail: "" });
      setIsIncorrectEmail(true);
      setIncorrectEmailMsg("Some of the fields are empty or incorrect");
      console.error("FORM INVALID - DISPLAY ERROR MESSAGE");
    }
  };


  const sendResetPasswordEmail = () => {
    let post_data = {};
    setIsDisabled(true);
    if (formValid(formErrors, resetEmailFormData, "email")) {
      post_data["email"] = resetEmailFormData.resetEmail;
      axios
        .post(USERS_API_URL+'password_reset_email/', post_data)
        .then((res) => {
          setIsDisabled(false);
          if (res.data.ok) {
            setResetPasswordSuccessMsg(res.data.message);
            setTimeout(function () {
              setResetPasswordSuccessMsg("");
            }, 15000);
          } else {
            setResetPasswordSuccessMsg(res.data.error);
            setTimeout(function () {
              setResetPasswordSuccessMsg("");
            }, 15000);
          }
        })
        .catch((err) => {
            setIsDisabled(false);
            console.log(err);
        });
    } else {
      //pass
    }
  }


  return (
    <div>
      <Row style={{ padding: '0px 0px 0px 0px', margin: '0px'}}>
        <Col style={{ padding: '0px', margin: '0px' }} xl={12} lg={12} md={12} sm={12} xs={12}>
          <p style={{ margin: '20px 0px 0px 0px', fontSize: '1.5rem', textAlign: 'center' }}>Reset Password</p>
        </Col> 
        <Col style={{ margin: '0px', padding: '0px' }} xl={12} lg={12} md={12} sm={12} xs={12}>
          <Row style={{ padding: '0px', margin: '0px' }}>
          <Col style={{ padding: '20px 0px 0px 0px' }} xs={12} sm={12} md={12} lg={12} xl={12}>
            <Form style={{ padding: '20px 100px', margin: '0px' }} onSubmit={(e) => e.preventDefault()}>
                <CSRFToken />
                <Form.Group id="forgot_password_email">
                      <Form.Control
                          autoComplete="off"
                          name="resetEmail"
                          className="form_field_custom"
                          type="text"
                          value={resetEmailFormData.resetEmail}
                          onChange={(e) => handleChange(e)}
                          placeholder="Email"
                      ></Form.Control>
                      
                      <Row
                      style={{ margin: "8px 0px 0px 0px", padding: "0px" }}
                      >
                      <Col sm={12} xs={12} md={12} style={{ padding: "0px" }}>
                          {formErrors.resetEmail.length > 0 && (
                          <span className="float-left error_message">
                              {formErrors.resetEmail}
                          </span>
                          )}
                      </Col>
                      </Row>
                  </Form.Group>
                  <Form.Group id="forgot_password_password">
                      <Form.Control
                          autoComplete="off"
                          name="resetPassword"
                          className="form_field_custom"
                          type="password"
                          value={resetPasswordFormData.resetPassword}
                          onChange={(e) => handleChange(e)}
                          placeholder="Enter New Password"
                      ></Form.Control>
                      
                      <Row
                      style={{ margin: "8px 0px 0px 0px", padding: "0px" }}
                      >
                      <Col sm={12} xs={12} md={12} style={{ padding: "0px" }}>
                          {formErrors.resetPassword.length > 0 && (
                          <span className="float-left error_message">
                              {formErrors.resetPassword}
                          </span>
                          )}
                      </Col>
                      </Row>
                  </Form.Group>
                  <Form.Group id="forgot_password_confirm_password">
                      <Form.Control
                          autoComplete="off"
                          name="resetPasswordConfirm"
                          className="form_field_custom"
                          type="password"
                          value={resetPasswordFormData.resetPasswordConfirm}
                          onChange={(e) => handleChange(e)}
                          placeholder="Confirm Password"
                      ></Form.Control>
                      <Row
                      style={{ margin: "8px 0px 0px 0px", padding: "0px" }}
                      >
                      <Col sm={12} xs={12} md={12} style={{ padding: "0px" }}>
                          {formErrors.resetPasswordConfirm.length > 0 &&
                          formErrors.resetPassword.length <= 0 && (
                              <span className="float-left error_message">
                              {formErrors.resetPasswordConfirm}
                              </span>
                          )}
                      </Col>
                      </Row>
                      <Row
                      style={{ margin: "8px 0px 0px 0px", padding: "0px" }}
                      >
                      <Col sm={12} xs={12} md={12}>
                          {isIncorrectPassword &&
                          (formErrors.resetPassword.length <= 0 ||
                          formErrors.resetPasswordConfirm.length <= 0) ? (
                          <span className="float-left error_message">
                              Some of the fields are empty or incorrect
                          </span>
                          ) : (
                          ""
                          )}
                      </Col>
                      </Row>
                  </Form.Group>
                  <Row style={{ margin: '25px 0px 0px 0px',  padding: "0px 0px"  }}>
                      <Col style={{ margin: '0px', padding: '0px' }}>
                          <Button
                              size="lg"
                              disabled={isDisabled}
                              className="btn-block"
                              style={{backgroundColor: '#0A194E', color: 'white', outline: 'none', border: '1px solid #0A194E' }}
                              onClick={() => resetPassword()}
                              type="submit"
                          >
                          <span style={{ fontSize: '16px' }}>Reset Password</span>
                          </Button>
                      </Col>
                  </Row>
                  <Row style={{ margin: '25px 0px 0px 0px',  padding: "0px 0px"  }}>
                      <Col style={{ margin: '0px', padding: '0px' }}>
                          <Button
                              size="lg"
                              disabled={isDisabled}
                              className="btn-block"
                              style={{backgroundColor: '#017EFA', color: 'white', outline: 'none', border: '1px solid #017EFA' }}
                              onClick={() => redirectPage('/signin')}
                          >
                          <span style={{ fontSize: '16px' }}>Back to Login</span>
                          </Button>
                      </Col>
                  </Row>
                {resetPasswordSuccessMsg ? (
                <Row style={{ margin: "20px 0px 0px 0px", padding: "0px" }}>
                  <Col>
                    <p
                      style={{ textAlign: "left", fontSize: "0.8rem" }}
                      className={resetPasswordMethodError?"text-center reset_password_error_msg":"text-center reset_password_success_msg"}
                    >
                      {resetPasswordSuccessMsg}
                    </p>
                  </Col>
                </Row>
              ) : (
                ""
              )}
            </Form>
          </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default withRouter(ForgotPassword);
