import { Button, Col, Container, Row, Table } from "react-bootstrap"
import React from "react"
import Header from "../common/Header"
import "./style.css"
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

const PressRelease = () => {
    const navigate = useNavigate()

    return (
        <>
            <Header />
            <Container fluid>
                <Row className="AddActionSpace">
                    <Col xl={12}>
                        <Button variant="success" onClick={() => navigate('/upload-post')}>Add new PressRelease</Button>
                    </Col>
                </Row>
                <Row className="TableSpace">

                    <Col xl={6}>
                        <Table striped bordered hover variant="dark">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Title</th>
                                    <th>Category</th>
                                    <th>Author</th>
                                    <th>Published Date</th>
                                    <th colSpan={2}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>Mark</td>
                                    <td>Otto</td>
                                    <td>Author</td>
                                    <td>1-1-2022</td>
                                    <td><Button variant="info" style={{ width: "100%" }}>Edit</Button></td>
                                    <td><Button variant="danger" style={{ width: "100%" }}>Delete</Button></td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
export default PressRelease