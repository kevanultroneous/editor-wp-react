import React, { useEffect, useState } from "react";
import Header from "./common/Header";
import { Container, Row, Col, Form, InputGroup, FloatingLabel, Button } from "react-bootstrap"
import "./postUploading.css"
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import CKEditor from '@ckeditor/ckeditor5-react'
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Markup } from "interweave";
import { useNavigate } from "react-router-dom";

export default function PostUploading() {

    const [categoryData, setCategoryData] = useState([])
    const [mainTitle, setMainTitle] = useState("")
    const [author, setAuthor] = useState("")
    const [category, setCategory] = useState([])
    const [seotitle, setSeoTitle] = useState("")
    const [seodescription, setSeoDescription] = useState("")
    const [seometatags, setSeoMetaTags] = useState("")
    const [url, setUrl] = useState("")
    const [publish, setPublish] = useState(0)
    const [content, setContent] = useState('')

    const navigate = useNavigate()
    // status 0 draft
    // status 1 publish
    // parent 0 press release
    // parent 1 guest post

    useEffect(() => {
        fetchCategory()
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
        axios.post('http://192.168.1.28:8000/upload-post', dataready)
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
        axios.get('http://192.168.1.28:8000/categories').then((r) => {
            if (r.data.success) {
                setCategoryData(r.data.data)
            }
        }).catch((e) => toast.error(e.response.data.msg))
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
            <Header />
            <Container fluid>
                <Row className="MainSectionRow">
                    <Col xl={3} className="p-0">
                        <div className="Sidebar">
                            <div>
                                <h3>Add New Post</h3>
                            </div>
                            <div className="mt-4">
                                <Form.Label><strong>Title</strong></Form.Label>
                                <Form.Control
                                    value={mainTitle}
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
                                <div>
                                    <select multiple onClick={(e) => handleCategorySelection(e.target.value)} style={{ width: "100%" }}>
                                        {
                                            categoryData.map((v, i) =>
                                                <option value={v._id} key={i}>{v.title}</option>
                                            )
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="mt-4">
                                <Form.Label><strong>SEO Title</strong></Form.Label>
                                <Form.Control
                                    value={seotitle}
                                    onChange={(e) => setSeoTitle(e.target.value)}
                                    type="text"
                                    placeholder="Enter Page title here"
                                />
                            </div>

                            <div className="mt-4">
                                <Form.Label><strong>SEO Description</strong></Form.Label>
                                <FloatingLabel controlId="floatingTextarea2" label="SEO Description">
                                    <Form.Control
                                        value={seodescription}
                                        onChange={(e) => setSeoDescription(e.target.value)}
                                        as="textarea"
                                        placeholder="SEO Description"
                                        style={{ height: '100px' }}
                                    />
                                </FloatingLabel>
                            </div>
                            <div className="mt-4">
                                <Form.Label><strong>SEO Meta tags</strong></Form.Label>
                                <FloatingLabel controlId="floatingTextarea2" label="Meta tags">
                                    <Form.Control
                                        value={seometatags}
                                        onChange={(e) => setSeoMetaTags(e.target.value)}
                                        as="textarea"
                                        placeholder="Meta tags"
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
                                    <Form.Control id="basic-url" aria-describedby="basic-addon3" value={url} onChange={(e) => setUrl(e.target.value)} />
                                </InputGroup>
                            </div>
                            <div className="mt-4">
                                <Form.Label><strong>Publish / Draft</strong></Form.Label>
                                <Form.Check
                                    onChange={(e) => setPublish(e.target.checked ? 1 : 0)}
                                    checked={publish}
                                    type="switch"
                                    id="custom-switch"
                                    label="Publish"
                                />
                            </div>
                        </div>
                    </Col>
                    <Col xl={9}>
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