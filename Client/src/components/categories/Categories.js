import { Button, Col, Container, Row, Table, Modal, InputGroup, Form } from "react-bootstrap"
import React, { useEffect, useState } from "react"
import Header from "../common/Header"
import "./style.css"
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios"
import toast, { Toaster } from "react-hot-toast";
import { IoCloseCircle } from "react-icons/io5"
import { MdOutlineUpdate } from "react-icons/md"

export const ModelUplaod = ({ show, handleClose, handleSave, catname, subcatname, changeCatname, changesubcatname, keyuphandler, selectedSubcategories }) => {

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
                <InputGroup className="mb-3">
                    <Form.Control
                        value={subcatname}
                        onChange={changesubcatname}
                        onKeyUp={keyuphandler}
                        placeholder="write Subcategory and press the enter"
                        aria-label="Category name"
                        aria-describedby="basic-addon2"
                    />
                </InputGroup>
                <div className="mt-4">
                    {selectedSubcategories}
                </div>
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
const ModelUpdate = ({ show, handleClose, handleUpdate, catname, changeCatname, currentTitle, subcatname, changesubcatname, keyuphandler, selectedSubcategories }) => {
    return (
        <Modal show={show} onHide={handleClose}>
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
                <InputGroup className="mb-3">
                    <Form.Control
                        value={subcatname}
                        onChange={changesubcatname}
                        onKeyUp={keyuphandler}
                        placeholder="write Subcategory and press the enter"
                        aria-label="Category name"
                        aria-describedby="basic-addon2"
                    />
                </InputGroup>
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

export default function Categories() {

    useEffect(() => {
        fetchCategory()
    }, [])

    const [show, setShow] = useState(false);
    const [smShow, setSmShow] = useState(false);
    const [showUpd, setShowUpd] = useState(false);

    const [catname, setCatname] = useState("")
    const [subcatname, setSubCatname] = useState("")
    const [subCategories, setSubCategories] = useState([])

    const [currentCatId, setCurrentCatId] = useState("")
    const [currentCatname, setCurrentCatname] = useState("")
    const [newcatname, setNewCatname] = useState("")
    const [newsubcats, setNewSubCats] = useState([])

    const [mainCheck, setMainCheck] = useState(false)
    const [multiUpdate, setMultiUpdate] = useState([])


    const [categoryData, setCategoryData] = useState([])

    const handleClose = () => setShow(false);
    const handleCloseUpd = () => setShowUpd(false);

    const handleShow = () => setShow(true);
    const handleShowUpd = () => setShowUpd(true);

    const handleSave = () => {
        axios.post('http://192.168.1.28:8000/upload-category', {
            title: catname,
            subcategory: subCategories
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
        axios.post('http://192.168.1.28:8000/update-category', { catid: currentCatId, newtitle: newcatname, subcategory: newsubcats }).then((r) => {
            if (r.data.success) {
                toast.success(r.data.msg)
                fetchCategory()
                setCurrentCatId("")
                setCurrentCatname("")
                handleCloseUpd()
            }
        }).catch((e) => toast.error(e.response.data.msg))
    }

    // future use
    // const multiUnchecked = (v) => {
    //     setMultiUpdate(multiUpdate.filter(k => k._id !== v))
    //     setMultiUpdate(multiUpdate.concat({ _id: v, checked: false }))
    // }
    // const handleMultiUpdate = () => {
    //     axios.post('http://192.168.1.28:8000/update-category', { multiid: multiUpdate }).then((r) => {
    //         if (r.data.success) {
    //             toast.success(r.data.msg)
    //             setMultiUpdate([])
    //             fetchCategory()
    //         }
    //     }).catch((e) => toast.error(e.response.data.msg))
    // }

    const removeSelectedSubCategory = (id, upd) => {
        if (upd) {
            setNewSubCats(newsubcats.filter(v => v.id !== id))
        } else {
            setSubCategories(subCategories.filter(v => v.id !== id))
        }
    }

    useEffect(() => {
        if (mainCheck) {
            categoryData.map((v) =>
                setMultiUpdate(multiUpdate.concat({ _id: v._id, checked: true }))
            )
        } else {
            setMultiUpdate([])
        }
    }, [mainCheck])

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
                {/* future use */}
                {/* <Row className="AddActionSpace">
                    {multiUpdate.length > 0 &&
                        <Col xl={12}>
                            <Button variant="warning" onClick={handleMultiUpdate}>Update Selection{" "}
                                <MdOutlineUpdate />
                            </Button>
                        </Col>
                    }
                </Row> */}
                <Row className="TableSpace">
                    <Col xl={6}>
                        <Table striped bordered hover variant="dark">
                            <thead>
                                <tr>
                                    {/* future use selected  */}
                                    {/* <th className="text-center">
                                        <Form.Check
                                            onChange={(e) =>
                                                setMainCheck(e.target.checked)
                                            }
                                            value={mainCheck}
                                            type="switch"
                                            id="disabled-custom-switch"
                                        />
                                    </th> */}
                                    <th className="text-center">Sr.no</th>
                                    <th>Category</th>
                                    <th className="text-center">Sub Category</th>
                                    <th>Edit</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    categoryData != null &&
                                    categoryData.map((v, i) =>
                                        <tr key={i}>
                                            {/* future use */}
                                            {/* <td className="text-center">
                                                <Form.Check
                                                    onChange={(e) =>
                                                        e.target.checked ?
                                                            setMultiUpdate(multiUpdate.concat({ _id: v._id, checked: true }))
                                                            : multiUnchecked(v._id)
                                                    }
                                                    defaultChecked={v.selected ? v.selected : false}
                                                    type="switch"
                                                    id="disabled-custom-switch"
                                                />
                                            </td> */}
                                            <td className="text-center">{i + 1}</td>
                                            <td>{v.title}</td>
                                            <td className="text-center">{v.subcategory.length > 0 ? "Yes" : "No"}</td>
                                            <td><Button variant="info" style={{ width: "100%" }} onClick={() => {
                                                handleShowUpd()
                                                setCurrentCatId(v._id)
                                                setCurrentCatname(v.title)
                                                setNewCatname(v.title)
                                                setNewSubCats(v.subcategory)
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
                    <h6>Are you sure to delete <b>{currentCatname}</b> category ?
                    </h6>
                    <small><b>{currentCatname}</b> category related all sub category will be also deleting !</small>
                    <Row className="mt-3">
                        <Col xl={12}>
                            <Button variant="info" className="me-3" onClick={() => {
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
                subcatname={subcatname}
                changesubcatname={(e) => setSubCatname(e.target.value)}
                keyuphandler={(e) => {
                    const num = Math.floor(Math.random() * 9000 + 1000)
                    const num2 = Math.floor(Math.random() * 900 + 100 * 50 + 20.10)
                    if (e.keyCode === 13) {
                        setNewSubCats(newsubcats.concat({ id: num + num2, name: subcatname }))
                        setSubCatname("")
                    }
                }}
                selectedSubcategories={
                    <>
                        {newsubcats.length > 0 &&
                            <>
                                <div className="d-block mb-4">
                                    <label className="clearBtn" onClick={() => setNewSubCats([])}><b>Clear All</b></label>
                                </div>
                                <div className="SubCategoryWrraper">
                                    {
                                        newsubcats.map((v, i) =>
                                            <div className="SubCatTag" onClick={() => removeSelectedSubCategory(v.id, true)}>{v.name}&nbsp;
                                                <IoCloseCircle />
                                            </div>
                                        )
                                    }
                                </div>
                            </>
                        }
                    </>
                }
            />
            <ModelUplaod
                catname={catname}
                changeCatname={(e) => setCatname(e.target.value)}
                show={show}
                handleClose={handleClose}
                handleSave={handleSave}
                subcatname={subcatname}
                changesubcatname={(e) => setSubCatname(e.target.value)}
                keyuphandler={(e) => {
                    const num = Math.floor(Math.random() * 9000 + 1000)
                    const num2 = Math.floor(Math.random() * 900 + 100 * 50 + 20.10)
                    if (e.keyCode === 13) {
                        setSubCategories(subCategories.concat({ id: num + num2, name: subcatname }))
                        setSubCatname("")
                    }
                }}
                selectedSubcategories={
                    <>
                        {subCategories.length > 0 &&
                            <>
                                <div className="d-block mb-4">
                                    <label className="clearBtn" onClick={() => setSubCategories([])}><b>Clear All</b></label>
                                </div>
                                <div className="SubCategoryWrraper">
                                    {
                                        subCategories.map((v, i) =>
                                            <div className="SubCatTag" onClick={() => removeSelectedSubCategory(v.id)}>{v.name}&nbsp;
                                                <IoCloseCircle />
                                            </div>
                                        )
                                    }
                                </div>
                            </>
                        }
                    </>
                }
            />
        </>
    )
}