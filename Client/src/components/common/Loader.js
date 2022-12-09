import { Modal, Spinner } from "react-bootstrap";
import React from "react";
export default function Loaders({ show, handleClose }) {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      //   backdrop="static"
      keyboard={false}
      centered
      size="sm"
    >
      <Modal.Body>
        <center>
          <Spinner animation="border" variant="success" />
        </center>
      </Modal.Body>
    </Modal>
  );
}
