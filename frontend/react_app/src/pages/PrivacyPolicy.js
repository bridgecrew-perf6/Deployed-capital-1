import React from "react";
import { withRouter, useHistory } from "react-router-dom";
import '../index.css'
import { Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import formula from "../static/images/formula.svg"
import robot_writeup_img from "../static/images/robot_write_up.svg"

const PrivacyPolicy = (props) => {
  
  const history = useHistory();
  const curr_user_data = useSelector((state) => state.session.userData);

  return (
    <Row style={{ padding: '0px 0px 0px 0px', margin: '0px', height: 'calc(100vh - 66px)' }}>
      <Col xl={12} lg={12} md={12} sm={12} xs={12}>
        <p style={{ fontWeight: 'bold', margin: '20px 0px 5px 0px', fontSize: '1rem', textAlign: 'center' }}>Privacy Policy</p>
        <Row style={{ margin: '0px', padding: '0px' }}>
            
            <Col style={{ margin: '0px', padding: '0px' }} xs={12} sm={12} md={12} lg={12} xl={12}>
                <p style={{ margin: '0px 0px 0px 0px', fontSize: '0.8rem', textAlign: 'left', lineHeight:'25px' }}>
                Effective date: April 04, 2021 <br/>
                Company Name ("us", "we", or "our") operates the https://deployed-capital.com website (the "Service"). <br/>
                This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data. Our Privacy Policy for Deployed Capital is based on the Free Privacy Policy Template Website.
                We use your data to provide and improve the Service. By using the Service, you agree to the collection and use of information in accordance with this policy. Unless otherwise defined in this Privacy Policy, terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, accessible from https://deployed-capital.com
                </p>
            </Col>
        </Row>
        <Row style={{ margin: '0px', padding: '0px' }}>
            <Col style={{ margin: '0px', padding: '0px' }} xs={12} sm={12} md={12} lg={12} xl={12}>
                <p style={{ fontWeight: 'bold', margin: '10px 0px 0px 0px', fontSize: '0.9rem', textAlign: 'left' }}>
                Information Collection And Use
                </p>
            </Col>
            <Col style={{ margin: '0px', padding: '0px' }} xs={12} sm={12} md={12} lg={12} xl={12}>
                <p style={{ margin: '10px 0px 0px 0px', fontSize: '0.8rem', textAlign: 'left', lineHeight:'25px' }}>
                We collect several different types of information for various purposes to provide and improve our Service to you.
                </p>
            </Col>
        </Row>
        <Row style={{ margin: '0px', padding: '0px' }}>
            <Col style={{ margin: '0px', padding: '0px' }} xs={12} sm={12} md={12} lg={12} xl={12}>
                <p style={{ fontWeight: 'bold', margin: '0px 0px 0px 0px', fontSize: '0.9rem', textAlign: 'left' }}>
                Types of Data Collected
                </p>
                <p style={{ fontWeight: 'bold', margin: '10px 0px 0px 0px', fontSize: '0.9rem', textAlign: 'left' }}>
                Personal Data
                </p>
            </Col>
            <Col style={{ margin: '0px', padding: '0px' }} xs={12} sm={12} md={12} lg={12} xl={12}>
                <p style={{ margin: '10px 0px 0px 0px', fontSize: '0.8rem', textAlign: 'left', lineHeight:'25px' }}>
                The risk/reward ratio marks the prospective reward an investor can earn for every dollar they risk on an investment, Divide your net profit (the reward) by the price of your maximum risk
                </p>
            </Col>
        </Row>
        <Row style={{ margin: '0px', padding: '0px' }}>
            <Col style={{ margin: '0px', padding: '0px' }} xs={12} sm={12} md={12} lg={12} xl={12}>
                <p style={{ fontWeight: 'bold', margin: '20px 0px 0px 0px', fontSize: '0.9rem', textAlign: 'left' }}>
                Types of investments:
                </p>
                <p style={{ fontWeight: 'bold', margin: '10px 0px 0px 0px', fontSize: '0.9rem', textAlign: 'left' }}>
                Realestate:
                </p>
            </Col>
            <Col style={{ margin: '0px', padding: '0px' }} xs={12} sm={12} md={12} lg={12} xl={12}>
                <p style={{ margin: '10px 0px 20px 0px', fontSize: '0.8rem', textAlign: 'left', lineHeight:'25px' }}>
                Average of  Residential rental properties, for instance, have an average return of 10.6%. Commercial real estate, on the other hand, has an average return on investment of 9.5%.
                <br/>
                Drawdown: unknown
                <br/>
                Risk to Rewards: -352% (or 3.5:1)
                </p>
            </Col>
        </Row>
      </Col> 
      <Col style={{ padding: '0px', margin: '0px' }} xl={6} lg={6} md={6} sm={12} xs={12}>
        <Row style={{ margin: '0px', padding: '0px' }}>
            <Col style={{ margin: '0px', padding: '0px' }} xs={12} sm={12} md={12} lg={12} xl={12}>
                <img src={robot_writeup_img} className="robot_writeup_img"></img>
            </Col>
        </Row>
        <Row style={{ margin: '0px', padding: '0px 50px' }}>
            <Col style={{ margin: '0px', padding: '0px' }} xs={12} sm={12} md={12} lg={12} xl={12}>
                <p style={{ fontWeight: 'bold', margin: '0px 0px 0px 0px', fontSize: '0.9rem', textAlign: 'left' }}>
                Stock:
                </p>
            </Col>
            <Col style={{ margin: '0px', padding: '0px' }} xs={12} sm={12} md={12} lg={12} xl={12}>
                <p style={{ margin: '10px 0px 10px 0px', fontSize: '0.8rem', textAlign: 'left', lineHeight:'25px' }}>
                S&P 500 (america top 500 company portfolio) average of 10% return per year <br/>
                Average drawdown: 16.3% <br/>
                <span style={{ color:'#017EFA' }}> S&P 500 Drawdowns By Year | Bespoke Investment Group (bespokepremium.com)</span><br/>
                Risk to reward: - 163% (1.63:1) (risk $1.63 to earn $1)
                </p>
            </Col>
        </Row>
        <Row style={{ margin: '0px', padding: '0px 50px' }}>
            <Col style={{ margin: '0px', padding: '0px' }} xs={12} sm={12} md={12} lg={12} xl={12}>
                <p style={{ fontWeight: 'bold', margin: '0px 0px 0px 0px', fontSize: '0.9rem', textAlign: 'left' }}>
                Bonds:
                </p>
            </Col>
            <Col style={{ margin: '0px', padding: '0px' }} xs={12} sm={12} md={12} lg={12} xl={12}>
                <p style={{ margin: '10px 0px 0px 0px', fontSize: '0.8rem', textAlign: 'left', lineHeight:'25px' }}>
                10 year government bond: 1.58% for Oct 2021<br/>
                Drawdown: -133%<br/>
                United States credit rating is AA+ (outstanding) which dropped from a AAA (excellent). Debt it currently 28 trillion with an income of 21 trillion (GDP)<br/>
                <span style={{ color:'#017EFA' }}> S&P 500 Drawdowns By Year | Bespoke Investment Group (bespokepremium.com)</span><br/>
                Risk to reward: 4:3 (for every $4 risked we earn $3)
                </p>
            </Col>
        </Row>
      </Col>
    </Row>
  );
}

export default withRouter(PrivacyPolicy);
