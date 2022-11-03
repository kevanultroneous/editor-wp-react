import { Button, Col, Container, Row, Spinner, Table } from "react-bootstrap"
import React, { useEffect, useState } from "react"
import Header from "../common/Header"
import "./style.css"
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import axios from "axios"
import toast, { Toaster } from "react-hot-toast";

const GuestPost = () => {
    const navigate = useNavigate()
    const [postData, setPostData] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchPosts()
    }, [])

    const fetchPosts = () => {
        setLoading(true)
        axios.get('http://192.168.1.28:8000/get-all-post/1')
            .then((r) => {
                setLoading(false)
                if (r.data.success) {
                    setPostData(r.data.data)
                }
            })
            .catch((e) => {
                setLoading(false)
                toast.error(e.response.data.msg)
            })
    }

    const timestampToDate = (ts) => {
        return new Date(ts).getDate() + "-" + new Date(ts).getMonth() + "-" + new Date(ts).getFullYear()
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
                        <Button variant="success" onClick={() => navigate('/upload-post')}>Add new PressRelease</Button>
                    </Col>
                </Row>
                <Row className="TableSpace">
                    {
                        loading &&
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    }
                    <Col xl={6}>
                        {
                            postData == null && !loading ?
                                <h1>No data</h1>
                                :
                                <Table striped bordered hover variant="dark">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Title</th>
                                            <th>Author</th>
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
                                                        <td>{timestampToDate(v.date)}</td>
                                                        <td><Button variant="primary" style={{ width: "100%" }}>View</Button></td>
                                                        <td><Button variant="info" style={{ width: "100%" }}>Edit</Button></td>
                                                        <td><Button variant="danger" style={{ width: "100%" }}>Delete</Button></td>

                                                    </tr>)
                                                :
                                                <h1>No data</h1>
                                        }
                                    </tbody>
                                </Table>
                        }
                    </Col>
                </Row>
            </Container>
        </>
    )
}
export default GuestPost