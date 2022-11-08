import { Button, Col, Container, Row, Table, Modal, InputGroup, Form } from "react-bootstrap"
import React, { useEffect, useState } from "react"
import Header from "../common/Header"
import "./style.css"
import axios from "axios"
import toast, { Toaster } from "react-hot-toast";
import { IoCloseCircle } from "react-icons/io5"
import { MdOutlineUpdate } from "react-icons/md"
import { defaultUrl } from "../../utils/default";
import DeleteModel from "../common/DeleteModel"

export const ModelUplaod = ({ show, handleClose, handleSave, catname, changeCatname, selectedSubcategories, switches, chnageswitch }) => {

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

                <Form.Check
                    checked={switches}
                    onChange={chnageswitch}
                    type="switch"
                    id="custom-switch"
                    label="Press"
                />
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
const ModelUpdate = ({ show, handleClose, handleUpdate, catname, changeCatname, currentTitle, switches, changeswitch, selectedSubcategories }) => {
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

                <div>
                    <Form.Check
                        checked={switches}
                        onChange={changeswitch}
                        type="switch"
                        id="custom-switch"
                        label="Press"
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

export default function Categories() {

    useEffect(() => {
        fetchCategory()
    }, [])

    const [switches, setSwitches] = useState(false)
    const [currentCatid, setCurrentCatid] = useState("")
    const [show, setShow] = useState(false);
    const [smShow, setSmShow] = useState(false);
    const [showUpd, setShowUpd] = useState(false);
    const [subcategoriesData, setsubcategoriesData] = useState([])
    const [viewSubcats, setViewSubcats] = useState(false)

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

    const handleClose = () => {
        setSubCategories([])
        setShow(false);
    }
    const handleCloseUpd = () => setShowUpd(false);

    const handleShow = () => setShow(true);
    const handleShowUpd = () => setShowUpd(true);

    const handleSave = () => {
        axios.post(`${defaultUrl}api/category/upload-category`, {
            title: catname,
            type: switches ? "press" : "blog"
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

    const subcategoryHandler = () => {
        axios.post(`${defaultUrl}api/category/upload-subcategory`, {
            parentid: currentCatid,
            subcategory: newsubcats
        }).then((r) => {
            if (r.data.success) {
                toast.success(r.data.msg)
                setNewSubCats([])
                setCurrentCatid("")
                fetchCategory()
            } else {
                toast.error(r.data.msg)
            }
        }).catch((e) => toast.error(e.response.data.msg))
    }

    const fetchCategory = () => {
        axios.get(`${defaultUrl}api/category/categories`).then((r) => {
            if (r.data.success) {
                setCategoryData(r.data.data)
            }
        }).catch((e) => toast.error(e.response.data.msg))
    }

    const deleteCategory = (catid) => {
        axios.post(`${defaultUrl}api/category/delete-category`, { catid: catid }).then((r) => {
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
        axios.post(`${defaultUrl}api/category/update-category`, { catid: currentCatId, newtitle: newcatname, type: switches ? 'press' : 'blog' }).then((r) => {
            if (r.data.success) {
                toast.success(r.data.msg)
                fetchCategory()
                setCurrentCatId("")
                setCurrentCatname("")
                handleCloseUpd()
            }
        }).catch((e) => toast.error(e.response.data.msg))
    }




    const handleSubcategoryView = (id) => {
        setViewSubcats(true)
        axios.get(`${defaultUrl}api/category/sub-categories/${id}`)
            .then((r) => {
                if (r.data.success) {
                    setsubcategoriesData(r.data.data)
                } else {
                    toast.error(r.data.msg)
                }
            })
            .catch((e) => toast.error(e.response.data.msg))
    }


    const removeSelectedSubCategory = (id) => {
        setNewSubCats(newsubcats.filter(v => v !== id))
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
                <DeleteModel
                    hidebuttons
                    title={"Subcategory"}
                    show={viewSubcats}
                    onHide={() => setViewSubcats(false)}
                    child={
                        <div>
                            <div className="mb-3">
                                <strong>Add New categories</strong>
                            </div>
                            <div className="SubCategoryWrraper">
                                {
                                    subcategoriesData.subCategory?.map((v) =>
                                        <div className="SubCatTag">{v.subcategory}
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    }
                />
                <Row className="TableSpace">
                    <Col xl={6}>
                        <Table striped bordered hover variant="dark">
                            <thead>
                                <tr>
                                    <th className="text-center">Sr.no</th>
                                    <th>Category</th>
                                    <th>Subcategory</th>
                                    <th className="text-center">Type</th>
                                    <th>Edit</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    categoryData != null &&
                                    categoryData.map((v, i) =>
                                        <tr key={i}>
                                            <td className="text-center">{i + 1}</td>
                                            <td>{v.title}</td>
                                            <th>{v.subCategory.length > 0 ? <Button onClick={() => handleSubcategoryView(v._id)}>View / Update</Button> : "No available"}</th>
                                            <td className="text-center">{v.type}</td>
                                            <td><Button variant="info" style={{ width: "100%" }} onClick={() => {
                                                handleShowUpd()
                                                setCurrentCatId(v._id)
                                                setCurrentCatname(v.title)
                                                setNewCatname(v.title)
                                                setSwitches(v.type === 'press' ? true : false)
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
                    <Col xl={6}>
                        <h2>Add Subcategory</h2>
                        <div>
                            <Button onClick={subcategoryHandler}>Upload Subcategory</Button>
                        </div>
                        <select className="mt-3" onChange={(e) => setCurrentCatid(e.target.value)}>
                            {
                                categoryData != null &&
                                categoryData.map((v, i) =>
                                    <option value={v._id}>{v.title}</option>
                                )
                            }
                        </select>
                        <InputGroup className="mb-3 mt-2">
                            <Form.Control
                                size="sm"
                                value={subcatname}
                                placeholder="subcategory name"
                                aria-label="subcategory name"
                                aria-describedby="basic-addon2"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        setNewSubCats(newsubcats.concat(subcatname))
                                        setSubCatname("")
                                    }
                                }}
                                onChange={(e) => {
                                    setSubCatname(e.target.value)
                                }}
                            />
                        </InputGroup>
                        {newsubcats.length > 0 &&
                            <>
                                <div className="d-block mb-4">
                                    <label className="clearBtn" onClick={() => setNewSubCats([])}><b>Clear All</b></label>
                                </div>
                                <div className="SubCategoryWrraper">
                                    {
                                        newsubcats.map((v, i) =>
                                            <div className="SubCatTag" onClick={() => removeSelectedSubCategory(v)}>{v}&nbsp;
                                                <IoCloseCircle />
                                            </div>
                                        )
                                    }
                                </div>
                            </>
                        }
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
                switches={switches}
                changeswitch={(e) => setSwitches(!switches)}
            />
            <ModelUplaod
                catname={catname}
                changeCatname={(e) => setCatname(e.target.value)}
                show={show}
                handleClose={handleClose}
                handleSave={handleSave}
                switches={switches}
                chnageswitch={(e) => {
                    e.target.checked ?
                        setSwitches(true) : setSwitches(false)
                }}
            />
        </>
    )
}