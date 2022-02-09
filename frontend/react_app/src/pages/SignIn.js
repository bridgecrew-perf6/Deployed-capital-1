import React, { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import Modal from "react-bootstrap/Modal";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { Orientation } from "../components/Orientation";
import {
  FaEye,
  FaEyeSlash,
  FaEnvelopeOpen,
  FaUserShield,
  FaCheckCircle,
} from "react-icons/fa";
import { USERS_API_URL, SSO_PASS } from "../constants/";
import {
  sign_in,
  user_data,
  user_created_success,
  all_users
} from "../redux";
import axios from "axios";
import { Link, useHistory, withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CSRFToken from "../components/Csrf";
import "../index.css";
import axiosInstance from "../components/AxiosInstance";

const SignIn = (props) => {
  // const [windowDimensions, setWindowDimensions] = useState({
  //   height: window.innerHeight,
  //   width: window.innerWidth,
  // });
  const history = useHistory();
  const dispatch = useDispatch();
  const store_user_created_success = useSelector(
    (state) => state.session.user_created_success
  );
  const [userCreatedMsg, setUserCreatedMsg] = useState("");
  const [resetPasswordMsg, setResetPasswordMsg] = useState("");
  const [orientation, setOrientation] = useState("default");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [resetPasswordSuccessMsg, setResetPasswordSuccessMsg] = useState("");
  const [password, setPassword] = useState("");
  const [isValidLogin, setIsValidLogin] = useState(true);
  const [isIncorrectPassword, setIsIncorrectPassword] = useState("");
  const [isIncorrectEmail, setIsIncorrectEmail] = useState(false);
  const [incorrectEmailMsg, setIncorrectEmailMsg] = useState("");
  const [isValidResetEmail, setIsValidResetEmail] = useState(false);
  const [isValidResetPassword, setIsValidResetPassword] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showResetPasswordConfirm, setShowResetPasswordConfirm] = useState(
    false
  );
  const [resetPasswordModal, setResetPasswordModalShow] = useState(false);
  const [tabKey, setTabKey] = useState("email");
  const [resetPasswordFormData, setResetPasswordFormData] = useState({
    resetPassword: "",
    resetPasswordConfirm: "",
  });
  const [resetEmailFormData, setResetEmailFormData] = useState({
    resetEmail: "",
  });
  const [formErrors, setFormErrors] = useState({
    resetEmail: "",
    resetPassword: "",
    resetPasswordConfirm: "",
    email:""
  });
  const [resetPasswordEmailModal, setResetPasswordEmailModal] = useState(false);
  const [resetPasswordModalMethodError, setResetPasswordModalMethodError] = useState(false);

  const emailRegex = RegExp(
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  );

  const passwordRegex = RegExp(
    /^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d)(?=\S*[^\w\s])\S{6,}$/
  );

  let session_user_created_success = useSelector(
    (state) => state.session.userCreatedSuccess
  );

  let session_reset_password_success = useSelector(
    (state) => state.session.resetPasswordSuccess
  );

  const termsCheckbox = 'I read/ confirm T&C and privacy policy to continue the authorization process';

  useEffect(() => {
    localStorage.removeItem('signUpData');
    if (session_user_created_success.message_type === 'sso_login') {
      setUserCreatedMsg("Your account has been created successfully with Google. Please reset your password");
      setTimeout(function () {
        setUserCreatedMsg("");
      }, 10000);
    }else if(session_user_created_success.message_type === 'login'){
      setUserCreatedMsg("Your account has been created successfully.");
      setTimeout(function () {
        setUserCreatedMsg("");
      }, 10000);
    }
  }, [session_user_created_success]);

  useEffect(() => {
    if (session_reset_password_success) {
      setResetPasswordMsg("Password has been reset successfully, Login with your new password.");
      setTimeout(function () {
        setResetPasswordMsg("");
      }, 10000);
    }
  }, [session_reset_password_success])

//   const blinkElement = () => {
//     var ele = document.getElementById("forgot_password");
//     ele.className += " blink_me";
//   };

  const redirectPage = (page) => {
    history.push(page);
  }

  const passwordVisibilityToggle = (id, reset, type) => {
    if (reset) {
      if (type === "new") {
        let reset_password = !showResetPassword;
        setShowResetPassword(reset_password);
      } else {
        let reset_password_confirm = !showResetPasswordConfirm;
        setShowResetPasswordConfirm(reset_password_confirm);
      }
    } else {
      let login_password = !showPassword;
      setShowPassword(login_password);
    }
  };

  const responseGoogle = (response) => {
    let profileObj = response.profileObj;
    handleSubmit({}, "sso", { email: profileObj.email, type: 'sso', password: SSO_PASS })
  }

  const responseFacebook = (response) => {
    console.log(response);
  }

  const onFbLogin = (data) => {
    console.log(data)
  }

  const handleSubmit = (e, type, data) => {
    let post_data = {};
    if (type === "sso") {
      post_data = data;
    } else {
      e.preventDefault();
      post_data = { email: email, password: password, type: type };
    }
    axiosInstance
      .post("users/login/", post_data)
      .then((res) => {
        if (res.data.ok) {
          localStorage.setItem("refreshToken", res.data.refresh);
          localStorage.setItem("accessToken", res.data.access);
          dispatch(sign_in());
          setIsValidLogin(true);
          dispatch(user_data(res.data.user));
          dispatch(all_users(res.data.all_users));
          history.push("/dashboard");
        } else {
          let err_msg = res.data
            ? res.data.error
            : "Some of the fields are incorrect.";
          setIsValidLogin(false);
          setResetPasswordMsg("");
          setErrorMessage(err_msg);
          setUserCreatedMsg("");
          setTimeout(function () {
            setErrorMessage("");
          }, 10000);
        }
      })
      .catch((err) => {
        let err_msg = err
            ? err.message
            : "Some of the fields are incorrect.";
          setIsValidLogin(false);
          setErrorMessage(err_msg);
          setResetPasswordMsg("");
          setUserCreatedMsg("");
          setTimeout(function () {
            setErrorMessage("");
          }, 10000);
        console.log(err);
      });
  };

  const setBorder = (val) => {

    const ele = document.getElementById(val);
    ele.style.outline = 'none';

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
      closeResetPasswordModal();
      let post_data = {};
      post_data["password"] = resetPasswordFormData.resetPassword;
      post_data["email"] = resetEmailFormData.resetEmail;
      axiosInstance
        .post("users/forgot_password/", post_data)
        .then((res) => {
          if (res.data.ok) {
            setResetPasswordSuccessMsg("Password has been reset successfully, Login with your new password.")
            setTimeout(function(){
              setResetPasswordSuccessMsg("")
            }, 10000)
          } else {
            console.log("error");
          }
        })
        .catch((err) => {
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
    if (tabKey == "password") {
      let curr_reset_password = document.getElementById("reset_password").value;
      let curr_reset_confirm_password = document.getElementById(
        "reset_password_confirm"
      ).value;
      if (
        curr_reset_password !== curr_reset_confirm_password &&
        curr_reset_password.length > 0 &&
        curr_reset_confirm_password.length > 0
      ) {
        formErrors.resetPasswordConfirm =
          "password and confirm password should be the same";
      } else {
        formErrors.resetPasswordConfirm = "";
      }
    }
    validate(name, value, password);
  };

  const validate = (name, value, password) => {
    setIncorrectEmailMsg("");
    switch (name) {
      case "email":
        setEmail(value);
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


  const sendResetPasswordEmail = () => {
    let post_data = {};
    setIsDisabled(true);
    if (formValid(formErrors, resetEmailFormData, "email")) {
      post_data["email"] = resetEmailFormData.resetEmail;
      axios
        .post(USERS_API_URL+'password_reset_email/', post_data)
        .then((res) => {
          setIsDisabled(false);
          closeResetPasswordEmailModal();
          if (res.data.ok) {
            setResetPasswordModalMethodError(false);
            setResetPasswordSuccessMsg(res.data.message);
            setTimeout(function () {
              setResetPasswordSuccessMsg("");
            }, 10000);
          } else {
            setResetPasswordModalMethodError(true);
            setResetPasswordSuccessMsg(res.data.error);
            setTimeout(function () {
              setResetPasswordSuccessMsg("");
            }, 10000);
          }
        })
        .catch((err) => {
            setResetPasswordModalMethodError(true);
            setIsDisabled(false);
            console.log(err);
        });
    } else {
      //pass
    }
  }

  const openResetPasswordModal = () => {
    setIsValidResetEmail(false);
    setTabKey("email");
    setResetPasswordModalShow(true);
    setFormErrors({
      ...formErrors,
      resetEmail: "",
    });
    setIncorrectEmailMsg("");
    setResetPasswordFormData({
      resetPassword: "",
      resetPasswordConfirm: "",
    });
    setResetEmailFormData({ resetEmail: "" });
  };

  const closeResetPasswordModal = () => {
    setResetPasswordModalShow(false);
    if(props.admin){
      history.push("/admin");
    }else{
      history.push("/login");
    }
  };

  const openResetPasswordEmailModal = () => {
    setIsValidResetEmail(false);
    setResetPasswordEmailModal(true);
    setResetEmailFormData({ resetEmail: "" });
    setFormErrors({
      ...formErrors,
      resetEmail: "",
    });
    setIncorrectEmailMsg("");
  }

  const closeResetPasswordEmailModal = () => {
    setResetPasswordEmailModal(false);
  }

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

  return (
      <Row>
        <Col style={{ margin: '10px 0px 0px 0px' }} lg="12" md="12" sm="12" xs="12">
          <span style={{  fontStyle: 'normal', fontSize: '30px' }}>Welcome Back</span>
        </Col>
        <Col style={{ margin: '5px 0px 0px 0px' }} lg="12" md="12" sm="12" xs="12">
          <span style={{ fontStyle: 'normal', fontSize: '14px' }}>Please enter your credentials</span>
        </Col>
        <Col style={{ margin: '20px 0px 0px 0px' }} lg="12" md="12" sm="12" xs="12">
          <Form className="custom_form" onSubmit={(e) => handleSubmit(e, "login", "")}>
              <CSRFToken />
              <Row>
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <Form.Group id="email">
                  <Form.Control
                    className="form_field_custom"
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    autoComplete="off"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  ></Form.Control>
                </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Form.Group id="password">
                  <Form.Control
                    className="form_field_custom"
                    autoComplete="off"
                    name="password"
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                  >
                  </Form.Control>
              </Form.Group>
                </Col>
              </Row>
            <Row style={{ margin: '0px 0px 15px 0px',  padding: "0px"  }}>
              <Col xs={12}
                   sm={12}
                   md={12}
                   lg={12}
                   xl={12} style={{ margin: '0px', padding: '0px 0px 0px 0px' }}>
                <p onClick={() => redirectPage('/forgot_password')} style={{ color: '#017EFA', cursor: 'pointer', textAlign: 'left', margin: '0px', fontSize:'13px' }}>Forgot Password ?</p>
              </Col>
            </Row>
            <Row>
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Form.Group id="terms_and_conditons">
                    <Form.Check 
                      type="checkbox"
                      id="terms_and_conditons_checkbox"
                      label={termsCheckbox}
                    />
                  </Form.Group>
                </Col>
            </Row>
            <Row style={{ margin: '20px 0px 0px 0px',  padding: "0px"  }}>
                <Col style={{ margin: '0px', padding: '0px' }}>
                    <Button
                        size="lg"
                        className="btn-block"
                        style={{backgroundColor: '#0A194E', color: 'white', outline: 'none', border: '1px solid #0A194E' }}
                        type="submit"
                    >
                    <span style={{ fontSize: '16px', fontWeight: 'bolder' }}>Log in</span>
                    </Button>
                </Col>
            </Row>
            {!isValidLogin ? (
              <Row style={{ margin: "20px 0px 0px 0px", padding: "0px" }}>
                <Col style={{ margin: '0px', padding: '0px' }}>
                  <p
                    style={{ fontSize: "0.9rem"}}
                    className="text-center sign_in_error_message"
                  >
                    {errorMessage}
                  </p>
                </Col>
              </Row>
            ) : (
              ""
            )}
            {userCreatedMsg ? (
              <Row style={{ margin: "15px 0px 0px 0px", padding: "0px" }}>
              <Col style={{ margin: '0px', padding: '0px' }}>
                <p
                  style={{ fontSize: "1rem" }}
                  className="text-center user_created_message_login"
                >
                  {userCreatedMsg}
                </p>
              </Col>
            </Row>) : (
              ""
            )}
            {/* {resetPasswordMsg ? (
              <Row style={{ margin: "0px", padding: "0px" }}>
                <Col>
                  <p
                    style={{ fontSize: "0.8rem" }}
                    className="text-center reset_password_success_msg"
                  >
                    {resetPasswordMsg}
                  </p>
                </Col>
              </Row>
            ) : (
              ""
            )} */}
            <Row style={{ margin: "0px", padding: "0px" }}>
              <Col
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={12}
              >
                <div onClick={() => redirectPage('/signup')} style={{  textAlign: 'center', margin: '10px 0px 0px 0px' }}><div style={{ color: 'black' }}>Don't have an account ? <b style={{ fontWeight: 'bolder', cursor: 'pointer' }}>Sign up</b></div> </div>                  
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
  );
}

export default withRouter(SignIn);
