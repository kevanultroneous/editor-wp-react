import { Button, Col, Container, Row, Table } from "react-bootstrap"
import React, { useEffect, useState } from "react"
import Header from "../common/Header"
import "./style.css"
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"
import toast, { Toaster } from "react-hot-toast";
import DeleteModel from "../common/DeleteModel";
import { defaultUrl } from "../../utils/default";

const PressRelease = () => {
    const navigate = useNavigate()
    const [postData, setPostData] = useState([])
    const [deleteShow, setDeleteShow] = useState(false)
    const [currentPost, setCurrentPost] = useState("")
    const [currentPostId, setCurrentPostId] = useState("")

    const handleDeleteShow = () => setDeleteShow(true)
    const handleDeleteHide = () => setDeleteShow(false)

    const handleDelete = (id, title) => {
        handleDeleteShow()
        setCurrentPostId(id)
        setCurrentPost(title)
    }

    const timestampToDate = (ts) => {
        return new Date(ts).getDate() + "-" + new Date(ts).getMonth() + "-" + new Date(ts).getFullYear()
    }

    useEffect(() => {
        fetchPosts()
    }, [])

    const fetchPosts = () => {
        axios.get(`${defaultUrl}api/post/get-all-post/0`)
            .then((r) => {
                if (r.data.success) {
                    setPostData(r.data.data)
                }
            })
            .catch((e) => toast.error(e.response.data.msg))
    }

    const deletePosts = () => {
        axios.post(`${defaultUrl}api/post/delete-post`, { postid: currentPostId })
            .then((r) => {
                if (r.data.success) {
                    handleDeleteHide()
                    setCurrentPost("")
                    setCurrentPostId("")
                    fetchPosts()
                }
            })
            .catch((e) => toast.error(e.response.data.msg))
    }

    return (
        <>
            <Toaster
                position="top-right"
                reverseOrder={false}
            />
            <Header />
            <DeleteModel
                title={"Delete Press Release"}
                mentionText={`Are you sure to delete this ${currentPost} Press Release ?`}
                show={deleteShow}
                onHide={handleDeleteHide}
                handleYes={deletePosts}
                handleNo={handleDeleteHide}
            />
            <Container fluid>
                <Row className="AddActionSpace">
                    <Col xl={12}>
                        <Button variant="success" onClick={() => navigate('/upload-post/press-release')}>Add new PressRelease</Button>
                    </Col>
                </Row>
                <Row className="TableSpace">

                    <Col xl={6}>
                        <Table striped bordered hover variant="dark">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Title</th>
                                    <th>Author</th>
                                    <th>Status</th>
                                    <th>Published Date</th>
                                    <th colSpan={3}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    postData != null ?
                                        postData.map((v, i) =>
                                            <tr key={i}>
                                                <td>{i + 1}</td>
                                                <td>{v.title}</td>
                                                <td>{v.author}</td>
                                                <td>{v.status === 1 ? "Published" : "Drafted"}</td>
                                                <td>{timestampToDate(v.date)}</td>
                                                <td>
                                                    <Link to={`/view-press-release/${v._id}`}>
                                                        <Button variant="primary" style={{ width: "100%" }}>View</Button>
                                                    </Link>
                                                </td>
                                                <td><Button variant="info" style={{ width: "100%" }} onClick={() => navigate(`/edit-post/${v._id}`)}>Edit</Button></td>
                                                <td><Button
                                                    onClick={() => handleDelete(v._id, v.title)}
                                                    variant="danger"
                                                    style={{ width: "100%" }}>Delete</Button></td>
                                            </tr>)
                                        :
                                        <h1>No data</h1>
                                }
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
export default PressRelease