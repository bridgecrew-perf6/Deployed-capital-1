import Layout from '../layouts/Layout'
import Dashboard from '../pages/Dashboard';
import ChangePassword from '../pages/ChangePassword';
import Friends from '../pages/Friends';
import IndexPage from '../pages/IndexPage';
import Profile from '../pages/Profile';
import SignUp from '../pages/SignUp';
import RobotWriteUp from '../pages/RobotWriteUp';
import GridLayout from '../layouts/GridLayout'
import PrivacyPolicy from '../pages/PrivacyPolicy';
import Subscription from '../pages/Subscription';
import Library from '../pages/Library';
import DoNotDisturb from '../pages/DoNotDisturb';

const routes = [
  {
    path: "/",
    component: IndexPage,
    exact: true,
    is_auth:false,
    name: "index"
  },
  {
    path: "/signin",
    component: IndexPage,
    exact: true,
    is_auth:false,
    name: "signin"
  },

  {
    path: "/forgot_password",
    component: IndexPage,
    exact: true,
    is_auth:false,
    name: "forgot_password",
  },
  {
    path: "/signup",
    component: SignUp,
    exact: true,
    is_auth:false,
    name: "signup",
    layout: Layout,
    footer: false
  },{
    path: "/subscription",
    component: Subscription,
    layout: Layout,
    exact: true,
    is_auth:false,
    name: "subscription",
  },
  {
    path: "/dashboard",
    component: Dashboard,
    exact: true,
    is_auth:true,
    layout: GridLayout,
    name: "dashboard"
  },
  {
    path: "/profile_settings",
    component: Profile,
    layout: GridLayout,
    exact: true,
    is_auth:true,
    name: "profile"
  },
  {
    path: "/friends",
    component: Friends,
    layout: GridLayout,
    exact: true,
    is_auth:true,
    name: "friends"
  },
  {
    path: "/robot_writeup",
    component: RobotWriteUp,
    layout: GridLayout,
    exact: true,
    is_auth:false,
    name: "robot_writeup",
  },
  {
    path: "/change_password",
    component: ChangePassword,
    layout: GridLayout,
    exact: true,
    is_auth:true,
    name: "change_password",
  },
  {
    path: "/library",
    component: Library,
    layout: GridLayout,
    exact: true,
    is_auth:true,
    name: "library",
  },
  {
    path: "/do_not_disturb",
    component: DoNotDisturb,
    layout: GridLayout,
    exact: true,
    is_auth:true,
    name: "do_not_disturb",
  }
  // {
  //   path: "/privacy_policy",
  //   component: PrivacyPolicy,
  //   layout: Layout,
  //   exact: true,
  //   is_auth:false,
  //   name: "privacy_policy",
  // }
];

export default routes;
