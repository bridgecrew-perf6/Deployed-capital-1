import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import '../index.css'
import { Row, Col, Button, Form } from "react-bootstrap";
import CSRFToken from "./Csrf";
import axiosInstance from "./AxiosInstance";
import { useDispatch, useSelector } from "react-redux";

const Survey = (props) => {

    const [surveyAnswer, setSurveyAnswer] = useState({
        'survey_answer_1': '',
        'survey_answer_2': '',
        'survey_answer_3': '',
        'survey_answer_4': ''
    });

    const [surveySuccessMsg, setSuccessSurveyMsg] = useState('');

    const [isFormSubmitError, setIsFormSubmitError] = useState(false);

    const curr_user_data = useSelector((state) => state.session.userData);

    const handleChange = (e) => {
        e.preventDefault();
        let {name, value} = e.target;
        validate(name, value);
    }

    const validate = (name, value) => {
        switch (name) {
            case "survey_answer_1":
                setSurveyAnswer({ ...surveyAnswer, survey_answer_1: value });
                break
            case "survey_answer_2":
                setSurveyAnswer({ ...surveyAnswer, survey_answer_2: value });
                break;
            case "survey_answer_3":
                setSurveyAnswer({ ...surveyAnswer, survey_answer_3: value });
                break;
            case "survey_answer_4":
                setSurveyAnswer({ ...surveyAnswer, survey_answer_4: value });
                break;
            default:
                break;
            }
      };

    const handleSubmit = (e) => {

        e.preventDefault();
        let post_data = {};
        post_data['survey_response'] = {...surveyAnswer}
        post_data['user'] = curr_user_data.id;
        axiosInstance
          .post("users/manage_survey/", post_data)
          .then((response) => {
            if (response.data.ok) {
                setSuccessSurveyMsg('Thank you for submitting your response.');
                setTimeout(() => {
                    setSuccessSurveyMsg('');
                }, 5000);
                setIsFormSubmitError(false);
                setSurveyAnswer({
                    'survey_answer_1': '',
                    'survey_answer_2': '',
                    'survey_answer_3': '',
                    'survey_answer_4': ''
                });
            } else {
                setSuccessSurveyMsg('Some error occured.');
                setTimeout(() => {
                    setSuccessSurveyMsg('');
                }, 5000);
                setIsFormSubmitError(true);
                console.log("Error");
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }; 

    return (
        <div className="dashboard_card">
            <Form style={{ padding: '20px' }} onSubmit={(e) => handleSubmit(e)}>
                <CSRFToken />
                <Row style={{ margin: '0px', padding: '0px' }}>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Form.Group id="survey_answer_1">
                        <Form.Label style={{ fontWeight: 'bold', fontSize: '0.9rem' }} className="float-left">How much money do you have?</Form.Label>
                        <Form.Control
                            className="survey_answer_1"
                            name="survey_answer_1"
                            type="text"
                            placeholder="Write your answer"
                            value={surveyAnswer.survey_answer_1}
                            autoComplete="off"
                            onChange={(e) => handleChange(e)}
                        ></Form.Control>
                        </Form.Group>
                    </Col>
                </Row>
                <Row style={{ margin: '0px', padding: '0px' }}>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Form.Group id="survey_answer_2">
                        <Form.Label style={{ fontWeight: 'bold', fontSize: '0.9rem' }} className="float-left">What return did you make in the market last year?</Form.Label>
                        <Form.Control
                            className="survey_answer_2"
                            name="survey_answer_2"
                            type="text"
                            placeholder="Write your answer"
                            value={surveyAnswer.survey_answer_2}
                            autoComplete="off"
                            onChange={(e) => handleChange(e)}
                        ></Form.Control>
                        </Form.Group>
                    </Col>
                </Row>
                <Row style={{ margin: '0px', padding: '0px' }}>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Form.Group id="survey_answer_3">
                        <Form.Label style={{ fontWeight: 'bold', fontSize: '0.9rem' }} className="float-left">What do you think is a good return/what return would you like us to get you?</Form.Label>
                        <Form.Control
                            className="survey_answer_3"
                            name="survey_answer_3"
                            type="text"
                            placeholder="Write your answer"
                            value={surveyAnswer.survey_answer_3}
                            autoComplete="off"
                            onChange={(e) => handleChange(e)}
                        ></Form.Control>
                        </Form.Group>
                    </Col>
                </Row>
                <Row style={{ margin: '0px', padding: '0px' }}>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Form.Group id="survey_answer_4">
                        <Form.Label style={{ fontWeight: 'bold', fontSize: '0.9rem' }} className="float-left">What percent ​return would you lend us money on?</Form.Label>
                        <Form.Control
                            className="survey_answer_4"
                            name="survey_answer_4"
                            type="text"
                            placeholder="Write your answer"
                            value={surveyAnswer.survey_answer_4}
                            autoComplete="off"
                            onChange={(e) => handleChange(e)}
                        ></Form.Control>
                        </Form.Group>
                    </Col>
                </Row>
                <Row style={{ margin: '10px 0px 0px 0px',  padding: "0px"  }}>
                    <Col style={{ margin: '0px', padding: '0px' }}>
                        <Button
                            size="lg"
                            style={{backgroundColor: '#017EFA', color: 'white', outline: 'none', border: '1px solid #017EFA', padding: '5px 20px' }}
                            type="submit"
                        >
                        <span style={{ fontSize: '16px' }}>Submit</span>
                        </Button>
                    </Col>
                </Row>
                {!surveySuccessMsg ? (
                    ""
                  ) : (
                    <Row style={{ margin: "20px 0px 10px 0px", padding: "0px" }}>
                      <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                        <div
                          style={{ textAlign: 'center' }}
                          className={isFormSubmitError?"form_error_message":"form_success_message"}
                        >
                          {surveySuccessMsg}
                        </div>
                      </Col>
                    </Row>
                  )}
            </Form>
        </div>
    );
    }

export default withRouter(Survey);
