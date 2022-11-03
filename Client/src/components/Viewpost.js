import React from "react"
import { useParams } from "react-router-dom"
import Header from "./common/Header"
export default function ViewPost() {
    const { postid, gpostid } = useParams()
    return (
        <div>
            {postid ? "pressrelease" : gpostid ? "guestpost" : null}
            <Header />
        </div>
    )
}