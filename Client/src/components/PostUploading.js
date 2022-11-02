import React, { useEffect, useState } from "react";
import Header from "./common/Header";
import { Container, Row, Col, Form, InputGroup, FloatingLabel } from "react-bootstrap"

import "./postUploading.css"
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Contact from "./contactComponet/contact";
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

    useEffect(() => {
        fetchCategory()
    }, [])

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

    return (
        <>
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
                                                <option value={v._id} >{v.title}</option>
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
                                    onClick={(e) => setPublish(e.target.checked ? 1 : 0)}
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
                            <Contact />
                        </div>
                    </Col>
                </Row>
            </Container>
            {/* <h3>
                Add new PressRelease
                -Featured Image
                -Title
                -Content (Rich Text Editor)
                -SEO Meta Title & Description
                -URL (Slug)
                -Featured Image
                -Category (Can be more than 1)
                -Save Draft
                -Publish Post
                -Publish Date (we can change it)
                -Status (Public,Draft - We can change the status manually)
            </h3> */}
        </>
    )
}