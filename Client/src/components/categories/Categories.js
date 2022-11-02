import { Button, Col, Container, Row, Table, Modal, InputGroup, Form } from "react-bootstrap"
import React, { useEffect, useState } from "react"
import Header from "../common/Header"
import "./style.css"
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios"
import toast, { Toaster } from "react-hot-toast";

const ModelUplaod = ({ show, handleClose, handleSave, catname, changeCatname }) => {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header>
                <Modal.Title>Add new category..</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <InputGroup className="mb-3">
                    <Form.Control
                        value={catname}
                        onChange={changeCatname}
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
const ModelUpdate = ({ show, handleClose, handleUpdate, catname, changeCatname, currentTitle }) => {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header>
                <Modal.Title>Update category {currentTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <b>Update Category title</b>
                <InputGroup className="mb-3 mt-2">
                    <Form.Control
                        value={catname}
                        onChange={changeCatname}
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
                <Button variant="primary" onClick={handleUpdate}>
                    Update
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
export default function Categories() {

    useEffect(() => {
        fetchCategory()
    }, [])

    const [show, setShow] = useState(false);
    const [smShow, setSmShow] = useState(false);
    const [showUpd, setShowUpd] = useState(false);

    const [catname, setCatname] = useState("")
    const [currentCatId, setCurrentCatId] = useState("")
    const [currentCatname, setCurrentCatname] = useState("")
    const [newcatname, setNewCatname] = useState("")


    const [categoryData, setCategoryData] = useState([])

    const handleClose = () => setShow(false);
    const handleCloseUpd = () => setShowUpd(false);

    const handleShow = () => setShow(true);
    const handleShowUpd = () => setShowUpd(true);

    const handleSave = () => {
        axios.post('http://192.168.1.28:8000/upload-category', {
            title: catname
        }).then((r) => {
            if (r.data.success) {
                toast.success(r.data.msg)
                handleClose()
                fetchCategory()
                setCatname("")
            } else {
                toast.error(r.data.msg)
            }
        }).catch((e) => toast.error(e.response.data.msg))
    }

    const fetchCategory = () => {
        axios.get('http://192.168.1.28:8000/categories').then((r) => {
            if (r.data.success) {
                setCategoryData(r.data.data)
            }
        }).catch((e) => toast.error(e.response.data.msg))
    }

    const deleteCategory = (catid) => {
        axios.post('http://192.168.1.28:8000/delete-category', { catid: catid }).then((r) => {
            if (r.data.success) {
                toast.success(r.data.msg)
                setSmShow(false)
                setCurrentCatId("")
                setCurrentCatname("")
                fetchCategory()
            }
        }).catch((e) => toast.error(e.response.data.msg))
    }

    const handleUpdate = () => {
        axios.post('http://192.168.1.28:8000/update-category', { catid: currentCatId, newtitle: newcatname }).then((r) => {
            if (r.data.success) {
                toast.success(r.data.msg)
                fetchCategory()
                setCurrentCatId("")
                setCurrentCatname("")
                handleCloseUpd()
            }
        }).catch((e) => toast.error(e.response.data.msg))
    }

    return (
        <>
            <Toaster
                position="top-right"
                reverseOrder={false}
            />
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
                                    <th>sr.no</th>
                                    <th>Category</th>
                                    <th>Edit</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    categoryData.map((v, i) =>
                                        <tr key={i}>
                                            <td>{i + 1}</td>
                                            <td>{v.title}</td>
                                            <td><Button variant="info" style={{ width: "100%" }} onClick={() => {
                                                handleShowUpd()
                                                setCurrentCatId(v._id)
                                                setCurrentCatname(v.title)
                                                setNewCatname(v.title)
                                            }}>Edit</Button></td>
                                            <td><Button variant="danger" style={{ width: "100%" }} onClick={() => {
                                                setSmShow(true)
                                                setCurrentCatname(v.title)
                                                setCurrentCatId(v._id)
                                            }}>Delete</Button></td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
            <Modal
                size="md"
                show={smShow}
                onHide={() => setSmShow(false)}
                aria-labelledby="example-modal-sizes-title-sm"
            >
                <Modal.Header>
                    <Modal.Title id="example-modal-sizes-title-sm">
                        Delete Category
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h6>Are you sure to delete <b>{currentCatname}</b> category ?</h6>

                    <Row>
                        <Col xl={12}>
                            <Button variant="info" className="mr-3" onClick={() => {
                                setSmShow(false)
                                setCurrentCatId("")
                                setCurrentCatname("")
                            }}>No</Button>
                            <Button variant="danger" onClick={() => deleteCategory(currentCatId)}>Yes</Button>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>

            <ModelUpdate
                catname={newcatname}
                changeCatname={(e) => setNewCatname(e.target.value)}
                show={showUpd}
                currentTitle={currentCatname}
                handleClose={handleCloseUpd}
                handleUpdate={handleUpdate}
            />
            <ModelUplaod
                catname={catname}
                changeCatname={(e) => setCatname(e.target.value)}
                show={show}
                handleClose={handleClose}
                handleSave={handleSave}
            />
        </>
    )
}