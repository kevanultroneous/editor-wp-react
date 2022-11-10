import React, { useState } from 'react'
import axios from "axios"

import { Markup } from 'interweave';

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import { Button, Col, Container, FloatingLabel, Form, Row } from "react-bootstrap"
import "./style.css"
import { AiFillEye, AiFillEyeInvisible, AiFillHtml5, AiFillSave, AiTwotoneTool } from "react-icons/ai"
export default function Contact() {
    const [content, setContent] = useState('')
    // const [fetched, setFetched] = useState([])
    const [preview, setPreview] = useState(false)
    const [editHtml, setEditHtml] = useState(false)
    const [allowEdit, setAllowEdit] = useState(false)


    const ckeditorstate = (event, editor) => {
        const data = editor.getData();
        setContent(data)
    }


    const handlesubmit = (draft = false) => {
        axios.post("http://192.168.1.28:8000/save", { data: content, draft: draft }).then((r) => {
            if (r.data.success) {
                alert(!draft ? 'post uploaded successfully !' : 'draft saved successfully !')
                if (!draft) {
                    setContent("")
                } else {
                    setEditHtml(false)
                }
            }
        }).catch((e) => {
            if (e.response) {
                alert(e.response.data.msg)
            }
        })
    }

    return (
        <Container fluid>
            <Row className="EditorSpace">
                <Col xl={5} className="EditorSize">
                    <div id="hu">
                    <CKEditor
                            editor={ClassicEditor}
                            data=""
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
                            // onChange={this.AddproductInformation}
                          />
                    {/* <CKEditor
                       
                        data={content}
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
                        /> */}
                        </div>

                </Col>
                {
                    preview && !editHtml &&
                    <Col xl={7}>
                        <h3>
                            <strong>Preview</strong>
                        </h3>
                        <div>
                            <Markup content={content} />
                        </div>
                        <Button onClick={() => handlesubmit(false)}>Post now</Button>
                    </Col>
                }
            </Row>
            <Row className="ActionButtonSpace">
                {
                    content.length <= 0 || content === null || content === "" ? null :
                        <Col xl={12}>
                            {
                                !preview &&
                                <Button variant='dark' onClick={() => content.length <= 0 || content === null || content === "" ? alert('Please import or write content') : handlesubmit(true)}>Save Draft <AiFillSave /></Button>
                            }
                            {
                                !editHtml &&
                                <Button variant='warning' className='btnSpace' onClick={() => {
                                    content.length <= 0 || content === null || content === "" ? alert('Please import or write content') :
                                        setPreview(!preview)
                                }}>{preview ? <>Close Preview <AiFillEyeInvisible /> </> : <>Preview <AiFillEye /> </>}</Button>
                            }

                            <Button variant='info' className='btnSpace' onClick={() => {
                                content.length <= 0 || content === null || content === "" ? alert('Please import or write content') :
                                    setEditHtml(!editHtml)
                            }}>{editHtml ? <>Close edit Html <AiFillHtml5 /></> : <>Edit Html <AiFillHtml5 /></>}</Button>
                        </Col>
                }
                {
                    editHtml &&
                    <>
                        <Col xl={6} className="EditorController">
                            <FloatingLabel>
                                <Form.Control
                                    disabled={!allowEdit}
                                    className='EditHtml'
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    as="textarea"
                                    placeholder="write or edit html"
                                    style={{ height: '500px' }}
                                />
                            </FloatingLabel>
                        </Col>
                        <Col xl={12}>
                            <Button variant='dark' onClick={() => setAllowEdit(!allowEdit)}>{allowEdit ? <>Close editing <AiTwotoneTool /></> : <>Allow to Edit <AiTwotoneTool /></>}</Button>
                            <Button onClick={() => handlesubmit(false)} className='btnSpace'>Post now</Button>
                        </Col>
                    </>
                }

            </Row>

        </Container>
    )
}