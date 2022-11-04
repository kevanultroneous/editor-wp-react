import axios from "axios"
import { Markup } from "interweave"
import React, { useEffect, useState } from "react"
import { Container } from "react-bootstrap"
import toast, { Toaster } from "react-hot-toast"
import { useParams } from "react-router-dom"
import Header from "./common/Header"
export default function ViewPost() {
    const { postid, gpostid } = useParams()
    const [postData, setPostData] = useState([])

    useEffect(() => {
        fetchParamPost()
    }, [])

    const fetchParamPost = () => {
        axios.get(`http://192.168.1.28:8000/get-post/${postid}`)
            .then((r) => {
                if (r.data.success) {
                    setPostData(r.data.data)
                }
            }).catch((e) => toast.error(e.response.data.msg))
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