import { Button, Form, InputGroup, Modal } from "react-bootstrap"
import React from "react"
const ModelUpdate = ({ show, handleClose, handleUpdate, catname, changeCatname, currentTitle, switches, changeswitch, selectedSubcategories }) => {
    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header>
                <Modal.Title>Update category {currentTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <b>Update Category</b>
                <InputGroup className="mb-3 mt-2">
                    <Form.Control
                        value={catname}
                        onChange={changeCatname}
                        placeholder="Category name"
                        aria-label="Category name"
                        aria-describedby="basic-addon2"
                    />
                </InputGroup>
                <div className="d-flex">
                    <label>Blog</label>
                    <Form.Check
                        className="ms-2"
                        checked={switches}
                        onChange={changeswitch}
                        type="switch"
                        id="custom-switch"
                        label={"Press"}
                    />
                </div>

                <div className="mt-4">
                    {selectedSubcategories}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleUpdate}>
                    Update
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
export default ModelUpdate