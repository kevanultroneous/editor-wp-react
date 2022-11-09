import { Button, Form, InputGroup, Modal } from "react-bootstrap"
import React from "react"

const ModelUpload = ({ handleglobalkeydown, keydown, handleparentcategory, data, switchessubcategory, chnageswitchsubcategory, show, handleClose, handleSave, catname, changeCatname, selectedSubcategories, switches, chnageswitch }) => {
    return (
        <Modal show={show} onHide={handleClose} >
            <Modal.Header>
                <Modal.Title>Add new category..</Modal.Title>
            </Modal.Header>
            <Modal.Body onKeyDown={handleglobalkeydown}>
                {
                    switchessubcategory &&
                    <p className="m-0">Select Category</p>
                }
                {
                    switchessubcategory ?
                        <select className="mb-3 mt-3" onChange={handleparentcategory}>
                            {
                                data?.map((v, i) =>
                                    <option value={v._id} key={i}>{v.title}</option>
                                )
                            }
                        </select> : null
                }
                {
                    !switchessubcategory &&
                    <InputGroup className="mb-3">
                        <Form.Control
                            value={catname}
                            onChange={changeCatname}
                            placeholder={"Category name"}
                            aria-label="Category name"
                            aria-describedby="basic-addon2"
                        />
                    </InputGroup>
                }
                {
                    switchessubcategory &&
                    <InputGroup className="mb-3">
                        <Form.Control
                            value={catname}
                            onKeyDown={keydown}
                            onChange={changeCatname}
                            placeholder="Write subcategory name and press the enter"
                            aria-label="Write subcategory name and press the enter"
                            aria-describedby="basic-addon2"
                        />
                    </InputGroup>
                }
                <Form.Check
                    checked={switches}
                    onChange={chnageswitch}
                    type="switch"
                    id="custom-switch"
                    label="Press"
                />
                {
                    data?.length > 0 &&
                    <Form.Check
                        checked={switchessubcategory}
                        onChange={chnageswitchsubcategory}
                        type="switch"
                        id="custom-switch"
                        label="Subcategory"
                    />
                }

                <div className="mt-4">
                    {selectedSubcategories}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal >
    )
}
export default ModelUpload