import { Button, Col, Container, Row, Table, Modal, InputGroup, Form } from "react-bootstrap"
import React, { useState } from "react"
import Header from "../common/Header"
import "./style.css"
import "react-datepicker/dist/react-datepicker.css";

const ModelUplaod = ({ show, handleClose, handleSave }) => {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header>
                <Modal.Title>Add new category..</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <InputGroup className="mb-3">
                    <Form.Control
                        placeholder="Category name"
                        aria-label="Category name"
                        aria-describedby="basic-addon2"
                    />
                </InputGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Upload
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
export default function Categories() {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);

    const handleShow = () => setShow(true);

    const handleSave = () => {
        alert('saved')
    }

    return (
        <>
            <Header />
            <Container fluid>
                <Row className="AddActionSpace">
                    <Col xl={12}>
                        <Button variant="success" onClick={handleShow}>Add Category</Button>
                    </Col>
                </Row>
                <Row className="TableSpace">
                    <Col xl={6}>
                        <Table striped bordered hover variant="dark">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Category</th>
                                    <th>Edit</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>Mark</td>
                                    <td><Button variant="info" style={{ width: "100%" }}>Edit</Button></td>
                                    <td><Button variant="danger" style={{ width: "100%" }}>Delete</Button></td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
            <ModelUplaod
                show={show}
                handleClose={handleClose}
                handleSave={handleSave}
            />
        </>
    )
}