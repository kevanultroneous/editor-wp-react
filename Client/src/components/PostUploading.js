import React, { useEffect, useMemo, useRef, useState } from "react";
import Header from "./common/Header";
import { Container, Row, Col, Form, InputGroup, FloatingLabel, Button, Spinner, Badge, Image, Dropdown, SplitButton } from "react-bootstrap"
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
import { IoMdAddCircle, IoMdCloseCircleOutline } from "react-icons/io"
import { AiFillCaretRight } from "react-icons/ai"
import { defaultUrl } from "../utils/default";
import { FcAddImage, FcGallery } from "react-icons/fc"
import MediaGallery from "../components/common/MediaGallery"



export default function PostUploading() {

    const { type } = useParams()

    //gallery 
    const [galleryShow, setGalleryShow] = useState(false)
    const [selectedImage, setSelectedImage] = useState([])
    const [galleryDatas, setGalleryDatas] = useState([])
    const [selectedGalleryImageData, setSelectedGalleryImageData] = useState([])
    const [files, setFiles] = useState([])
    const [ffile, setFFile] = useState(null)

    const [categoryData, setCategoryData] = useState([])
    const [mainTitle, setMainTitle] = useState("")
    const [author, setAuthor] = useState("")
    const [category, setCategory] = useState([])
    const [subcategory, setSubcategory] = useState([])
    const [seotitle, setSeoTitle] = useState("")
    const [seodescription, setSeoDescription] = useState("")
    const [seometatags, setSeoMetaTags] = useState("")
    const [url, setUrl] = useState(mainTitle)
    const [publish, setPublish] = useState(0)
    const [content, setContent] = useState('')
    const [htmlEditor, setHtmlEditor] = useState('')

    useEffect(() => {
        setHtmlEditor(content)
    }, [content])

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
        if (!(type === 'press-release' || type === "guest-post")) {
            navigate('/')
        }
        searchCategories(searchText)
        galleryImages()
    }, [])
    const formdata = new FormData()
    formdata.append("image", ffile)
    formdata.append("title", mainTitle)
    formdata.append("category", category)
    formdata.append("author", author)
    formdata.append("content", content)
    formdata.append("smeta", seometatags)
    formdata.append("stitle", seotitle)
    formdata.append("sdesc", seodescription)
    formdata.append("url", url)
    formdata.append("status", publish)
    formdata.append("parent", type === 'press-release' ? 0 : 1)

    const postUpload = () => {
        if (ffile == null) {
            alert('Featured image is required !')
        } else if (mainTitle == "") {
            alert('Title is required !')
        } else if (category.length <= 0) {
            alert('Please select one or more category !')
        } else {
            axios.post(`${defaultUrl}api/post/upload-post`, formdata)
                .then((r) => {
                    if (r.data.success) {
                        toast.success(r.data.msg)
                        navigate(type === 'press-release' ? '/press-release' : '/guest-post')
                    } else {
                        toast.error(r.data.msg)
                    }
                })
                .catch((e) => toast.error(e.response.data.msg))
            setFFile(null)

        }
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



    const ckeditorstate = (event, editor) => {
        const data = editor.getData();
        setContent(data)
    }
    const editUrl = (v) => {
        setUrl(v.split(' ').join('-'))
    }

    const galleryImageUpload = () => {
        const formdata = new FormData()
        for (let zf = 0; zf < files.length; zf++) {
            formdata.append('image', files[zf])
        }
        axios.post(`${defaultUrl}api/post/gallery-img-upload`, formdata).then((r) => {
            if (r.data.success) {
                toast.success(r.data.msg)
                galleryImages()
                setGalleryShow(false)
            } else {
                toast.error(r.data.msg)
            }
        }).catch((e) => {
            toast.error(e.response.data.msg)
        })
    }

    const galleryImages = () => {
        axios.get(`${defaultUrl}api/post/gallery`).then((r) => {
            if (r.data?.success) {
                setGalleryDatas(r.data?.data)
            } else {
                toast.error(r.data?.msg)
            }
        }).catch((e) => {
            toast.error(e.response?.data?.msg)
        })
    }

    const handleSelectionImage = (v) => {
        if (selectedGalleryImageData.includes(v)) {
            setSelectedGalleryImageData(selectedGalleryImageData.filter(k => k !== v))
        } else {
            setSelectedGalleryImageData(selectedGalleryImageData.concat(v))
        }
    }

    const fileSelectedHandler = (e) => setFiles(e.target.files[0])


    const handleUFE = () => {
        let dataBuffer = ""
        for (let data = 0; data < selectedGalleryImageData.length; data++) {
            dataBuffer += `<figure class="image"><img src="${selectedGalleryImageData[data]}"></figure>`
        }
        setContent(content + dataBuffer)
        setSelectedGalleryImageData([])
    }



    const handleCategorySelection = (e, v, k1, parent, name, id) => {

        if (k1) {
            if (e.target.checked) {
                setSubcategory(subcategory.concat({ category: parent, name: name, id: id }))
            } else {
                setSubcategory(subcategory.filter(i => i.category !== parent && i.id !== id && i.name !== name))
            }
        } else {
            if (e.target.checked) {
                setCategory(category.concat(v._id))
            } else {
                setCategory(category.filter(k => k !== v._id))
            }
        }
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
            <MediaGallery
                heading={"Media Gallery"}
                show={galleryShow}
                body={
                    <Tabs
                        className="mb-3"
                    >
                        <Tab eventKey="g-upd" title="Upload Image">
                            <Row className="RowMg">
                                <div>
                                    <Form.Group controlId="formFileSm" className="mb-1">
                                        <input type="file"
                                            onChange={fileSelectedHandler}
                                        />
                                    </Form.Group>
                                </div>
                                <div>
                                    <Button onClick={galleryImageUpload}>Upload Now</Button>
                                </div>
                            </Row>
                        </Tab>
                        <Tab eventKey="g-all" title="Gallery">
                            <Row>
                                <Col xl={12}>
                                    {
                                        selectedGalleryImageData.length > 0 &&
                                        <Button variant="success" size="sm" className="mb-2" onClick={handleUFE}>
                                            Use for editor
                                        </Button>
                                    }
                                </Col>
                            </Row>
                            <Row className="RowMg">
                                {
                                    galleryDatas == null ? <h1>No Images</h1> :
                                        galleryDatas?.map((v, i) =>
                                            <Col xl={3}>
                                                <div className={`MediaGallery  ${selectedGalleryImageData.includes(`${defaultUrl}` + v.img.replace('public/', '')) ? 'SelectedImg' : ''}`}
                                                    onClick={() => handleSelectionImage(`${defaultUrl}` + v.img.replace('public/', ''))}>
                                                    <Image src={`${defaultUrl}` + v.img.replace('public/', '')} fluid />
                                                </div>
                                            </Col>
                                        )
                                }
                            </Row>
                        </Tab>
                    </Tabs>
                }
                handleClose={() => setGalleryShow(false)}
            />
            < Container fluid >
                <Row className="MainSectionRow">
                    <Col xl={4} className="p-0">
                        <div className="Sidebar">
                            <div>
                                <h3>Add New Post</h3>
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
                            <div className="mt-4">
                                <Form.Label><strong>Title</strong></Form.Label>
                                <Form.Control
                                    value={mainTitle}
                                    onChange={(e) => {
                                        setMainTitle(e.target.value)
                                        editUrl(e.target.value)
                                    }}
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
                                <Form.Control type="file" onChange={(e) => setFFile(e.target.files[0])} />
                            </div>
                            <div className="mt-4">
                                <Form.Label><strong>Categories</strong></Form.Label>

                                <div className="SearchWrraper">
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
                                                <div className="mt-3">
                                                    {
                                                        searchCateg?.map((k, i) =>
                                                            <div>
                                                                <input
                                                                    checked={category.includes(k._id)}
                                                                    type="checkbox"
                                                                    onChange={(e) => {
                                                                        handleCategorySelection(e, k)
                                                                    }}
                                                                /> {k.title}
                                                                <div>
                                                                    {
                                                                        category.includes(k._id) ?
                                                                            <div className="TagsWrraper">
                                                                                {
                                                                                    k?.subcategory.length > 0
                                                                                        ?
                                                                                        k?.subcategory.map((v, i) =>
                                                                                            <div className="ms-3" key={i}>
                                                                                                <input
                                                                                                    checked={subcategory.find(e => e.category === v._id)}
                                                                                                    type="checkbox"
                                                                                                    name={"subcategory"}
                                                                                                    onChange={(e) => handleCategorySelection(e, v, true, k._id, v.name, v.id)} />
                                                                                                {v.name}
                                                                                            </div>
                                                                                        )
                                                                                        : null
                                                                                }
                                                                            </div>
                                                                            : null
                                                                    }
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                                {
                                                    suggestion &&
                                                    <div className="SuggestText">
                                                        <b>Suggest for add category "{searchText}"&nbsp;&nbsp;
                                                            <Badge bg="success" className="BadgeClk" onClick={() => setShow(true)}>
                                                                <IoMdAddCircle size={20} />
                                                            </Badge>
                                                        </b>
                                                    </div>
                                                }
                                            </>
                                    }
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
                                <Form.Label><strong>URL</strong></Form.Label>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="basic-addon3">
                                        https://unmediabuzz.com/
                                    </InputGroup.Text>
                                    <Form.Control id="basic-url" aria-describedby="basic-addon3" value={url} onChange={(e) => setUrl(e.target.value)} />
                                </InputGroup>
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
                            <div>
                                <Button
                                    onClick={() => setGalleryShow(true)}
                                    variant="dark"
                                    className="text-white mt-5 mb-5"><FcGallery /> Media Gallery</Button>
                            </div>
                            <Row className="EditorSpace">
                                <Col xl={6} className="EditorSize">
                                    <Tabs
                                        id="controlled-tab-example"
                                        className="mb-3"
                                    >
                                        <Tab eventKey="Content" title="Content">

                                            <CKEditor
                                                value={content}
                                                key={"content-editor"}
                                                editor={ClassicEditor}
                                                onChange={ckeditorstate}
                                                config={
                                                    {
                                                        ckfinder: {
                                                            uploadUrl: '/upload',
                                                            withCredentials: true,
                                                            headers: {
                                                                'X-CSRF-TOKEN': 'CSFR-Token',
                                                                Authorization: 'Bearer <JSON Web Token>'
                                                            }
                                                        },
                                                        mediaEmbed: {
                                                            providers: [
                                                                {

                                                                }
                                                            ]
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
            </Container >
        </div >
    )
}