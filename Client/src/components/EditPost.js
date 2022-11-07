import React, { useEffect, useState } from "react";
import Header from "./common/Header";
import { Container, Row, Col, Form, InputGroup, FloatingLabel, Button, Spinner, Badge } from "react-bootstrap"
import "./postUploading.css"
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import CKEditor from '@ckeditor/ckeditor5-react'
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Markup } from "interweave";
import { useNavigate, useParams } from "react-router-dom";
import { ModelUplaod } from "./categories/Categories";
import { IoMdCloseCircleOutline } from "react-icons/io"
import { AiFillCaretRight } from "react-icons/ai"
import { defaultUrl } from "../utils/default";

export default function EditPost() {

    const { postid, gpostid } = useParams()
    const [postData, setPostData] = useState([])

    useEffect(() => {
        fetchParamPost()
    }, [])

    const fetchParamPost = () => {
        axios.get(`${defaultUrl}api/post/get-post/${postid}`)
            .then((r) => {
                if (r.data.success) {
                    setPostData(r.data.data)
                    setAuthor(r.data?.data?.author)
                    setPublish(r.data?.data?.status)
                    setSeoTitle(r.data?.data?.stitle)
                    setSeoDescription(r.data?.data?.sdesc)
                    setContent(r.data?.data?.content)
                    setUrl(r.data?.data?.url)
                    setPublish(r.data?.data?.status)
                }
            }).catch((e) => toast.error(e.response.data.msg))
    }
    // 

    const [categoryData, setCategoryData] = useState([])
    const [mainTitle, setMainTitle] = useState("")
    const [author, setAuthor] = useState("")
    const [category, setCategory] = useState([])
    const [seotitle, setSeoTitle] = useState("")
    const [seodescription, setSeoDescription] = useState("")
    const [seometatags, setSeoMetaTags] = useState("")
    const [url, setUrl] = useState("")
    const [publish, setPublish] = useState()
    const [content, setContent] = useState('')

    //search category
    const [searchCateg, setSearchCateg] = useState([])
    const [searchText, setSerachText] = useState("")
    const [suggestion, setSuggestion] = useState(false)
    const [loader, setLoader] = useState(false)
    const [subhover, setSubHover] = useState(false)

    // category upload
    const [show, setShow] = useState(false);
    const [catname, setCatname] = useState("")
    const handleClose = () => setShow(false);
    const handleSave = (catname = catname) => {
        axios.post(`${defaultUrl}api/category/upload-category`, {
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

    const navigate = useNavigate()
    // status 0 draft
    // status 1 publish
    // parent 0 press release
    // parent 1 guest post

    useEffect(() => {
        fetchCategory()
        searchCategories(searchText)
    }, [])


    const dataready = {
        title: mainTitle,
        category: category,
        author: author,
        content: content,
        smeta: seometatags,
        stitle: seotitle,
        sdesc: seodescription,
        url: url,
        status: publish,
        parent: 1,
    }

    const postUpload = () => {
        axios.post(`${defaultUrl}api/post/upload-post`, dataready)
            .then((r) => {
                if (r.data.success) {
                    toast.success(r.data.msg)
                    navigate('/home')
                } else {
                    toast.error(r.data.msg)
                }
            })
            .catch((e) => toast.error(e.response.data.msg))
    }

    const fetchCategory = () => {
        axios.get(`${defaultUrl}api/category/categories`).then((r) => {
            if (r.data.success) {
                setCategoryData(r.data.data)
            }
        }).catch((e) => toast.error(e.response.data.msg))
    }

    const searchCategories = (search) => {
        setLoader(true)
        setTimeout(() => {
            axios.post(`${defaultUrl}api/category/search-category`, { search }).then((r) => {
                setLoader(false)
                setSearchCateg(r.data?.data)
                setSuggestion(r.data?.suggestion)
            }).catch((e) => {
                setLoader(false)
                toast.error(e.response.data.msg)
            })
        }, 1000)
    }

    const handleCategorySelection = (value) => {
        if (category.includes(value)) {
            setCategory(category.filter(i => i !== value))
        } else {
            setCategory(category.concat(value))
        }
    }

    const ckeditorstate = (event, editor) => {
        const data = editor.getData();
        setContent(data)
    }


    return (
        <div>
            <Toaster
                position="top-right"
                reverseOrder={false}
            />
            <ModelUplaod
                catname={catname}
                changeCatname={(e) => setCatname(e.target.value)}
                show={show}
                handleClose={handleClose}
                handleSave={handleSave}
            />
            <Header />
            <Container fluid>
                <Row className="MainSectionRow">
                    <Col xl={4} className="p-0">
                        <div className="Sidebar">
                            <div>
                                <h3>Add New Post</h3>
                            </div>
                            <div className="mt-4">
                                <Form.Label><strong>Title</strong></Form.Label>
                                <Form.Control
                                    value={postData.title}
                                    onChange={(e) => setMainTitle(e.target.value)}
                                    type="text"
                                    placeholder="Enter title here"
                                />
                            </div>
                            <div className="mt-4">
                                <Form.Label><strong>Author</strong></Form.Label>
                                <Form.Control
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
                                    type="text"
                                    placeholder="Enter Author Name"
                                />
                            </div>
                            <div className="mt-4">
                                <Form.Label><strong>Featured Image</strong></Form.Label>
                                <Form.Control type="file" />
                            </div>
                            <div className="mt-4">
                                <Form.Label><strong>Categories</strong></Form.Label>
                                {/* future use */}
                                <div>
                                    <Button
                                        onClick={() => setShow(true)}
                                        variant="secondary"
                                        size="sm"
                                        className="mb-3">
                                        Add new Category
                                    </Button>
                                </div>
                                {/* <div> */}
                                {/* <select multiple onClick={(e) => handleCategorySelection(e.target.value)} style={{ width: "100%" }}> */}
                                <div className="TagsWrraper">
                                    {
                                        categoryData.map((v, i) =>
                                            <div
                                                onClick={() => handleCategorySelection(v._id)}
                                                className={`TagsCategory ${category.includes(v._id) ? 'SelectedCategory' : ''}`} >{v.title}
                                                &nbsp;&nbsp;<IoMdCloseCircleOutline />
                                            </div>
                                        )
                                    }
                                </div>
                                {/* </select> */}
                                {/* </div> */}

                                {/* <div className="SearchWrraper">
                                    <Form.Control
                                        value={searchText}
                                        onChange={(e) => {
                                            searchCategories(e.target.value)
                                            setSerachText(e.target.value)
                                        }}
                                        type="text"
                                        placeholder="Search category...."
                                    />
                                    {
                                        loader ?
                                            <div className="mt-3 text-center">
                                                <Spinner animation="border" variant="success" />
                                            </div>
                                            :
                                            <>

                                                <div className="ListOfCategories">
                                                    {
                                                        searchCateg?.map((v, i) =>
                                                            <div className="SearchList" onMouseOver={() => setSubHover(true)}
                                                                onMouseLeave={() => setSubHover(false)}>
                                                                <label className="SearchText" >{v.title}</label>
                                                                {v.subcategory.length > 0 ?
                                                                    <>
                                                                        <div style={{ float: "right" }} className="me-3">
                                                                            <AiFillCaretRight />
                                                                            {
                                                                                subhover &&
                                                                                <div className="Subcategory">
                                                                                    {
                                                                                        v.subcategory.map((v, i) =>
                                                                                            <div className="SearchList">
                                                                                                <label className="SearchText">
                                                                                                    {v.name}
                                                                                                </label>
                                                                                            </div>
                                                                                        )
                                                                                    }
                                                                                </div>
                                                                            }
                                                                        </div>
                                                                    </>
                                                                    : ""}
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                                {
                                                    suggestion &&
                                                    <div className="SuggestText">
                                                        <b>Suggest for add category "{searchText}"&nbsp;&nbsp;
                                                            <Badge bg="success" className="BadgeClk" onClick={() => {
                                                                handleSave(searchText)
                                                                searchCategories(searchText)
                                                            }}>Add Now</Badge>
                                                        </b>
                                                    </div>
                                                }
                                            </>
                                    }
                                </div> */}
                            </div>
                            <div className="mt-4">
                                <Form.Label><strong>SEO Title</strong></Form.Label>
                                <Form.Control
                                    value={postData.stitle}
                                    onChange={(e) => setSeoTitle(e.target.value)}
                                    type="text"
                                    placeholder="Enter Page title here"
                                />
                            </div>

                            <div className="mt-4">
                                <Form.Label><strong>SEO Description</strong></Form.Label>
                                <FloatingLabel controlId="floatingTextarea2" label="SEO Description">
                                    <Form.Control
                                        value={postData.sdesc}
                                        onChange={(e) => setSeoDescription(e.target.value)}
                                        as="textarea"
                                        placeholder="SEO Description"
                                        style={{ height: '100px' }}
                                    />
                                </FloatingLabel>
                            </div>

                            <div className="mt-4">
                                <Form.Label><strong>URL</strong></Form.Label>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="basic-addon3">
                                        https://unmediabuzz.com/
                                    </InputGroup.Text>
                                    <Form.Control id="basic-url" aria-describedby="basic-addon3" value={postData.url} onChange={(e) => setUrl(e.target.value)} />
                                </InputGroup>
                            </div>
                            <div className="mt-4">
                                <Form.Label><strong>Publish / Draft</strong></Form.Label>
                                <Form.Check
                                    onChange={(e) => setPublish(e.target.checked ? 1 : 0)}
                                    defaultChecked={publish}
                                    type="switch"
                                    id="custom-switch"
                                    label="Publish"
                                />
                            </div>
                        </div>
                    </Col>
                    <Col xl={8}>
                        <div className="EditorWrraper">
                            <div>
                                <h3>Add Content
                                    <Button
                                        onClick={() => postUpload()}
                                        className="ms-4"
                                        variant={publish === 1 ? "success" : "secondary"}
                                    >
                                        Save as {publish === 1 ? "Publish" : "Draft"}
                                    </Button></h3>
                            </div>
                            <Row className="EditorSpace">
                                <Col xl={6} className="EditorSize">
                                    <Tabs
                                        id="controlled-tab-example"
                                        className="mb-3"
                                    >
                                        <Tab eventKey="Content" title="Content">
                                            <CKEditor
                                                editor={ClassicEditor}
                                                data={postData.content}
                                                onChange={ckeditorstate}
                                                config={
                                                    {
                                                        ckfinder: {
                                                            // The URL that the images are uploaded to.
                                                            uploadUrl: '/upload',
                                                            // Enable the XMLHttpRequest.withCredentials property.
                                                            withCredentials: true,
                                                            // Headers sent along with the XMLHttpRequest to the upload server.
                                                            headers: {
                                                                'X-CSRF-TOKEN': 'CSFR-Token',
                                                                Authorization: 'Bearer <JSON Web Token>'
                                                            }
                                                        }
                                                    }
                                                }
                                            />
                                        </Tab>
                                        <Tab eventKey="Html" title="Html">
                                            <textarea
                                                onChange={(e) => setContent(e.target.value)}
                                                value={content}
                                                style={{ height: "100vh", width: "100%", border: "none", outline: "none" }}
                                                placeholder="write your html......"
                                            >
                                            </textarea>
                                        </Tab>
                                        <Tab eventKey="Preview" title="Preview">
                                            <Markup content={content} />
                                        </Tab>
                                    </Tabs>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}