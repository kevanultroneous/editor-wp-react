import React from "react";
import { Modal } from "react-bootstrap";

export default function MediaGallery({ show, handleClose, heading, body, footer }) {
    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>{heading}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{body}</Modal.Body>
            {
                footer &&
                <Modal.Footer>
                    {footer}
                </Modal.Footer>
            }
        </Modal>
    )
}