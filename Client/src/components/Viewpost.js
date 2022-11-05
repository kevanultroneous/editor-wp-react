import axios from "axios"
import { Markup } from "interweave"
import React, { useEffect, useState } from "react"
import { Container } from "react-bootstrap"
import toast, { Toaster } from "react-hot-toast"
import { useNavigate, useParams } from "react-router-dom"
import { defaultUrl } from "../utils/default"
import Header from "./common/Header"
export default function ViewPost() {
    const { postid, gpostid } = useParams()
    const [postData, setPostData] = useState([])
    const navigate = useNavigate()
    useEffect(() => {
        fetchParamPost()
    }, [])

    const fetchParamPost = () => {
        axios.get(`${defaultUrl}api/post/get-post/${postid || gpostid}`)
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
                    <h1>{gpostid}</h1>
                    <h2>{JSON.stringify(postData.content)}</h2>
                    <div>
                        <Markup content={postData?.content} />
                    </div>
                </Container>
                <Container>

                </Container>
            </div>
        </div>
    )
}