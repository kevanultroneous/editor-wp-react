import axios from "axios"
import { Markup } from "interweave"
import React, { useEffect, useState } from "react"
import { Container } from "react-bootstrap"
import toast, { Toaster } from "react-hot-toast"
import { useNavigate, useParams } from "react-router-dom"
import Header from "./common/Header"
export default function ViewPost() {
    const { postid, gpostid } = useParams()
    const [postData, setPostData] = useState([])
    const navigate = useNavigate()
    useEffect(() => {
        fetchParamPost()
    }, [])

    const fetchParamPost = () => {
        axios.get(`http://192.168.1.28:8000/get-post/${postid}`)
            .then((r) => {
                if (r.data.success) {
                    if (r.data?.data === null) {
                        navigate("/home")
                    }
                    setPostData(r.data.data)
                }
            }).catch((e) => {
                navigate("/home")
                toast.error(e.response.data.msg)
            })
    }

    return (
        <div>
            <Toaster
                position="top-right"
                reverseOrder={false}
            />
            <Header />
            <div className="mt-5">
                <Container>
                    <Markup content={postData.content} />
                </Container>
            </div>
        </div>
    )
}