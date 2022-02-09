import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import decode from "jwt-decode";
import {
  clear_session,
  sign_in,
  user_data,
  all_users
} from "../redux";
import axiosInstance from "../components/AxiosInstance";
import { USERS_API_URL } from "../constants"

class AuthRoute extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuth: false,
      curr_user_data: {},
    };
  }

  async componentDidMount() {
    let { history, auth, location, session, layout } = this.props;
    let isLoggedIn = this.props.session.isLoggedIn;
    // if (
    //   !location.pathname.includes('home') && !location.pathname.includes('admin')) {
    //   this.setState({ isAuth: true });
    // } else {
      if (auth) {
        const token = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        if (!token || !refreshToken) {
          history.push("/");
        }
        try {
          const { exp } = decode(refreshToken);
          const curr_time = new Date().getTime() / 1000;
          let token_response = exp >= curr_time;
          if (isLoggedIn) {
            if (!(isLoggedIn && token_response)) {
              history.push("/");
            } else {
              this.setState({ isAuth: true, curr_user_data: this.props.session.userData });
            }
          } else {
            const resp = await axiosInstance.get(USERS_API_URL+"is_authenticated/");
            const user = await resp.data.user;
            const res_all_users = await resp.data.all_users;
            const ok = await resp.data.ok;
            this.setState({ curr_user_data: user });
            if (ok) {
              this.props.dispatch(sign_in());
              this.props.dispatch(user_data(user));
              this.props.dispatch(all_users(res_all_users))
              this.setState({ isAuth: true });
            } else {
              history.push("/");
              this.props.dispatch(clear_session())
            }
          }
        } catch (error) {
          console.log(error)
          console.log("TOKEN AUTH Error");
          history.push("/");
        }
      } else {
        this.setState({ isAuth: true });
      }
    // }
  }

  render() {
    return (
      <div style={{ padding: "0px", margin: "0px" }}>
        {this.state.isAuth?(this.props.layout ? React.createElement(this.props.layout, {'footer': this.props.footer}, React.createElement(this.props.component)) : React.createElement(this.props.component)):""}
      </div> )
    }
}

const mapStateToProps = state => ({
    session: state.session
});


export default withRouter(connect(mapStateToProps)(AuthRoute));
