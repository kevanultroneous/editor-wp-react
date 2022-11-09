import { Button, Col, Container, Row, Table, Modal, InputGroup, Form } from "react-bootstrap"
import React, { useEffect, useState } from "react"
import Header from "../common/Header"
import "./style.css"
import axios from "axios"
import toast, { Toaster } from "react-hot-toast";

import { defaultUrl } from "../../utils/default";
import DeleteModel from "../common/DeleteModel"
import ModelUpdate from "../common/UpdateModel"
import ModelUpload from "../common/UploadCategoryModel"


export default function Categories() {

    useEffect(() => {
        fetchCategory()
    }, [])

    const [switches, setSwitches] = useState(false)
    const [switches2, setSwitches2] = useState(false)
    const [show, setShow] = useState(false);
    const [smShow, setSmShow] = useState(false);
    const [showUpd, setShowUpd] = useState(false);
    const [subcategoriesData, setsubcategoriesData] = useState([])
    const [viewSubcats, setViewSubcats] = useState(false)

    const [catname, setCatname] = useState("")
    const [subCategories, setSubCategories] = useState([])

    const [selectedCategory, setSelectedCategory] = useState([])

    const [currentCatId, setCurrentCatId] = useState("")
    const [currentCatname, setCurrentCatname] = useState("")
    const [newcatname, setNewCatname] = useState("")

    const [categoryData, setCategoryData] = useState([])

    const handleClose = () => {
        setSubCategories([])
        setShow(false);
    }
    const handleCloseUpd = () => setShowUpd(false);

    const handleShow = () => setShow(true);
    const handleShowUpd = () => setShowUpd(true);

    const handleSave = () => {
        let parentid = currentCatId
        let newrequestdata = []
        if (switches2) {
            if (parentid === "" || parentid === null) {
                alert('select the category !')
            } else {
                if (subCategories.length > 0) {
                    subCategories.map((v) => {
                        newrequestdata.push({
                            title: v,
                            parentCategory: parentid,
                            subCategory: [],
                            type: switches == true ? "press" : "blog",
                        })
                    })
                    axios.post(`${defaultUrl}api/category/upload-category`, {
                        data: newrequestdata, parentid: parentid, upddata: subCategories, multiple: true
                    }).then((r) => {
                        if (r.data.success) {
                            toast.success(r.data.msg)
                            handleClose()
                            fetchCategory()
                            setCatname("")
                            setCurrentCatId("")
                        } else {
                            toast.error(r.data.msg)
                        }
                    }).catch((e) => toast.error(e.response.data.msg))
                } else {
                    alert('Please enter maximum 1 subcategory !')
                }
            }
        }
        else {
            if (catname.length <= 3) {
                alert('category name is required !')
            } else {
                axios.post(`${defaultUrl}api/category/upload-category`, {
                    title: catname,
                    type: switches ? "press" : "blog"
                }).then((r) => {
                    if (r.data.success) {
                        toast.success(r.data.msg)
                        handleClose()
                        fetchCategory()
                        setCatname("")
                        setSwitches(false)
                    } else {
                        toast.error(r.data.msg)
                    }
                }).catch((e) => toast.error(e.response.data.msg))
            }
        }
    }



    const fetchCategory = () => {
        axios.get(`${defaultUrl}api/category/all-category`).then((r) => {
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
                        <Button variant="success" onClick={handleShow}>Add Category  / Subcategory</Button>
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
                                    subcategoriesData?.subCategory?.map((v) =>
                                        <div className="SubCatTag">{v.subcategory}
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    }
                />

                {
                    !(categoryData.length === 0) ?
                        <Row className="TableSpace">
                            <Col xl={6}>

                                <Table striped bordered hover variant="dark">
                                    <thead>
                                        <tr>
                                            <th className="text-center">Sr.no</th>
                                            <th>Category</th>
                                            <th className="text-center">Global Type</th>
                                            <th colSpan={3} className="text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            categoryData != null &&
                                            categoryData?.map((v, i) =>
                                                <tr key={i}>
                                                    <td className="text-center">{i + 1}</td>
                                                    <td>{v.title}</td>
                                                    <td className="text-center">{v.type}</td>
                                                    <td><Button variant="info" style={{ width: "100%" }} onClick={() => {
                                                        handleShowUpd()
                                                        setCurrentCatId(v._id)
                                                        setCurrentCatname(v.title)
                                                        setNewCatname(v.title)
                                                        setSwitches(v.type === 'press' ? true : false)
                                                        setSelectedCategory(v.childs)
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
                        :
                        <h1 className="text-center">No categories</h1>
                }
            </Container>

            <DeleteModel
                show={smShow}
                onHide={() => setSmShow(false)}
                title={" Delete Category"}
                mentionText={`Are you sure to delete ${currentCatname} category ?`}
                handleYes={() => deleteCategory(currentCatId)}
                handleNo={() => {
                    setSmShow(false)
                    setCurrentCatId("")
                    setCurrentCatname("")
                }}
            />
            <ModelUpdate
                catname={newcatname}
                changeCatname={(e) => setNewCatname(e.target.value)}
                show={showUpd}
                currentTitle={currentCatname}
                handleClose={handleCloseUpd}
                handleUpdate={handleUpdate}
                switches={switches}
                changeswitch={(e) => setSwitches(!switches)}
                selectedSubcategories={
                    <div>
                        <Row className="TableSpace">
                            <Col xl={12}>
                                {
                                    selectedCategory?.length <= 0 || selectedCategory === null
                                        ?
                                        <h2>No subcategories</h2>
                                        :
                                        <>
                                            <h4>Subcategories</h4>
                                            <Table striped bordered hover variant="dark">
                                                <thead>
                                                    <tr>
                                                        <th className="text-center">Sr.no</th>
                                                        <th>Sub Category{selectedCategory.length === 0 ? "Blank" : "No"}</th>
                                                        <th className="text-center">Global Type</th>
                                                        <th colSpan={3} className="text-center">Action</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {
                                                        selectedCategory != null &&
                                                        selectedCategory?.map((v, i) =>
                                                            <tr key={i}>
                                                                <td className="text-center">{i + 1}</td>
                                                                <td>{v.title}</td>
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
                                        </>
                                }
                            </Col>

                        </Row>
                    </div>
                }
            />
            <ModelUpload
                handleparentcategory={(e) => {
                    setCurrentCatId(e.target.value)
                }}
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
                switchessubcategory={switches2}
                chnageswitchsubcategory={(e) => {
                    e.target.checked ?
                        setSwitches2(true) : setSwitches2(false)
                }}
                keydown={(e) => {
                    if (e.key === 'Enter') {
                        if (subCategories.includes(catname)) {
                            alert('category you have already added !')
                        } else {
                            if (catname === '' || catname.length <= 3) {
                                alert('enter valid category name ,category length required 4 letter !')
                            } else {
                                setSubCategories(subCategories.concat(catname))
                                setCatname('')
                            }
                        }
                    }
                }}

                selectedSubcategories={
                    subCategories.length > 0 &&
                    <div className="SubCategoryWrraper">
                        {
                            subCategories.map((v, i) =>
                                <div className="SubCatTag" onClick={() => setSubCategories(subCategories.filter(k => k !== v))}>{v}</div>
                            )
                        }
                    </div>}
                data={categoryData}
            />
        </>
    )
}