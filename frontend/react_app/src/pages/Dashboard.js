import React, { useState, useEffect } from "react";
import { withRouter, useHistory } from "react-router-dom";
import { Row, Col, Form, FormControl, Button } from "react-bootstrap";
import Sidebar from "../components/Sidebar";
import Navbar from 'react-bootstrap/Navbar'
import Nav from "react-bootstrap/Nav";
import { faSearch, faShareAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import { defaultProfilePictureImageDataUri } from "../constants";
import { useSelector, useDispatch } from "react-redux";
import DashboardCard from "../components/DashboardCard";
import axiosInstance from "../components/AxiosInstance";
import Survey from "../components/Survey"
import CommissionsCard from "../components/CommissionsCard";

const Dashboard = (props) => {

    const history = useHistory();

    const [panel, setPanel] = useState({'search': false, 'notifications': false, 'profile': false});

    const [searchValue, setSearchValue] = useState('');

    const monthsDict = {
      0: 'January', 1: 'February', 2: 'March', 3: 'April', 4: 'May', 5: 'June', 6: 'July', 7: 'August', 8: 'September', 9: 'October', 10: 'November', 11: 'December'
    }

    const [contacts, setContacts] = useState([{
      'name': 'Jonson Roy'
    },{
      'name': 'David'
    },{
      'name': 'Jackson Jack'
    },{
      'name': 'Toni Kross'
    }]);

    const [friends, setFriends] = useState([{
      'name': 'Jonson Roy'
    },{
      'name': 'David'
    },{
      'name': 'Jackson Jack'
    },{
      'name': 'Toni Kross'
    }]);

    const curr_user_data = useSelector((state) => state.session.userData);
    const [commissionData, setCommissionData] = useState({});
    const [commission, setCommissions] = useState({
      'total_community': 100000,
      'total_commissions': 5000,
      'withdraw_amount_waiting': 500
    })

    useEffect(() => {
      getCommissionChartData();
    }, [])

    const redirectPage = (page) => {
      history.push(page);
    }


    const getCommissionChartData = () => {
        let commissionOption = {
            color: '#017EFA',
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            xAxis: [
              {
                type: 'category',
                data: Object.values(monthsDict),
                axisTick: {
                  alignWithLabel: true
                },
                
              }
            ],
            yAxis: [
              {
                axisLabel:{
                  formatter: function (value, index) {
                    return '$' + value.toString();
                  }
                }
              },
            ],
            series: [
              {
                name: 'Commission',
                type: 'bar',
                barWidth: '60%',
                data: [200, 50, 200, 550, 390, 330, 220, 100, 150, 280, 190, 120]
              }
            ]
        };
        setCommissionData(commissionOption);
    }

  return (
      <div style={{ height: '100%' }}>
        <Row style={{ margin: '30px 0px 0px 0px', padding: '0px' }}>
          <Col xl={{ offset: 1, span: 11 }} lg={{ offset: 1, span: 11 }} md={{ offset: 1, span: 11 }} sm={12} xs={12}>
            <p style={{ fontWeight: 'bold', margin: '0px 0px 0px 0px', fontSize: '1.5rem', textAlign: 'left' }}>User Name : {curr_user_data.username}</p>
          </Col>
        </Row>
        <Row style={{ margin: '30px 0px 30px 0px', padding: '0px' }}>
          {/* <Col xl={{ offset: 1, span: 4 }} lg={{ offset: 1, span: 4 }} md={{ offset: 1, span: 4 }} sm={12} xs={12}>
            <p style={{ fontWeight: 'bold', margin: '0px 0px 10px 5px', fontSize: '1.5rem', textAlign: 'left' }}>Import Contacts</p>
            <DashboardCard userData={{'users': contacts, 'type': 'contacts'}}/>
            <p style={{ fontWeight: 'bold', margin: '30px 0px 10px 0px', fontSize: '1.5rem', textAlign: 'left' }}>Friends</p>
            <DashboardCard userData={{'users': friends, 'type': 'friends'}}/>
          </Col>
          <Col xl={12} lg={12} md={12} sm={12} xs={12}>
            <p style={{ fontWeight: 'bold', margin: '0px 0px 10px 0px', fontSize: '1.5rem', textAlign: 'left' }}>Survey</p>
            <Survey questions={surveyQuestions} />
          </Col> */}
          <Col xl={{ offset: 1, span: 11 }} lg={{ offset: 1, span: 11 }} md={{ offset: 1, span: 11 }} sm={{ offset: 1, span: 11 }} xs={{ offset: 1, span: 11 }}>
            <p style={{ fontWeight: 'bold', margin: '0px 0px 20px 0px', fontSize: '1.5rem', textAlign: 'left' }}>Survey</p>
            <Survey />
          </Col>
          <Col xl={{ offset: 1, span: 11 }} lg={{ offset: 1, span: 11 }} md={{ offset: 1, span: 11 }} sm={{ offset: 1, span: 11 }} xs={{ offset: 1, span: 11 }}>
            <p style={{ fontWeight: 'bold', margin: '0px 0px 20px 0px', fontSize: '1.5rem', textAlign: 'left', marginTop: '20px' }}>Commissions</p>
            <Row className="commission_card" style={{ padding:'0px', margin: '0px' }}>
              <Col xl={9} lg={9} md={12} sm={12} xs={12} className="commission_chart_container">
                <CommissionsCard commissionData={commissionData}/>
              </Col>
              <Col xl={3} lg={3} md={12} sm={12} xs={12}>
                <Row className="commission_numbers_container">
                  <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                    <p style={{ color: '#9E9D9D', fontSize: '0.8rem', textAlign: 'center', margin: '0px 0px 0px 0px' }}>Total Community Dollars</p>
                    <p style={{ fontWeight: 'bold', margin: '0px 0px 20px 0px', fontSize: '1.2rem', textAlign: 'center', margin: '0px' }}>$ {commission.total_community.toLocaleString()}</p>
                  </Col>
                </Row>
                <Row style={{padding:'0px', margin: '0px'}}>
                  <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                    <p style={{ color: '#9E9D9D', fontSize: '0.8rem', textAlign: 'center', margin: '20px 0px 0px 0px' }}>Total Commissions</p>
                    <p style={{ fontWeight: 'bold', margin: '0px 0px 20px 0px', fontSize: '1.2rem', textAlign: 'center', margin: '0px' }}>$ {commission.total_commissions.toLocaleString()}</p>
                  </Col>
                </Row>
                <Row style={{padding:'0px', margin: '0px'}}>
                  <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                    <p style={{ color: '#9E9D9D', fontSize: '0.8rem', textAlign: 'center', margin: '20px 0px 0px 0px' }}>Withdraw amount waiting</p>
                    <p style={{ fontWeight: 'bold', margin: '0px 0px 20px 0px', fontSize: '1.2rem', textAlign: 'center', margin: '0px' }}>$ {commission.withdraw_amount_waiting.toLocaleString()}</p>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
  );
}

export default withRouter(Dashboard);
