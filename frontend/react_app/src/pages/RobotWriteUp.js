import React from "react";
import { withRouter, useHistory } from "react-router-dom";
import '../index.css'
import { Row, Col, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import formula from "../static/images/formula.svg"
import robot_writeup_img from "../static/images/robot_write_up.svg"

const RobotWriteUp = (props) => {
  
  const history = useHistory();
  const curr_user_data = useSelector((state) => state.session.userData);

  return (
    <Row style={{ padding: '20px 20px 0px 20px', margin: '0px'}}>
      <Col xl={{ offset: 1, span: 5 }} lg={{ offset: 1, span: 5 }} md={{ offset: 1, span: 5 }} sm={12} xs={12}>
        <p style={{ fontWeight: 'bold', margin: '20px 0px 5px 0px', fontSize: '1rem', textAlign: 'left' }}>Robot write up</p>
        <Row style={{ margin: '0px', padding: '0px' }}>
            <Col style={{ margin: '0px', padding: '0px' }} xs={12} sm={12} md={12} lg={12} xl={12}>
                <p style={{ fontWeight: 'bold', margin: '10px 0px 10px 0px', fontSize: '0.9rem', textAlign: 'left' }}>
                    Overview:
                </p>
            </Col>
            <Col style={{ margin: '0px', padding: '0px' }} xs={12} sm={12} md={12} lg={12} xl={12}>
                <p style={{ margin: '0px 0px 0px 0px', fontSize: '0.8rem', textAlign: 'left', lineHeight:'25px' }}>
                My economics class left me with one take away. Investors are risk averse (meaning investors do not like risk). Today I bring to you a low risk opportunity to make larger than average gains in the forex markets. 
                </p>
            </Col>
        </Row>
        <Row style={{ margin: '0px', padding: '0px' }}>
            <Col style={{ margin: '0px', padding: '0px' }} xs={12} sm={12} md={12} lg={12} xl={12}>
                <p style={{ fontWeight: 'bold', margin: '10px 0px 0px 0px', fontSize: '0.9rem', textAlign: 'left' }}>
                Key words:
                </p>
            </Col>
            <Col style={{ margin: '0px', padding: '0px' }} xs={12} sm={12} md={12} lg={12} xl={12}>
                <p style={{ margin: '10px 0px 0px 0px', fontSize: '0.8rem', textAlign: 'left', lineHeight:'25px' }}>
                Drawdown: A drawdown is the negative half of the standard deviation in relation to a stock’s price. A drawdown from a share price’s high to its low is considered its drawdown amount. If a stock drops from $100 to $50 and then rallies back to $100.01 or above, then the drawdown was $50 or 50% from the peak.Return on investment (ROI) or return on costs (ROC): a ratio between net income (over a period) and investment (costs resulting from an investment of some resources at a point in time). A high ROI means the investment's gains compare favourably to its cost. As a performance measure, ROI is used to evaluate the efficiency of an investment or to compare the efficiencies of several different investments
                </p>
            </Col>
        </Row>
        <Row style={{ margin: '0px', padding: '0px' }}>
            <Col style={{ margin: '0px', padding: '0px' }} xs={12} sm={12} md={12} lg={12} xl={12}>
                <img src={formula} className="formula_img"></img>
            </Col>
        </Row>
        <Row style={{ margin: '0px', padding: '0px' }}>
            <Col style={{ margin: '0px', padding: '0px' }} xs={12} sm={12} md={12} lg={12} xl={12}>
                <p style={{ fontWeight: 'bold', margin: '0px 0px 0px 0px', fontSize: '0.9rem', textAlign: 'left' }}>
                Risk to reward:
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

export default withRouter(RobotWriteUp);
