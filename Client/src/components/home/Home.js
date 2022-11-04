import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import Header from "../common/Header";
import { useNavigate } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";
import "./style.css"

function Home() {
    const navigate = useNavigate()
    return (
        <>
            <Header />
            <Container>
                <div className="p-3 mt-5">
                    <Row>
                        <Col xl={12} className="mb-3">
                            <h3>Visit Now</h3>
                        </Col>
                        <Col xl={3}>
                            <div className="LinkedCard" onClick={() => navigate('/press-release')}>
                                Press Release
                            </div>
                        </Col>
                        <Col xl={3}>
                            <div className="LinkedCard" onClick={() => navigate('/guest-post')}>
                                Guest Post
                            </div>
                        </Col>
                    </Row>
                </div>
            </Container>
        </>
    )
}

export default Home