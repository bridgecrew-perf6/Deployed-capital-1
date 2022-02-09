import React, { useState, useEffect, useRef } from "react";
import { withRouter, useHistory } from "react-router-dom";
import { Row, Col, Form, FormControl } from "react-bootstrap";
import Sidebar from "../components/Sidebar";
import Navbar from 'react-bootstrap/Navbar'
import Nav from "react-bootstrap/Nav";
import { faSearch, faShareAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import { defaultProfilePictureImageDataUri } from "../constants";
import { useSelector, useDispatch } from "react-redux";
import axiosInstance from "../components/AxiosInstance";
import { clear_session, all_users } from "../redux";

const GridLayout = (props) => {
  
  const history = useHistory();
  const dispatch = useDispatch();
  const notificationRef = useRef();
  const profileRef = useRef();
  const searchRef = useRef();

  const [panel, setPanel] = useState({'search': false, 'notifications': false, 'profile': false});

  const [searchValue, setSearchValue] = useState('');

  const curr_user_data = useSelector((state) => state.session.userData);

  const session_all_users = useSelector((state) => state.session.allUsers);

  const [notifications, setNotifications] = useState(Array.from(Array(0).keys()));

  const [users, setUsers] = useState(session_all_users);

  const [originalUsers, setOriginalUsers] = useState(session_all_users);

  useEffect(() => { 
    // if(session_all_users && session_all_users.length <= 0){
    //   getAllUsers();
    // }
    // else{
    setUsers(session_all_users);
    setOriginalUsers(session_all_users);
    // }
    // document.addEventListener("mousedown", handleClickOutside, false);  
  }, [session_all_users])

  const getAllUsers = () => {
    let post_data = {}
    post_data['user_id'] = curr_user_data.id;
    axiosInstance
      .post("users/manage_users/", post_data)
      .then((response) => {
        if (response.data.ok) {
          let users = response.data.users;
          setUsers(users);
          setOriginalUsers(users);
          dispatch(all_users(users));
        } else {
          console.log("Error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }; 

  const redirectPage = (page) => {
    history.push(page);
  }

  const handleClickOutside = (e) => {
    let type = e.target.id;
    if(type === 'notification'){
      // setPanel({...panel, search: false, profile: false});
    }else if(type === 'profile'){
      // setPanel({...panel, notifications: false, search: false});
    }else if(type === 'search'){
      // setPanel({...panel, notifications: false, profile: false});
    }else if(type === 'profile_settings'){
      // setPanel({...panel, notifications: false, search: false});
    }else if(type === 'change_password_settings'){
      // setPanel({...panel, notifications: false, profile: false});
    }else if(type === 'logout_settings'){
      // setPanel({...panel, notifications: false, profile: false});
    }else{
      setPanel({...panel, notifications: false, profile: false});
    }
  };

  const handleSearchClick = (val) => {
    if(val.length > 0){
      setPanel({notifications: false, search: true, profile: false});
    }
  }

  const isNum = (val) => {
    return !isNaN(val)
  }

  const handlePanel = (type, val) => {
    if(type === 'profile'){
      setPanel({
        profile: !panel.profile,
        search: false,
        notifications: false
      })
    }else if(type === 'notifications'){
      setPanel({
        ...panel,
        notifications: !panel.notifications,
        search: false,
        profile: false
      })
    }else if(type === 'search'){
      let show = val.length !== 0;
      if(show){
        let searchQuery = isNum(val)?val:val.toLowerCase();
        let searchedUsers = originalUsers.filter(item => {
          let username = item.username?item.username.toLowerCase():'';
          let phoneNumber = item.phone_number?item.phone_number:'';
          return username.indexOf(searchQuery) !== -1 || phoneNumber.indexOf(searchQuery) !== -1;
        });
        setUsers(searchedUsers);
      }else{
        setUsers(originalUsers);
      }
      setPanel({
        ...panel,
        search: show,
        profile: false,
        notifications: false
      })
      setSearchValue(val);
    }
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

  return (
    <Row style={{ margin: '0px', padding: '0px' }}>
      <Col style={{ margin: '0px', padding: '0px'}} xl={2} lg={3} md={2} sm={0} xs={0}>
        <Sidebar/>
      </Col>
      <Col style={{ margin: '0px 0px 0px 0px', padding: '0px', height: '100%' }} xl={10} lg={9} md={10} sm={12} xs={12}>
        <Row style={{ margin: '0px', padding: '0px' }}>
          <Col style={{ margin: '0px', padding: '0px' }} xl={12} lg={12} md={12} sm={12} xs={12}>
            <Navbar className="shadow"  bg="white" variant="light" style={{ margin: '0px', margin: '0px', }}>
              <Row style={{ margin: '0px', padding: '0px', width: '100%'}}>
                <Col xs={{span:12}} sm={{offset:2, span:10}} md={{offset:3, span:9}} lg={{offset:6, span:6}} xl={{offset:8, span:4}}>
                    <Form style={{ width: '100%', position: 'relative' }}>
                      <FormControl
                        id="search"
                        className="custom_bg_gray"
                        type="search"
                        name="search"
                        autoComplete="off"
                        value={searchValue}
                        onClick={(e) => handleSearchClick(e.target.value)}
                        onChange={(e) => handlePanel('search', e.target.value)}
                        placeholder="Search"
                        aria-label="Search"
                        style={{ float: 'left'}}
                      />
                    {panel.search?<div ref={searchRef} className="friends_search_panel">
                      {users && users.length > 0?users.map((item, idx) => {
                        return (<Row key={idx} style={{ margin:'5px 0px 5px 0px', padding:'0px', color: item.do_not_disturb?'red': 'black' }}>
                          <Col style={{ margin:'0px', padding:'5px 20px'}} xs={3} sm={3} md={3} lg={3} xl={3}>
                            <img src={item.profile_picture?item.profile_picture:defaultProfilePictureImageDataUri} className={item.do_not_disturb?"image_circle_bordered":"image_circle"} alt="ProfilePicture"/>
                          </Col>
                          <Col xs={5} sm={5} md={5} lg={5} xl={5}>
                            <p style={{ fontSize: '0.9rem', marginTop: '10px', textAlign:'center' }}>{item.username?item.username:'-'}</p>
                          </Col>
                          <Col xs={4} sm={4} md={4} lg={4} xl={4}>
                            <p style={{ fontSize: '0.9rem', marginTop: '10px', textAlign:'left' }}>{item.phone_number}</p>
                          </Col>
                        </Row>)
                      })
                      :<Row style={{ margin:'0px', padding:'0px'}}>
                        <Col style={{ margin:'0px', padding:'10px 20px'}} xs={12} sm={12} md={12} lg={12} xl={12}>
                          <p style={{ fontSize: '1rem', margin: '0px'}}>No users found.</p>
                        </Col>
                      </Row>}
                    </div>:''}
                </Form>
                </Col>
              </Row>
              <Nav className="ml-auto">
                  <Nav.Link>
                      <FontAwesomeIcon id="search_logo" style={{ fontSize: '20px', margin: '5px 0px 0px 10px', position: 'relative' }} icon={faSearch} alt="Search" />
                  </Nav.Link>
                  <Nav.Link>
                      <FontAwesomeIcon id="share" style={{ fontSize: '20px', margin: '5px 0px 0px 10px' }} icon={faShareAlt} alt="Share" />
                  </Nav.Link>
                  <Nav.Link>
                    <div style={{ borderRadius: '100%', padding: '5x', position: 'relative' }}>
                      <FontAwesomeIcon id="notification" onClick={() => handlePanel('notifications', '')} style={{ fontSize: '22px', margin: '5px 15px 0px 10px' }} icon={faBell} alt="Notification" />
                      {panel.notifications?<div ref={notificationRef} className="notifications_panel">
                        {notifications && notifications.length > 0?notifications.map((item, idx) => {
                          return (<Row key={idx} style={{ margin:'5px 0px 0px 0px', padding:'0px'}}>
                            <Col style={{ margin:'0px', padding:'0px 0px'}} xs={12} sm={12} md={12} lg={12} xl={12}>
                              <p style={{ margin: idx===notifications.length-1?'0px 5px':'5px', fontSize: '0.9rem', marginTop: '5px', textAlign:'left', borderBottom: idx===notifications.length-1?'none':'1px solid #E7E7E7', padding: '0px 20px' }}>Notification {idx}</p>
                            </Col>
                          </Row>)
                        })
                      :<Row style={{ margin:'0px', padding:'0px'}}>
                        <Col style={{ margin:'0px', padding:'10px'}} xs={12} sm={12} md={12} lg={12} xl={12}>
                          <p style={{ fontSize: '1rem', margin: '0px' }}>No new notifications !</p>
                        </Col>
                      </Row>}
                      </div>:''}
                    </div>
                  </Nav.Link>
                  <Nav.Link>
                      <div style={{ margin: '2px 10px 0px 0px', padding: '0px' }} className="row">
                          <div style={{ margin: '0px', padding: '0px', position: 'relative'}}>
                              <img id="profile"  onClick={() => handlePanel('profile', '')} src={curr_user_data && curr_user_data.profile_picture?curr_user_data.profile_picture:defaultProfilePictureImageDataUri} className="image_circle" alt="ProfilePicture" />
                              {panel.profile?<div ref={profileRef} className="profile_panel">
                              <Row className="profile_row" onClick={() => redirectPage('/profile_settings')} style={{ margin:'5px 0px 5px 0px', padding:'0px'}}>
                                <Col style={{ margin:'0px', padding:'0px 0px'}} xs={12} sm={12} md={12} lg={12} xl={12}>
                                  <p id="signed_in_as_settings" style={{ margin: '3px 5px', fontSize: '0.9rem', marginTop: '5px', textAlign:'left', padding: '0px 20px' }}>
                                    username: <span style={{ fontWeight: 'normal', color: '#017EFA' }}>{curr_user_data.username}</span>
                                  </p>
                                </Col>
                              </Row>
                              <Row className="profile_row" onClick={() => redirectPage('/profile_settings')} style={{ margin:'5px 0px 5px 0px', padding:'0px'}}>
                                <Col style={{ margin:'0px', padding:'0px 0px'}} xs={12} sm={12} md={12} lg={12} xl={12}>
                                  <p id="profile_settings" style={{ margin: '3px 5px', fontSize: '0.9rem', marginTop: '5px', textAlign:'left', padding: '0px 20px' }}>
                                    Profile
                                  </p>
                                </Col>
                              </Row>
                              <Row className="change_password_row" onClick={() => redirectPage('/change_password')} style={{ margin:'5px 0px 5px 0px', padding:'0px'}}>
                                <Col style={{ margin:'0px', padding:'0px 0px'}} xs={12} sm={12} md={12} lg={12} xl={12}>
                                  <p id="change_password_settings" style={{ margin: '3px 5px', fontSize: '0.9rem', marginTop: '5px', textAlign:'left', padding: '0px 20px' }}>
                                    Change Password
                                  </p>
                                </Col>
                              </Row>
                              <Row className="logout_row" onClick={() => logout()} style={{ margin:'5px 0px 5px 0px', padding:'0px'}}>
                                <Col style={{ margin:'0px', padding:'0px 0px'}} xs={12} sm={12} md={12} lg={12} xl={12}>
                                  <p id="logout_settings" onClick={() => logout()} style={{ margin: '5px', fontSize: '0.9rem', marginTop: '5px', textAlign:'left', padding: '0px 20px' }}>
                                    Logout
                                  </p>
                                </Col>
                              </Row>
                            </div>:''}
                          </div>
                      </div>
                  </Nav.Link>
              </Nav>
          </Navbar>
          </Col>
        </Row>
        {props.children}
      </Col>
    </Row>

  );
}

export default withRouter(GridLayout);
