import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import Header from "../common/Header";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";

function Home() {
    return (
        <>
            <Header />
            <Container fluid >
                <div className="p-3">
                    <Link to={'/press-release'}>Go to Press Release</Link><br />
                    <Link to={'/guest-post'}>Go to Guest Post</Link><br />
                </div>
            </Container>
        </>
    )
}

export default Home