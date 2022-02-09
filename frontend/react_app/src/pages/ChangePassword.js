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

  const [changePasswordFormData, setchangePasswordFormData] = useState({
    changePassword: "",
    changePasswordConfirm: "",
  });
  const [resetEmailFormData, setResetEmailFormData] = useState({
    resetEmail: "",
  });
  const [tabKey, setTabKey] = useState("email");

  const [formErrors, setFormErrors] = useState({
    resetEmail: "",
    changePassword: "",
    changePasswordConfirm: "",
  });

  const [changePasswordMethodError, setchangePasswordMethodError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [changePasswordSuccessMsg, setchangePasswordSuccessMsg] = useState("");
  const [isIncorrectEmail, setIsIncorrectEmail] = useState(false);
  const [isIncorrectPassword, setIsIncorrectPassword] = useState("");
  const [incorrectEmailMsg, setIncorrectEmailMsg] = useState("");
  const [isValidResetEmail, setIsValidResetEmail] = useState(false);
  const [isValidChangePassword, setIsValidChangePassword] = useState(false);
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

  const changePassword = () => {
    if (formValid(formErrors, changePasswordFormData, "password")) {
      setIsValidChangePassword(true);
      let post_data = {};
      post_data["password"] = changePasswordFormData.changePassword;
      post_data["email"] = curr_user_data.email;
      axiosInstance
        .post("users/change_password/", post_data)
        .then((res) => {
          if (res.data.ok) {
            setchangePasswordMethodError(false);
            dispatch(user_password_reset_success());
            setchangePasswordFormData({
                changePassword: "",
                changePasswordConfirm: "",
            });
            // history.push('/signin');
            setchangePasswordSuccessMsg("Password has been reset successfully.")
            setTimeout(function(){
              setchangePasswordSuccessMsg("")
            }, 10000)
          } else {
            setchangePasswordMethodError(true);
            setchangePasswordFormData({
                changePassword: "",
                changePasswordConfirm: "",
            });
            console.log("error");
          }
        })
        .catch((err) => {
          setchangePasswordMethodError(true);
          setchangePasswordFormData({
            changePassword: "",
            changePasswordConfirm: "",
        });
          console.log("Error");
        });
    } else {
      setIsValidChangePassword(false);
      setFormErrors({ ...formErrors, changePassword: "" });
      setFormErrors({ ...formErrors, changePasswordConfirm: "" });
      setIsIncorrectPassword(true);
      console.error("FORM INVALID - DISPLAY ERROR MESSAGE");
    }
  };

  const handleChange = (e) => {

    e.preventDefault();
    const { name, value } = e.target;
    let password = changePasswordFormData.changePassword;
    if (tabKey == "password") {
      let curr_reset_password = document.getElementById("forgot_password_password").value;
      let curr_reset_confirm_password = document.getElementById(
        "forgot_password_confirm_password"
      ).value;
      if (
        curr_reset_password !== curr_reset_confirm_password &&
        curr_reset_password.length > 0 &&
        curr_reset_confirm_password.length > 0
      ) {
        formErrors.changePasswordConfirm =
          "password and confirm password should be the same";
      } else {
        formErrors.changePasswordConfirm = "";
      }
    }
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
      case "changePassword":
        setIsIncorrectPassword(false);
        setchangePasswordFormData({
          ...changePasswordFormData,
          changePassword: value,
        });
        if (passwordRegex.test(value)) {
          setFormErrors({ ...formErrors, changePassword: "" });
        } else if (value.length == 0) {
          setFormErrors({
            ...formErrors,
            changePassword: "password field is required",
          });
        } else {
          if (value.length > 0) {
            setFormErrors({
              ...formErrors,
              changePassword:
                "password must contain minimum 6, at least one uppercase letter, one lowercase letter, one number and one special character",
            });
          } else {
            setFormErrors({ ...formErrors, changePassword: "" });
          }
        }
        break;
      case "changePasswordConfirm":
        setchangePasswordFormData({
          ...changePasswordFormData,
          changePasswordConfirm: value,
        });
        if (value.length > 0 && value !== password) {
          setFormErrors({
            ...formErrors,
            changePasswordConfirm:
              "password and confirm password should be the same",
          });
        } else if (value.length == 0) {
          setFormErrors({
            ...formErrors,
            changePasswordConfirm: "confirm password field is required",
          });
        } else {
          setIsIncorrectPassword(false);
          setFormErrors({ ...formErrors, changePasswordConfirm: "" });
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


  const sendchangePasswordEmail = () => {
    let post_data = {};
    setIsDisabled(true);
    if (formValid(formErrors, resetEmailFormData, "email")) {
      post_data["email"] = resetEmailFormData.resetEmail;
      axios
        .post(USERS_API_URL+'password_reset_email/', post_data)
        .then((res) => {
          setIsDisabled(false);
          if (res.data.ok) {
            setchangePasswordSuccessMsg(res.data.message);
            setTimeout(function () {
              setchangePasswordSuccessMsg("");
            }, 15000);
          } else {
            setchangePasswordSuccessMsg(res.data.error);
            setTimeout(function () {
              setchangePasswordSuccessMsg("");
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
    <div style={{height: 'calc(100vh - 66px)' }}>
      <Row style={{ padding: '10px 0px 0px 0px', margin: '0px'}}>
        <Col xl={{ offset: 1, span: 11 }} lg={{ offset: 1, span: 11 }} md={{ offset: 1, span: 11 }} sm={12} xs={12}>
          <p style={{ fontWeight: 'bold', margin: '20px 0px 20px 0px', fontSize: '1.5rem', textAlign: 'left' }}>Change Password</p>
        </Col> 
        <Col xl={{ offset: 1, span: 6 }} lg={{ offset: 1, span: 6 }} md={{ offset: 1, span: 6 }} sm={12} xs={12} className="change_password_section">
          <Row style={{ padding: '0px', margin: '0px' }}>
          <Col xs={12} sm={12} md={12} lg={12} xl={12}>
            <Form style={{ padding: '40px 20px 20px 20px', margin: '0px' }} onSubmit={(e) => e.preventDefault()}>
                <CSRFToken />
                  <Form.Group id="forgot_password_password">
                      <Form.Control
                          autoComplete="off"
                          name="changePassword"
                          className="custom_bg_white"
                          type="password"
                          value={changePasswordFormData.changePassword}
                          onChange={(e) => handleChange(e)}
                          placeholder="Enter New Password"
                      ></Form.Control>
                      
                      <Row
                      style={{ margin: "8px 0px 0px 0px", padding: "0px" }}
                      >
                      <Col sm={12} xs={12} md={12} style={{ padding: "0px" }}>
                          {formErrors.changePassword.length > 0 && (
                          <span className="float-left error_message">
                              {formErrors.changePassword}
                          </span>
                          )}
                      </Col>
                      </Row>
                  </Form.Group>
                  <Form.Group id="forgot_password_confirm_password">
                      <Form.Control
                          autoComplete="off"
                          name="changePasswordConfirm"
                          className="custom_bg_white"
                          type="password"
                          value={changePasswordFormData.changePasswordConfirm}
                          onChange={(e) => handleChange(e)}
                          placeholder="Confirm Password"
                      ></Form.Control>
                      <Row
                      style={{ margin: "8px 0px 0px 0px", padding: "0px" }}
                      >
                      <Col sm={12} xs={12} md={12} style={{ padding: "0px" }}>
                          {formErrors.changePasswordConfirm.length > 0 &&
                          formErrors.changePassword.length <= 0 && (
                              <span className="float-left error_message">
                              {formErrors.changePasswordConfirm}
                              </span>
                          )}
                      </Col>
                      </Row>
                      <Row
                      style={{ margin: "8px 0px 0px 0px", padding: "0px" }}
                      >
                      <Col sm={12} xs={12} md={12}>
                          {isIncorrectPassword &&
                          (formErrors.changePassword.length <= 0 ||
                          formErrors.changePasswordConfirm.length <= 0) ? (
                          <span className="float-left error_message">
                              Some of the fields are empty or incorrect
                          </span>
                          ) : (
                          ""
                          )}
                      </Col>
                      </Row>
                  </Form.Group>
                  <Row style={{ margin: '25px 0px 0px 0px',  padding: "0px 10px"  }}>
                      <Col style={{ margin: '0px', padding: '0px' }}>
                          <Button
                              size="md"
                              disabled={isDisabled}
                              className="btn-block"
                              style={{backgroundColor: '#017EFA', color: 'white', outline: 'none', border: '1px solid #017EFA' }}
                              onClick={() => changePassword()}
                              type="submit"
                          >
                          <span style={{ fontSize: '16px' }}>Reset Password</span>
                          </Button>
                      </Col>
                  </Row>
                {changePasswordSuccessMsg ? (
                <Row style={{ margin: "20px 0px 0px 0px", padding: "0px" }}>
                  <Col>
                    <p
                      style={{ textAlign: "left", fontSize: "0.8rem" }}
                      className={changePasswordMethodError?"text-center reset_password_error_msg":"text-center reset_password_success_msg"}
                    >
                      {changePasswordSuccessMsg}
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
