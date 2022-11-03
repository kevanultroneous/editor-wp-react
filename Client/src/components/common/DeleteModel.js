import React from "react";
import { Button, Col, Modal, Row } from "react-bootstrap";

export default function DeleteModel({ show, onHide, handleNo, handleYes, title, mentionText }) {
    return (
        <Modal
            size="md"
            show={show}
            onHide={onHide}
            aria-labelledby="example-modal-sizes-title-sm"
        >
            <Modal.Header>
                <Modal.Title id="example-modal-sizes-title-sm">
                    {title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h6>{mentionText}</h6>
                <Row>
                    <Col xl={12}>
                        <Button variant="info" onClick={handleNo}>No</Button>
                        <Button variant="danger" className="ms-3" onClick={handleYes}>Yes</Button>
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    )
}