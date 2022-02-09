import React, { useState, useEffect, useRef } from "react";
import { withRouter, useHistory } from "react-router-dom";
import '../index.css'
import { Row, Col, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { defaultProfilePictureImageDataUri } from "../constants";
import Form from "react-bootstrap/Form";
import moment from 'moment'
import { user_data, clear_session } from "../redux";
import axiosInstance from "./AxiosInstance";
import CSRFToken from "./Csrf";
import Dialog from "react-bootstrap-dialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faCamera } from "@fortawesome/free-solid-svg-icons";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

const Profile = (props) => {
  
  let CustomDialog = useRef(null);
  const history = useHistory();
  const [formData, setFormData] = useState({
    'first_name':'',
    'last_name':'',
    'birth_date':'',
    'email':'',
    'username': '',
    'profile_picture':''
  });
  const [formErrors, setFormErrors] = useState({
    'first_name':'',
    'last_name':'',
    'birth_date':'',
    'email':'',
    'username': '',
    'profile_picture':''
  });

  const emailRegex = RegExp(
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  );

  const passwordRegex = RegExp(
    /^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d)(?=\S*[^\w\s])\S{6,}$/
  );

  const curr_user_data = useSelector((state) => state.session.userData);
  const [modifiedUserFormData, setModifiedUserFormData] = useState({});
  const [isAuth, setIsAuth] = useState(false);

  const [signUpSuccessMsg, setSignUpSuccessMsg] = useState("");
  const [isFormSubmitError, setIsFormSubmitError] = useState(false);
  const dispatch = useDispatch();
  const [isDisabled, setIsDisabled] = useState(false);
  const [openDateTimePicker, setOpenDateTimePicker] = useState(false);
  const birthDateRef = useRef();

  useEffect(() => { 
    if(curr_user_data){
      let reqFormData = {
        'first_name': curr_user_data.first_name,
        'last_name': curr_user_data.last_name,
        'birth_date': curr_user_data.birth_date,
        'email': curr_user_data.email,
        'username': curr_user_data.username,
        'profile_picture':curr_user_data.profile_picture
      }
      setFormData(reqFormData);
    }
  }, [curr_user_data]);

  const redirectPage = (page) => {
    history.push(page);
  }

  const logout = () => {
    axiosInstance
      .get("users/logout/")
      .then((response) => {
        if (response.data.ok) {
          dispatch(clear_session());
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          history.push("/signin");
        } else {
          console.log("Error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
    };

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

  const removeProfilePicture = () => {
    setFormData({...formData, profile_picture: ''});
  }

  const removeProfilePictureRef = () => {
        
    CustomDialog.show({
        body:"Are you sure you want to remove your profile picture ?",
        actions: [
        Dialog.DefaultAction(
            "Remove",
            () => {removeProfilePicture()},
            "btn-danger"
        ),
        Dialog.Action(
            "Close",
            () => {
               if(CustomDialog){
                   CustomDialog.hide()
               }
            },
            "btn-primary"
        ),
        ],
    });
};

  const formValid = (formErrors, formData) => {

    let valid = true;

    // validate form errors being empty
    Object.keys(formErrors).forEach((key) => {
      formErrors[key].length > 0 && (valid = false);
    });

    // validate the form was filled out
    Object.keys(formData).forEach((key) => {
      if(key !== 'username' && key !=='profile_picture' && key !=='birth_date'){
        formData[key] === null && (valid = false);
      }
    });

    return valid;
  };
  
  const getBase64 = (file, cb) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        cb(reader.result)
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
  }

  const profilePictureHandler = (e) => {
    let profile_picture_file = e.target.files[0];
    getBase64(profile_picture_file, (result) => {
      setFormData({...formData, profile_picture: result});
    });
  }

  const openDateTimePickerMethod = () => {
    setOpenDateTimePicker(!openDateTimePicker)
  }

  

  const handleSubmit = (e, type, data) => {
    if(type !== 'sso'){
      e.preventDefault();
    }
    let t1 = {...curr_user_data};
    let t2 = {...formData};
    if(t1.hasOwnProperty('password')){
      delete t1['password']
    }
    if(t2.hasOwnProperty('password')){
      delete t2['password']
    }
    if(shallowEqual(t1, t2)){
      setIsFormSubmitError(true);
      setSignUpSuccessMsg("You have not changed any values.");
      setTimeout(function () {
        setSignUpSuccessMsg("");
      }, 10000);
    }else{
    let post_data = {};
    let valid = false;
    if (type === "sso") {
      post_data = data;
      valid = true;
    } else {
      if (formValid(formErrors, formData)) {
        valid = true;
        post_data = formData;
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
      setIsDisabled(true);
      post_data["password"] = curr_user_data.password;
      post_data['id'] = curr_user_data.id;
      axiosInstance
        .put("users/modify_profile/"+parseInt(curr_user_data.id), post_data)
        .then((response) => {
          setIsDisabled(false);
          if (response.data.ok) {
              setIsFormSubmitError(false);
              setFormData(response.data.user);
              setModifiedUserFormData(response.data.user);
              dispatch(user_data(response.data.session_user));
              setSignUpSuccessMsg("User modified successfully.");
              setTimeout(function () {
                setSignUpSuccessMsg("");
              }, 10000);
          } else {
            setIsFormSubmitError(true);
            setSignUpSuccessMsg(response.data.error);
            setTimeout(function () {
              setSignUpSuccessMsg("");
            }, 10000);
            console.log("Error");
          }
        })
        .catch((error) => {
          setIsDisabled(false);
          setIsFormSubmitError(true);
          setSignUpSuccessMsg("Some error Occurred");
          setTimeout(function () {
            setSignUpSuccessMsg("");
          }, 10000);
          console.log(error);
      });
    }
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

  const editProfilePicture = () => {
    //pass
  }

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
      default:
        break;
    }
  };


  return (
    <Row style={{ padding: '0px 0px 0px 0px', margin: '0px' }}>
      <Col xl={{ offset: 1, span: 11 }} lg={{ offset: 1, span: 11 }} md={{ offset: 1, span: 11 }} sm={{ offset: 1, span: 11 }} xs={{ offset: 1, span: 11 }}>
        <p style={{ fontWeight: 'bold', margin: '20px 0px 20px 0px', fontSize: '1.5rem', textAlign: 'left' }}>Profile Settings</p>
        <div style={{ display: "none" }}>
            <Dialog
                ref={(el) => {
                    CustomDialog = el;
                }}
            />
        </div>
      </Col> 
     <Col className="profile_section"  xs={{ offset: 1, span: 10 }} sm={{ offset: 1, span: 10 }} md={{ offset: 1, span: 10 }} lg={{ offset: 1, span: 10 }} xl={{ offset: 1, span: 8 }}>
        <Row style={{ padding: '20px', margin: '0px' }}>
          <Col xs={{ span: 12 }} sm={{  span: 5 }} md={{  span: 4 }} lg={{ span: 3 }} xl={{ span: 2 }}>
            <div style={{ position: 'relative' }}>
            <img src={formData && formData.profile_picture ? formData.profile_picture : defaultProfilePictureImageDataUri} className="profile_img"/>
            <div className="profile_picture_upload">
                <label htmlFor="profile_picture">
                <OverlayTrigger
                      key="top"
                      placement="top"
                      overlay={
                          <Tooltip>
                              <span>Change Picture</span>
                          </Tooltip>
                      }
                      >
                      <FontAwesomeIcon onClick={() => editProfilePicture()} color="gray" icon={faCamera} className="profile_picture_remove"/>
                  </OverlayTrigger>
                </label>
                <input onChange={profilePictureHandler} id="profile_picture" type="file" />
            </div>
            {/* {formData && formData.profile_picture ?
              <FontAwesomeIcon onClick={() => removeProfilePictureRef()} color="red" icon={faTimes} className="profile_picture_remove"/>
              :
              <div className="profile_picture_upload">
                <label htmlFor="profile_picture">
                <FontAwesomeIcon onClick={() => editProfilePicture()} color="gray" icon={faCamera} className="profile_picture_remove"/>
                </label>
                <input onChange={profilePictureHandler} id="profile_picture" type="file" />
            </div>} */}
            </div>
          </Col>
          <Col style={{ margin: '0px', padding: '0px' }} xs={12} sm={7} md={8} lg={9} xl={10}>
            <Row style={{ margin: '0px', padding: '0px' }}>
              <Col style={{ margin: '0px', padding: '0px' }} xs={12} sm={12} md={12} lg={12} xl={12}>
                <p style={{ margin: '15px 0px 5px 0px', padding: '0px', float: 'left', fontSize: '1.2rem' }}>@{formData.username}</p>
              </Col>
              <Col style={{ margin: '0px', padding: '0px' }} xs={12} sm={12} md={12} lg={12} xl={12}>
                <p onClick={() => logout()} style={{ margin: '0px', padding: '0px', color: '#017EFA', float: 'left', fontSize: '1rem', cursor: 'pointer' }}>Logout</p>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row style={{ padding: '30px 0px 5px 0px', margin: '0px' }}>
          <Col xs={{span: 12}} sm={{span: 12}} md={{span: 12}} lg={{span: 12}} xl={{span: 12}}>
            <p style={{ margin: '0px', padding: '0px 20px', color: '#017EFA', float: 'left', fontSize: '1rem' }}>Edit Details</p>
          </Col>
        </Row>
        <Row style={{ padding: '10px 0px', margin: '0px' }}>
          <Col xs={12} sm={12} md={12} lg={8} xl={8}>
          <Form style={{ padding: '0px ' }} onSubmit={(e) => handleSubmit(e, "login", "")}>
                <CSRFToken/>
                <Row style={{ margin: '0px', padding: '0px' }}>
                  <Col lg={6} md={6} sm={6} xs={6}>
                    <Form.Group id="first_name">
                    <Form.Control
                        className="custom_bg_white"
                        name="first_name"
                        type="first_name"
                        placeholder="First Name"
                        value={formData.first_name}
                        onChange={(e) => handleChange(e)}
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
                        className="custom_bg_white"
                        name="last_name"
                        type="last_name"
                        placeholder="Last Name"
                        value={formData.last_name}
                        onChange={(e) => handleChange(e)}
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
                <Row style={{ margin: '0px', padding: '0px' }}>
                  <Col lg={12} md={12} sm={12} xs={12}>
                    <Form.Group id="username">
                    <Form.Control
                        className="custom_bg_white"
                        name="username"
                        type="text"
                        placeholder="Username"
                        value={formData.username}
                        onChange={(e) => handleChange(e)}
                        required
                      >
                    </Form.Control>
                    <Row style={{ padding: "0px", margin: "0px" }}>
                      <Col style={{ padding: "0px" }}>
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
                <Row style={{ margin: '0px', padding: '0px' }}>
                  <Col lg={12} md={12} sm={12} xs={12}>
                    <Form.Group id="email">
                    <Form.Control
                        className="custom_bg_white"
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
                <Row style={{ margin: '10px 0px 20px 0px',  padding: "0px 10px"  }}>
                    <Col xs={12} sm={12} md={6} lg={4} xl={6} style={{ margin: '0px', padding: '0px 5px' }}>
                        <Button
                            size="md"
                            className="btn-block"
                            style={{ backgroundColor: '#017EFA', color: 'white', outline: 'none', border: '1px solid #017EFA' }}
                            type="submit"
                        >
                        <span>Save</span>
                        </Button>
                    </Col>
                    <Col xs={12} sm={12} md={6} lg={8} xl={6} style={{ margin: '0px', padding: '0px 5px' }}>
                        <Button
                            size="md"
                            className="btn-block change_password_btn"
                            style={{ backgroundColor: '#0A194E', color: 'white', outline: 'none', border: '1px solid #0A194E', float: 'right' }}
                            onClick={() => redirectPage('/change_password')}
                        >
                        <span>Change Password</span>
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

export default withRouter(Profile);
